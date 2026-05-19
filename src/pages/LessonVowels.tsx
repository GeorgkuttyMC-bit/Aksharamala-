import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Volume2, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import confetti from "canvas-confetti";

export function LessonVowels() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const lessonData = [
    { letter: "അ", sound: "a", word: "അമ്മ", meaning: "Mother (Amma)", image: "👩‍👧", color: "bg-rose-500" },
    { letter: "ആ", sound: "aa", word: "ആന", meaning: "Elephant (Aana)", image: "🐘", color: "bg-blue-500" },
    { letter: "ഇ", sound: "i", word: "ഇല", meaning: "Leaf (Ila)", image: "🍃", color: "bg-emerald-500" },
    { letter: "ഈ", sound: "ii", word: "ഈച്ച", meaning: "Housefly (Eechha)", image: "🪰", color: "bg-orange-500" },
    { letter: "ഉ", sound: "u", word: "ഉറുമ്പ്", meaning: "Ant (Urumba)", image: "🐜", color: "bg-purple-500" },
    { letter: "ഊ", sound: "uu", word: "ഊണ്", meaning: "Meal (Oonu)", image: "🍛", color: "bg-cyan-500" },
    { letter: "ഋ", sound: "ru", word: "ഋഷി", meaning: "Sage (Rishi)", image: "🧘", color: "bg-amber-500" },
    { letter: "എ", sound: "e", word: "എലി", meaning: "Rat (Eli)", image: "🐀", color: "bg-lime-500" },
    { letter: "ഏ", sound: "ee", word: "ഏണി", meaning: "Ladder (Eani)", image: "🪜", color: "bg-teal-500" },
    { letter: "ഐ", sound: "ai", word: "ഐസ്ക്രീം", meaning: "Ice cream (Icecream)", image: "🍦", color: "bg-indigo-500" },
    { letter: "ഒ", sound: "o", word: "ഒട്ടകം", meaning: "Camel (Ottakam)", image: "🐫", color: "bg-pink-500" },
    { letter: "ഓ", sound: "oo", word: "ഓടം", meaning: "Boat (Odam)", image: "⛵", color: "bg-fuchsia-500" },
    { letter: "ഔ", sound: "au", word: "ഔഷധം", meaning: "Medicine (Oushadham)", image: "💊", color: "bg-red-500" },
    { letter: "അം", sound: "am", word: "അമ്പിളി", meaning: "Moon (Ambili)", image: "🌙", color: "bg-slate-500" },
    { letter: "അഃ", sound: "ah", word: "ദുഃഖം", meaning: "Sorrow (Dukham)", image: "😢", color: "bg-zinc-500" },
  ];

  const handleNext = () => {
    if (step < lessonData.length - 1) {
      setStep(step + 1);
    } else {
      // Finish
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        navigate("/map");
      }, 3000);
    }
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ml-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log(`Speech Synthesis not supported. Would have said: ${text}`);
    }
  };

  useEffect(() => {
    // Attempt to auto-play audio for the current letter when step changes
    playAudio(lessonData[step].letter);
  }, [step]);

  const current = lessonData[step];

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <button 
          onClick={() => navigate("/map")}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="flex h-4 w-48 overflow-hidden rounded-full bg-amber-200">
           <motion.div 
             className="h-full bg-amber-500" 
             initial={{ width: `${(step / lessonData.length) * 100}%` }}
             animate={{ width: `${((step + 1) / lessonData.length) * 100}%` }}
             transition={{ duration: 0.5 }}
           />
        </div>
        <div className="w-14" /> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-6">
         <AnimatePresence mode="wait">
            <motion.div
               key={step}
               initial={{ x: 50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -50, opacity: 0 }}
               transition={{ type: "spring", bounce: 0.4 }}
               className="flex w-full max-w-lg flex-col items-center gap-8"
            >
               {/* Large Letter Card */}
               <div 
                 className={`relative flex aspect-square w-full max-w-sm flex-col items-center justify-center rounded-[3rem] ${current.color} shadow-2xl overflow-hidden`}
               >
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => playAudio(current.letter)}
                   className="absolute top-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                 >
                   <Volume2 className="h-8 w-8" />
                 </motion.button>
                 
                 <h1 className="font-ml text-[12rem] leading-none font-bold text-white drop-shadow-lg">
                   {current.letter}
                 </h1>
               </div>

               {/* Word Association */}
               <div className="flex w-full flex-col items-center gap-4 rounded-3xl bg-white p-8 shadow-sm border-2 border-amber-100">
                  <div className="flex items-center gap-6">
                     <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-6xl shadow-inner">
                        {current.image}
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                           <h2 
                             className="font-ml text-5xl font-bold text-slate-800 cursor-pointer hover:text-slate-600 transition-colors"
                             onClick={() => playAudio(current.word)}
                           >
                             {current.word}
                           </h2>
                           <button onClick={() => playAudio(current.word)} className="text-blue-500 hover:text-blue-600">
                              <PlayCircle className="h-8 w-8" />
                           </button>
                        </div>
                        <p className="text-xl font-medium text-slate-500">{current.meaning}</p>
                     </div>
                  </div>
               </div>
            </motion.div>
         </AnimatePresence>
      </main>

      {/* Footer controls */}
      <footer className="p-6 pb-12 flex justify-center">
         <Button 
           size="lg" 
           variant="primary" 
           onClick={handleNext}
           className="h-20 w-full max-w-lg text-3xl font-black bg-blue-500 shadow-[0_6px_0_0_#2563eb] hover:bg-blue-400 border-none"
         >
           {step < lessonData.length - 1 ? "Next!" : "Finish!"} <ArrowRight className="ml-4 h-8 w-8" />
         </Button>
      </footer>
    </div>
  );
}
