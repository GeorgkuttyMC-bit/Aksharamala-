import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "നമസ്കാരം! 🐘 ഞാൻ അപ്പു, നിങ്ങളുടെ മലയാളം ടീച്ചർ. നിങ്ങൾക്ക് ഇന്ന് എന്താണ് പഠിക്കേണ്ടത്?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMessages(prev => [...prev, { role: "assistant", content: "Oops! 🙊 I need microphone permission to hear you. Please allow microphone access in your browser." }]);
        } else if (event.error === 'no-speech') {
          // just ignore or maybe notify
        } else {
          setMessages(prev => [...prev, { role: "assistant", content: `Oops! 🙊 Microphone error: ${event.error}` }]);
        }
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev.length > 0 ? " " : "") + transcript);
      };

      recognitionRef.current = recognition;
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, []);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recognitionRef.current) {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! 🙊 Voice input is not supported in this browser." }]);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition", err);
      }
    }
  };
  
  const toggleVoiceOutput = () => {
    setIsVoiceOutputEnabled(prev => !prev);
    if (isVoiceOutputEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    // Strip emojis and basic markdown to make it sound better
    const cleanText = text.replace(/([^\w\s\u0d00-\u0d7f]+)/g, '').replace(/\*|#|_|~/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ml-IN"; // Set to Malayalam
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Make it sound a bit more playful
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed context");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      speakText(data.answer);
    } catch (error: any) {
      const errorMsg = `Oops! 🙊 ${error.message || "I couldn't reach the server."}`;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg }
      ]);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Ask AI Teacher"
      >
        <Bot className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
          >
            {/* Header */}
            <div className="bg-amber-500 p-4 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                  🐘
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg leading-tight">അപ്പു (Appu)</h3>
                  <span className="text-xs font-medium text-amber-100">AI Malayalam Teacher</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoiceOutput}
                  className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                  title={isVoiceOutputEnabled ? "Mute voice output" : "Enable voice output"}
                >
                  {isVoiceOutputEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl p-3 text-sm font-ui leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-amber-100 text-amber-900 rounded-tr-sm" 
                        : "bg-white text-stone-700 shadow-sm border border-stone-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-stone">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-stone-700 shadow-sm border border-stone-100 p-4 rounded-2xl rounded-tl-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-stone-100 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="അപ്പുവിനോട് ഒരു ചോദ്യം ചോദിക്കുക..."
                className="flex-1 px-4 py-2 bg-stone-100 border-transparent focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-200 rounded-full text-sm font-ui outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-full bg-amber-500 text-white disabled:bg-stone-300 disabled:text-stone-500 transition-colors hover:bg-amber-600 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
