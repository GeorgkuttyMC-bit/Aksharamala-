export const playIndianAudio = (text: string, onEnd?: () => void, options?: { pitch?: number, rate?: number, cancel?: boolean }) => {
  if (!('speechSynthesis' in window)) {
    console.log(`Speech Synthesis not supported. Would have said: ${text}`);
    if (onEnd) onEnd();
    return;
  }
  
  if (options?.cancel !== false) {
    window.speechSynthesis.cancel();
  }
  
  // Use setTimeout to ensure cancel() has completed before creating and speaking the new utterance.
  setTimeout(() => {
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
    
    const speak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const mlVoice = voices.find(v => v.lang.includes('ml'));
        const inVoice = voices.find(v => v.lang.includes('IN'));
        if (mlVoice) utterance.voice = mlVoice;
        else if (inVoice) utterance.voice = inVoice;
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
  }, 50);
};

export const stopAudio = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
