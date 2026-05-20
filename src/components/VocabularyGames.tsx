import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CopyCheck, HelpCircle, Trophy } from "lucide-react";

interface WordData {
  letter: string;
  word: string;
  meaning: string;
  image: string;
}

interface VocabularyGamesProps {
  items: WordData[];
}

export function VocabularyGames({ items }: VocabularyGamesProps) {
  const [gameType, setGameType] = useState<"matching" | "fill">("matching");
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  
  // Game state
  const [options, setOptions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const startGame = (type: "matching" | "fill") => {
    setGameType(type);
    setScore(0);
    setPlaying(true);
    generateQuestion(type);
  };

  const generateQuestion = (type: "matching" | "fill") => {
    setFeedback(null);
    const randomItems = [...items].sort(() => 0.5 - Math.random()).slice(0, 4);
    const target = randomItems[0];
    
    if (type === "matching") {
      setOptions(randomItems.sort(() => 0.5 - Math.random()));
      setCurrentQuestion(target);
    } else {
      // fill in the blanks: guess the starting letter
      const mainWord = target.word;
      const startingLetter = target.letter;
      
      // Sometimes the starting letter is complex or not simply a prefix string due to unicode modifiers, 
      // but for our dataset (like 'അമ്മ' starts with 'അ', 'കപ്പൽ' starts with 'ക') it should mostly match at index 0.
      let displayPrompt = mainWord;
      if (mainWord.startsWith(startingLetter)) {
        displayPrompt = "_" + mainWord.slice(startingLetter.length);
      } else {
        // Fallback if not an exact prefix
        displayPrompt = "_ " + mainWord;
      }
      
      const optionLetters = new Set<string>();
      optionLetters.add(startingLetter);
      while(optionLetters.size < 4) {
        const randItem = items[Math.floor(Math.random() * items.length)];
        optionLetters.add(randItem.letter);
      }
      
      setOptions(Array.from(optionLetters).sort(() => 0.5 - Math.random()));
      setCurrentQuestion({
        ...target,
        displayPrompt,
        missingChar: startingLetter
      });
    }
  };

  const checkAnswer = (answer: string) => {
    let isCorrect = false;
    if (gameType === "matching") {
      isCorrect = answer === currentQuestion.word;
    } else {
      isCorrect = answer === currentQuestion.missingChar;
    }

    if (isCorrect) {
      setFeedback("correct");
      setScore(s => s + 1);
      setTimeout(() => generateQuestion(gameType), 1500);
    } else {
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  if (!playing) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm text-center">
        <div className="flex justify-center gap-4 mb-6">
          <Trophy className="text-amber-500 w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold font-sans text-stone-900 mb-2">പദവിനോദങ്ങൾ (Word Games)</h3>
        <p className="text-stone-500 mb-8 max-w-md mx-auto">
          Learn new words through interactive games. Play matching or fill-in-the-blanks!
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => startGame("matching")}
            className="px-6 py-4 bg-amber-50 text-amber-700 font-bold rounded-2xl hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
          >
            <CopyCheck className="w-5 h-5" />
            വാക്കുകൾ ചേരുമ്പടി ചേർക്കാം (Matching)
          </button>
          
          <button 
            onClick={() => startGame("fill")}
            className="px-6 py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-5 h-5" />
            വിട്ടഭാഗം പൂരിപ്പിക്കാം (Fill Blanks)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="font-bold text-stone-500">
          സ്കോർ (Score): <span className="text-amber-500 text-xl">{score}</span>
        </div>
        <button 
          onClick={() => setPlaying(false)}
          className="text-stone-400 hover:text-stone-600 font-medium text-sm"
        >
          Exit Game
        </button>
      </div>

      <div className="text-center mb-8">
        {gameType === "matching" ? (
          <>
            <div className="text-6xl mb-4">{currentQuestion.image}</div>
            <h4 className="text-xl font-bold text-stone-700">{currentQuestion.meaning}</h4>
            <p className="text-stone-500">Select the correct Malayalam word</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">{currentQuestion.image}</div>
            <div className="flex justify-center gap-1 mb-4 font-ml font-bold text-4xl text-stone-700">
              <span className="text-amber-500 mr-1">_</span>
              <span>{currentQuestion.displayPrompt.replace(/^_ ?/, '')}</span>
            </div>
            <p className="text-stone-500">Choose the missing starting letter for {currentQuestion.meaning}</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, i) => (
          <button
            key={i}
            disabled={feedback !== null}
            onClick={() => checkAnswer(gameType === "matching" ? opt.word : opt)}
            className={`p-6 rounded-2xl border-2 font-ml font-bold text-2xl transition-all ${
              feedback === "correct" && (gameType === "matching" ? opt.word === currentQuestion.word : opt === currentQuestion.missingChar)
                ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                : feedback === "incorrect"
                ? "bg-zinc-50 border-zinc-200 text-zinc-400"
                : "bg-stone-50 border-stone-200 text-stone-700 hover:border-amber-400 hover:bg-amber-50"
            }`}
          >
            {gameType === "matching" ? opt.word : opt}
          </button>
        ))}
      </div>
      
      <div className="h-12 mt-6 flex items-center justify-center">
        {feedback === "correct" && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500 font-bold text-xl flex items-center gap-2">
            ✨ നന്ന്! (Very Good!) ✨
          </motion.div>
        )}
        {feedback === "incorrect" && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-rose-500 font-bold text-xl">
            ഒന്നുകൂടി ശ്രമിക്കൂ (Try again)
          </motion.div>
        )}
      </div>
    </div>
  );
}
