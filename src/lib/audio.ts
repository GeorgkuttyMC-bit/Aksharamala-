export const playIndianAudio = (text: string, onEnd?: () => void, options?: { pitch?: number, rate?: number, cancel?: boolean }) => {
  if (!('speechSynthesis' in window)) {
    console.log(`Speech Synthesis not supported. Would have said: ${text}`);
    if (onEnd) onEnd();
    return;
  }
  
  if (options?.cancel !== false) {
    window.speechSynthesis.cancel();
  }
  
  // Use setTimeout to avoid the Windows Chrome cancel() bug
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ml-IN';
    utterance.rate = options?.rate || 0.8;
    if (options?.pitch) utterance.pitch = options?.pitch;
    
    // Prevent garbage collection
    (window as any)._currentUtterance = utterance;
    
    // Try to find a specific Malayalam voice or Indian English/Hindi voice if ml-IN is not available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const mlVoice = voices.find(v => v.lang.includes('ml'));
      const inVoice = voices.find(v => v.lang.includes('IN')); // Fallback to any Indian voice
      if (mlVoice) utterance.voice = mlVoice;
      else if (inVoice) utterance.voice = inVoice;
    }
    
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    
    window.speechSynthesis.speak(utterance);
  }, 50);
};

export const stopAudio = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
