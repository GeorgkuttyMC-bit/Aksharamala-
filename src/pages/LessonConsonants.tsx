import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Volume2, ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import confetti from "canvas-confetti";

export function LessonConsonants() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const lessonData = [
    { letter: "ക", word: "കപ്പൽ", meaning: "Ship (Kappal)", image: "🚢", color: "bg-blue-500" },
    { letter: "ഖ", word: "മുഖം", meaning: "Face (Mukham)", image: "😌", color: "bg-orange-500" },
    { letter: "ഗ", word: "ഗാനം", meaning: "Song (Gaanam)", image: "🎵", color: "bg-purple-500" },
    { letter: "ഘ", word: "ഘടികാരം", meaning: "Clock (Ghadikaaram)", image: "🕰️", color: "bg-emerald-500" },
    { letter: "ങ", word: "മാങ്ങ", meaning: "Mango (Maanga)", image: "🥭", color: "bg-yellow-500" },
    
    { letter: "ച", word: "ചക്രം", meaning: "Wheel (Chakram)", image: "🛞", color: "bg-red-500" },
    { letter: "ഛ", word: "ഛത്രി", meaning: "Umbrella (Chhathri)", image: "🌂", color: "bg-indigo-500" },
    { letter: "ജ", word: "ജലം", meaning: "Water (Jalam)", image: "💧", color: "bg-cyan-500" },
    { letter: "ഝ", word: "ഝഷം", meaning: "Fish (Jhasham)", image: "🐟", color: "bg-teal-500" },
    { letter: "ഞ", word: "ഞണ്ട്", meaning: "Crab (Njandu)", image: "🦀", color: "bg-rose-500" },
    
    { letter: "ട", word: "കുട്ട", meaning: "Basket (Kutta)", image: "🧺", color: "bg-amber-500" },
    { letter: "ഠ", word: "പാഠം", meaning: "Lesson (Paatham)", image: "📖", color: "bg-lime-500" },
    { letter: "ഡ", word: "ഗരുഡൻ", meaning: "Eagle (Garudan)", image: "🦅", color: "bg-slate-500" },
    { letter: "ഢ", word: "ഡമരു", meaning: "Drum (Damaru)", image: "🥁", color: "bg-fuchsia-500" },
    { letter: "ണ", word: "വീണ", meaning: "Veena (Veena)", image: "🪕", color: "bg-orange-400" },
    
    { letter: "ത", word: "തത്ത", meaning: "Parrot (Thatha)", image: "🦜", color: "bg-green-500" },
    { letter: "ഥ", word: "രഥം", meaning: "Chariot (Ratham)", image: "🛺", color: "bg-yellow-600" },
    { letter: "ദ", word: "ദന്തം", meaning: "Tooth (Dantham)", image: "🦷", color: "bg-slate-400" },
    { letter: "ധ", word: "ധനം", meaning: "Money (Dhanam)", image: "💰", color: "bg-emerald-600" },
    { letter: "ന", word: "നായ", meaning: "Dog (Naaya)", image: "🐕", color: "bg-amber-600" },
    
    { letter: "പ", word: "പശു", meaning: "Cow (Pashu)", image: "🐄", color: "bg-stone-500" },
    { letter: "ഫ", word: "ഫലം", meaning: "Fruit (Phalam)", image: "🍎", color: "bg-red-600" },
    { letter: "ബ", word: "ബലൂൺ", meaning: "Balloon (Balloon)", image: "🎈", color: "bg-blue-400" },
    { letter: "ഭ", word: "ഭവനം", meaning: "House (Bhavanam)", image: "🏠", color: "bg-orange-600" },
    { letter: "മ", word: "മയിൽ", meaning: "Peacock (Mayil)", image: "🦚", color: "bg-teal-600" },
    
    { letter: "യ", word: "യന്ത്രം", meaning: "Machine (Yanthram)", image: "⚙️", color: "bg-zinc-500" },
    { letter: "ര", word: "രവി", meaning: "Sun (Ravi)", image: "☀️", color: "bg-yellow-400" },
    { letter: "ല", word: "ലത", meaning: "Vine (Latha)", image: "🌿", color: "bg-green-600" },
    { letter: "വ", word: "വണ്ടി", meaning: "Vehicle (Vandi)", image: "🚗", color: "bg-red-400" },
    { letter: "ശ", word: "ശംഖ്", meaning: "Conch (Shankh)", image: "🐚", color: "bg-orange-300" },
    
    { letter: "ഷ", word: "പുഷ്പം", meaning: "Flower (Pushpam)", image: "🌸", color: "bg-pink-400" },
    { letter: "സ", word: "സിംഹം", meaning: "Lion (Simham)", image: "🦁", color: "bg-amber-700" },
    { letter: "ഹ", word: "ഹംസം", meaning: "Swan (Hamsam)", image: "🦢", color: "bg-slate-300" },
    { letter: "ള", word: "താഴികക്കുടം", meaning: "Dome (Thazhikakkudam)", image: "🕌", color: "bg-emerald-400" },
    { letter: "ഴ", word: "മഴ", meaning: "Rain (Mazha)", image: "🌧️", color: "bg-blue-600" },
    { letter: "റ", word: "പറവ", meaning: "Bird (Parava)", image: "🐦", color: "bg-purple-400" },
  ];

  type LessonStep = 
    | { type: 'learn', dataIndex: number }
    | { type: 'quiz', dataIndex: number, options: number[] };

  const sequence = useMemo(() => {
    const seq: LessonStep[] = [];
    for (let i = 0; i < lessonData.length; i++) {
      seq.push({ type: 'learn', dataIndex: i });
      // Every 5 items, add a quiz
      if ((i + 1) % 5 === 0) {
        // Generate options (correct + 2 random incorrect)
        const correct = i;
        const opts = new Set<number>([correct]);
        while (opts.size < 3) {
          const rand = Math.floor(Math.random() * lessonData.length);
          opts.add(rand);
        }
        seq.push({ 
          type: 'quiz', 
          dataIndex: i, // Test the current item
          options: Array.from(opts).sort(() => Math.random() - 0.5) 
        });
      }
    }
    return seq;
  }, []);

  const handleNext = () => {
    if (sequence[step].type === 'quiz' && !quizAnswered) {
      return;
    }
    if (step < sequence.length - 1) {
      setStep(step + 1);
      setQuizAnswered(false);
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
      utterance.lang = 'ml-IN'; // Ensure Malayalam is used
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log(`Speech Synthesis not supported. Would have said: ${text}`);
    }
  };

  useEffect(() => {
    if (sequence[step].type === 'learn') {
      playAudio(lessonData[sequence[step].dataIndex].letter);
    } else {
      playAudio("Where is " + lessonData[sequence[step].dataIndex].letter + "?");
    }
  }, [step]);

  const currentStep = sequence[step];
  const current = lessonData[currentStep.dataIndex];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <button 
          onClick={() => navigate("/map")}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="flex h-4 w-48 overflow-hidden rounded-full bg-slate-200">
           <motion.div 
             className="h-full bg-slate-500" 
             initial={{ width: `${(step / sequence.length) * 100}%` }}
             animate={{ width: `${((step + 1) / sequence.length) * 100}%` }}
             transition={{ duration: 0.5 }}
           />
        </div>
        <div className="w-14 text-sm font-bold text-slate-500 text-center">
          {step + 1} / {sequence.length}
        </div>
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
               {currentStep.type === 'learn' ? (
                 <>
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
                   <div className="flex w-full flex-col items-center gap-4 rounded-3xl bg-white p-8 shadow-sm border-2 border-slate-200">
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
                 </>
               ) : (
                 /* Quiz Interface */
                 <div className="flex flex-col items-center gap-8 w-full">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">
                      Find the matching letter!
                    </h2>
                    
                    <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-200 w-full">
                        <div className="flex items-center justify-center text-8xl mb-4">
                           {current.image}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 font-ml">
                          {current.word.replace(current.letter, "_".repeat(current.letter.length))}
                        </h3>
                        <p className="text-slate-500 mb-6">{current.meaning}</p>
                        
                        <div className="grid grid-cols-3 gap-4 w-full">
                          {currentStep.options.map((optIndex, i) => (
                             <motion.button
                               key={i}
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               onClick={() => {
                                 if (optIndex === currentStep.dataIndex) {
                                   playAudio("Correct!");
                                   setQuizAnswered(true);
                                   confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
                                 } else {
                                   playAudio("Try again!");
                                 }
                               }}
                               className={`h-24 rounded-2xl text-4xl font-ml font-bold border-4 transition-colors ${
                                 quizAnswered && optIndex === currentStep.dataIndex
                                   ? 'bg-green-100 border-green-500 text-green-700'
                                   : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                               }`}
                             >
                               {lessonData[optIndex].letter}
                             </motion.button>
                          ))}
                        </div>
                    </div>
                 </div>
               )}
            </motion.div>
         </AnimatePresence>
      </main>

      {/* Footer controls */}
      <footer className="p-6 pb-12 flex justify-center">
         {(currentStep.type === 'learn' || quizAnswered) ? (
           <Button 
             size="lg" 
             variant="primary" 
             onClick={handleNext}
             className="h-20 w-full max-w-lg text-3xl font-black bg-blue-500 shadow-[0_6px_0_0_#2563eb] hover:bg-blue-400 border-none"
           >
             {step < sequence.length - 1 ? "Next!" : "Finish!"} <ArrowRight className="ml-4 h-8 w-8" />
           </Button>
         ) : (
           <div className="h-20 w-full max-w-lg flex items-center justify-center text-slate-500 font-bold text-xl">
             Select the correct answer to continue
           </div>
         )}
      </footer>
    </div>
  );
}
