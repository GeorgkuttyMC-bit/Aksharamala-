import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "./ui/button";

export interface QuizItem {
  letter: string;
  word: string;
  meaning: string;
  image: string;
}

interface QuizProps {
  items: QuizItem[];
  title: string;
}

export function Quiz({ items, title }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [options, setOptions] = useState<QuizItem[]>([]);
  const [targetItem, setTargetItem] = useState<QuizItem | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const QUESTIONS_COUNT = 5;

  const generateQuestion = () => {
    if (items.length < 4) return;
    
    // Pick a random target
    const target = items[Math.floor(Math.random() * items.length)];
    
    // Pick 3 other random distinct items
    let others = items.filter((i) => i.letter !== target.letter);
    others = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const currOptions = [target, ...others].sort(() => 0.5 - Math.random());
    
    setTargetItem(target);
    setOptions(currOptions);
    setSelectedLetter(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleSelect = (letter: string) => {
    if (selectedLetter) return; // already answered
    setSelectedLetter(letter);
    
    const isAnsCorrect = targetItem && letter === targetItem.letter;
    
    if (isAnsCorrect) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      setTimeout(() => {
        nextQuestion(true);
      }, 1500);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        nextQuestion(false);
      }, 2000);
    }
  };

  const nextQuestion = (wasCorrect: boolean) => {
    setCurrentQuestion((c) => {
      const nextIndex = c + 1;
      if (nextIndex < QUESTIONS_COUNT) {
        generateQuestion();
        return nextIndex;
      } else {
        setShowResult(true);
        // We use function state to get the most recent score safely
        setScore((currentScore) => {
          if (currentScore >= Math.ceil(QUESTIONS_COUNT / 2)) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
          return currentScore;
        });
        return c;
      }
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    generateQuestion();
  };

  if (!targetItem) return null;

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-3xl border-2 border-stone-100 shadow-sm">
      <h3 className="text-2xl font-bold font-sans text-stone-800 mb-6 text-center">{title} Quiz</h3>
      
      {!showResult ? (
        <div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-sm font-bold text-stone-400 uppercase tracking-wider">Question {currentQuestion + 1} of {QUESTIONS_COUNT}</span>
            <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Score: {score}</span>
          </div>
          
          <div className="flex flex-col items-center mb-10">
            <span className="text-stone-500 font-medium mb-6">Which letter does this word start with?</span>
            <div className="flex items-center gap-6 bg-stone-50 border border-stone-200 px-10 py-8 rounded-3xl">
              <span className="text-7xl drop-shadow-sm">{targetItem.image}</span>
              <div className="flex flex-col">
                <span className="text-4xl font-bold font-ml text-stone-800 mb-1">{targetItem.word}</span>
                <span className="text-lg font-medium text-stone-500">{targetItem.meaning}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((opt) => (
              <button
                key={opt.letter}
                onClick={() => handleSelect(opt.letter)}
                disabled={!!selectedLetter}
                className={`
                  relative flex justify-center items-center py-8 rounded-2xl text-6xl font-bold font-ml transition-all
                  ${!selectedLetter 
                    ? "bg-white hover:bg-stone-50 hover:scale-105 hover:-translate-y-1 border-2 border-stone-200 shadow-sm cursor-pointer" 
                    : selectedLetter === opt.letter 
                      ? (isCorrect ? "bg-green-100 border-2 border-green-500 text-green-700 shadow-md" : "bg-red-100 border-2 border-red-500 text-red-700 shadow-md")
                      : opt.letter === targetItem.letter
                        ? "bg-green-50 border-2 border-green-500 text-green-700" 
                        : "bg-white border-2 border-stone-200 opacity-40 grayscale"
                  }
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  {opt.letter}
                  {selectedLetter === opt.letter && isCorrect && <CheckCircle2 className="text-green-600 h-8 w-8 absolute right-4 top-4" />}
                  {selectedLetter === opt.letter && !isCorrect && <XCircle className="text-red-600 h-8 w-8 absolute right-4 top-4" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-8xl mb-8 animate-bounce">{score >= Math.ceil(QUESTIONS_COUNT / 2) ? "🎉" : "📚"}</div>
          <h4 className="text-4xl font-bold text-stone-800 mb-4">Quiz Complete!</h4>
          <p className="text-xl text-stone-600 mb-10 font-medium">You scored <span className="text-amber-600 font-bold">{score}</span> out of {QUESTIONS_COUNT}</p>
          <Button onClick={resetQuiz} size="lg" className="gap-2 bg-amber-500 hover:bg-amber-600 border-b-4 border-amber-700 text-white rounded-2xl px-8 h-14 text-lg">
            <RotateCcw className="h-5 w-5" /> Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
