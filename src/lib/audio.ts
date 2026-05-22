let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // Proactively trigger voice loading so it's ready before the user clicks
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices();
  });
}

export const playIndianAudio = (text: string, onEnd?: () => void, options?: { pitch?: number, rate?: number, cancel?: boolean }) => {
  if (options?.cancel !== false) {
    stopAudio();
  }

  // Removed isMobile check to ensure we primarily use Google Translate TTS via HTTP
  // which bypasses Android's "Use Wi-Fi only" limitation on native speech synthesis.

  // Use Google Translate TTS as it is much more reliable for Malayalam across all devices (PC, Mac)
  // because OS native voices for Malayalam are often missing on desktop PCs.
  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ml&client=tw-ob`;

  
  if (!currentAudio) {
    currentAudio = new Audio();
  }

  currentAudio.src = url;
  currentAudio.defaultPlaybackRate = options?.rate || 1.0;
  currentAudio.playbackRate = options?.rate || 1.0;
  
  currentAudio.onended = onEnd || null;
  
  currentAudio.onerror = (e) => {
    console.warn("Google TTS failed, falling back to window.speechSynthesis", e);
    // Fallback to SpeechSynthesis
    playWithSpeechSynthesis(text, onEnd, options);
  };

  currentAudio.load();
  currentAudio.play().catch(e => {
    console.warn("Audio play blocked or failed", e);
    // Fallback to SpeechSynthesis if audio is blocked by browser policies
    playWithSpeechSynthesis(text, onEnd, options);
  });
};

const playWithSpeechSynthesis = (text: string, onEnd?: () => void, options?: { pitch?: number, rate?: number }) => {
  if (!('speechSynthesis' in window)) {
    console.log(`Speech Synthesis not supported. Would have said: ${text}`);
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ml-IN';
  utterance.rate = options?.rate || 0.8;
  if (options?.pitch) utterance.pitch = options?.pitch;
  
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      onEnd();
    };
  }
  
  // Prevent garbage collection
  (window as any)._currentUtterance = utterance;
  currentUtterance = utterance;
  
  const speak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const mlVoice = voices.find(v => v.lang.includes('ml') || (v.name && v.name.toLowerCase().includes('malayalam')));
      if (mlVoice) {
        utterance.voice = mlVoice;
      }
      // Do not force an 'IN' voice (like en-IN) because it will fail to read Malayalam script!
    }
    
    window.speechSynthesis.speak(utterance);
    
    // Workaround for Chrome bug where speech synthesis gets stuck
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    let voicesChangedFired = false;
    const onVoicesChanged = () => {
      if (voicesChangedFired) return;
      voicesChangedFired = true;
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      speak();
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    
    // Fallback if event doesn't fire
    setTimeout(() => {
      if (!voicesChangedFired) {
        voicesChangedFired = true;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        speak();
      }
    }, 250);
  } else {
    speak();
  }
};

export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
