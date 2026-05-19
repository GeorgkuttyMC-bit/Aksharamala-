import React, { useState, useEffect, useRef } from "react";
import { Volume2, BookOpen, Clock, Globe, Square } from "lucide-react";
import { motion } from "motion/react";

import { Quiz } from "../components/Quiz";
import { AIAssistant } from "../components/AIAssistant";

const vowels = [
  { letter: "അ", sound: "a", word: "അമ്മ", meaning: "Mother (Amma)", image: "👩‍👧", color: "bg-rose-50 border-rose-200 text-rose-700" },
  { letter: "ആ", sound: "aa", word: "ആന", meaning: "Elephant (Aana)", image: "🐘", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { letter: "ഇ", sound: "i", word: "ഇല", meaning: "Leaf (Ila)", image: "🍃", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { letter: "ഈ", sound: "ii", word: "ഈച്ച", meaning: "Housefly (Eechha)", image: "🪰", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { letter: "ഉ", sound: "u", word: "ഉറുമ്പ്", meaning: "Ant (Urumba)", image: "🐜", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { letter: "ഊ", sound: "uu", word: "ഊണ്", meaning: "Meal (Oonu)", image: "🍛", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { letter: "ഋ", sound: "ru", word: "ഋഷി", meaning: "Sage (Rishi)", image: "🧘", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { letter: "എ", sound: "e", word: "എലി", meaning: "Rat (Eli)", image: "🐀", color: "bg-lime-50 border-lime-200 text-lime-700" },
  { letter: "ഏ", sound: "ee", word: "ഏണി", meaning: "Ladder (Eani)", image: "🪜", color: "bg-teal-50 border-teal-200 text-teal-700" },
  { letter: "ഐ", sound: "ai", word: "ഐസ്ക്രീം", meaning: "Ice cream (Icecream)", image: "🍦", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { letter: "ഒ", sound: "o", word: "ഒട്ടകം", meaning: "Camel (Ottakam)", image: "🐫", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { letter: "ഓ", sound: "oo", word: "ഓടം", meaning: "Boat (Odam)", image: "⛵", color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700" },
  { letter: "ഔ", sound: "au", word: "ഔഷധം", meaning: "Medicine (Oushadham)", image: "💊", color: "bg-red-50 border-red-200 text-red-700" },
  { letter: "അം", sound: "am", word: "അമ്പിളി", meaning: "Moon (Ambili)", image: "🌙", color: "bg-slate-50 border-slate-200 text-slate-700" },
  { letter: "അഃ", sound: "ah", word: "ദുഃഖം", meaning: "Sorrow (Dukham)", image: "😢", color: "bg-zinc-50 border-zinc-200 text-zinc-700" },
];

const consonants = [
  { letter: "ക", word: "കപ്പൽ", meaning: "Ship (Kappal)", image: "🚢", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { letter: "ഖ", word: "മുഖം", meaning: "Face (Mukham)", image: "😌", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { letter: "ഗ", word: "ഗാനം", meaning: "Song (Gaanam)", image: "🎵", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { letter: "ഘ", word: "ഘടികാരം", meaning: "Clock (Ghadikaaram)", image: "🕰️", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { letter: "ങ", word: "മാങ്ങ", meaning: "Mango (Maanga)", image: "🥭", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  
  { letter: "ച", word: "ചക്രം", meaning: "Wheel (Chakram)", image: "🛞", color: "bg-red-50 border-red-200 text-red-700" },
  { letter: "ഛ", word: "ഛത്രി", meaning: "Umbrella (Chhathri)", image: "🌂", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { letter: "ജ", word: "ജലം", meaning: "Water (Jalam)", image: "💧", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { letter: "ഝ", word: "ഝഷം", meaning: "Fish (Jhasham)", image: "🐟", color: "bg-teal-50 border-teal-200 text-teal-700" },
  { letter: "ഞ", word: "ഞണ്ട്", meaning: "Crab (Njandu)", image: "🦀", color: "bg-rose-50 border-rose-200 text-rose-700" },
  
  { letter: "ട", word: "കുട്ട", meaning: "Basket (Kutta)", image: "🧺", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { letter: "ഠ", word: "പാഠം", meaning: "Lesson (Paatham)", image: "📖", color: "bg-lime-50 border-lime-200 text-lime-700" },
  { letter: "ഡ", word: "ഗരുഡൻ", meaning: "Eagle (Garudan)", image: "🦅", color: "bg-slate-50 border-slate-200 text-slate-700" },
  { letter: "ഢ", word: "ഡമരു", meaning: "Drum (Damaru)", image: "🥁", color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700" },
  { letter: "ണ", word: "വീണ", meaning: "Veena (Veena)", image: "🪕", color: "bg-orange-50 border-orange-200 text-orange-700" },
  
  { letter: "ത", word: "തത്ത", meaning: "Parrot (Thatha)", image: "🦜", color: "bg-green-50 border-green-200 text-green-700" },
  { letter: "ഥ", word: "രഥം", meaning: "Chariot (Ratham)", image: "🛺", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { letter: "ദ", word: "ദന്തം", meaning: "Tooth (Dantham)", image: "🦷", color: "bg-slate-50 border-slate-200 text-slate-700" },
  { letter: "ധ", word: "ധനം", meaning: "Money (Dhanam)", image: "💰", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { letter: "ന", word: "നായ", meaning: "Dog (Naaya)", image: "🐕", color: "bg-amber-50 border-amber-200 text-amber-700" },
  
  { letter: "പ", word: "പശു", meaning: "Cow (Pashu)", image: "🐄", color: "bg-stone-50 border-stone-200 text-stone-700" },
  { letter: "ഫ", word: "ഫലം", meaning: "Fruit (Phalam)", image: "🍎", color: "bg-red-50 border-red-200 text-red-700" },
  { letter: "ബ", word: "ബലൂൺ", meaning: "Balloon (Balloon)", image: "🎈", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { letter: "ഭ", word: "ഭവനം", meaning: "House (Bhavanam)", image: "🏠", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { letter: "മ", word: "മയിൽ", meaning: "Peacock (Mayil)", image: "🦚", color: "bg-teal-50 border-teal-200 text-teal-700" },
  
  { letter: "യ", word: "യന്ത്രം", meaning: "Machine (Yanthram)", image: "⚙️", color: "bg-zinc-50 border-zinc-200 text-zinc-700" },
  { letter: "ര", word: "രവി", meaning: "Sun (Ravi)", image: "☀️", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { letter: "ല", word: "ലത", meaning: "Vine (Latha)", image: "🌿", color: "bg-green-50 border-green-200 text-green-700" },
  { letter: "വ", word: "വണ്ടി", meaning: "Vehicle (Vandi)", image: "🚗", color: "bg-red-50 border-red-200 text-red-700" },
  { letter: "ശ", word: "ശംഖ്", meaning: "Conch (Shankh)", image: "🐚", color: "bg-orange-50 border-orange-200 text-orange-700" },
  
  { letter: "ഷ", word: "പുഷ്പം", meaning: "Flower (Pushpam)", image: "🌸", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { letter: "സ", word: "സിംഹം", meaning: "Lion (Simham)", image: "🦁", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { letter: "ഹ", word: "ഹംസം", meaning: "Swan (Hamsam)", image: "🦢", color: "bg-slate-50 border-slate-200 text-slate-700" },
  { letter: "ള", word: "താഴികക്കുടം", meaning: "Dome (Thazhikakkudam)", image: "🕌", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { letter: "ഴ", word: "മഴ", meaning: "Rain (Mazha)", image: "🌧️", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { letter: "റ", word: "പറവ", meaning: "Bird (Parava)", image: "🐦", color: "bg-purple-50 border-purple-200 text-purple-700" },
];

export function HomePage() {
  const [playingLetter, setPlayingLetter] = useState<string | null>(null);
  const currentlyPlayingRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopAudio = () => {
    currentlyPlayingRef.current = null;
    setPlayingLetter(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playContinuous = (letter: string, word: string) => {
    if (!('speechSynthesis' in window)) {
      console.log(`Speech Synthesis not supported. Would have said: ${letter}, ${word}`);
      return;
    }
    
    // Stop currently playing
    window.speechSynthesis.cancel();
    currentlyPlayingRef.current = letter;
    setPlayingLetter(letter);

    const playSequence = () => {
      if (currentlyPlayingRef.current !== letter) return;

      const uLetter = new SpeechSynthesisUtterance(letter);
      uLetter.lang = 'ml-IN';
      uLetter.rate = 0.8;

      const uWord = new SpeechSynthesisUtterance(word);
      uWord.lang = 'ml-IN';
      uWord.rate = 0.8;

      uWord.onend = () => {
        if (currentlyPlayingRef.current === letter) {
          setTimeout(() => {
            if (currentlyPlayingRef.current === letter) {
              playSequence();
            }
          }, 800);
        }
      };

      uLetter.onerror = () => { if (currentlyPlayingRef.current === letter) stopAudio(); };
      uWord.onerror = () => { if (currentlyPlayingRef.current === letter) stopAudio(); };

      window.speechSynthesis.speak(uLetter);
      window.speechSynthesis.speak(uWord);
    };

    playSequence();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-ui selection:bg-amber-200 selection:text-amber-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold font-sans tracking-tight text-stone-900">
            Aksharamala <span className="text-sm font-ui text-stone-500">by George</span>
          </div>
          <div className="hidden space-x-8 md:flex">
            <a href="#history" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">History</a>
            <a href="#vowels" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">Vowels</a>
            <a href="#consonants" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">Consonants</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-5xl w-full"
        >
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-stone-900 tracking-tight mb-6">
            Discover <span className="text-amber-600">Malayalam</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
            The classical language of God's Own Country, balancing a rich literary heritage with melodic, distinct phonetics.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl mb-5">1</div>
                <h3 className="font-bold text-xl text-stone-900 mb-3">Listen & Learn</h3>
                <p className="text-stone-600">Click the speaker icons or letters in the guides below to hear the exact pronunciation.</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="bg-amber-100 text-amber-600 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl mb-5">2</div>
                <h3 className="font-bold text-xl text-stone-900 mb-3">Test Your Skills</h3>
                <p className="text-stone-600">Take the interactive quizzes after each section to reinforce your memory and practice.</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="bg-emerald-100 text-emerald-600 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl mb-5">3</div>
                <h3 className="font-bold text-xl text-stone-900 mb-3">Chat with Appu</h3>
                <p className="text-stone-600">Use the AI teacher at the bottom right to ask questions or practice learning by voice.</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Phonetic Guide Section */}
      <section id="phonetic-guide" className="py-16 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-sans text-stone-900 mb-4">Phonetic Guide</h2>
            <p className="text-lg text-stone-600">
              Malayalam is highly phonetic. What you read is what you say! Here is a simple guide to start.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
              <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                <span className="bg-amber-200 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Vowels (Swarangal)
              </h3>
              <p className="text-stone-700 mb-6">
                Vowels are independent sounds. They can be short (like <strong>a</strong> in "about") or long (like <strong>aa</strong> in "father"). In Malayalam, short and long vowels have distinct letters.
              </p>
              <ul className="space-y-3 mb-6 font-medium text-stone-700">
                <li className="flex items-center gap-2">
                  <span className="font-ml text-xl font-bold text-amber-700">അ</span> (a) vs <span className="font-ml text-xl font-bold text-amber-700">ആ</span> (aa)
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-ml text-xl font-bold text-amber-700">ഇ</span> (i) vs <span className="font-ml text-xl font-bold text-amber-700">ഈ</span> (ee)
                </li>
              </ul>
              <a href="#vowels" className="inline-flex items-center font-bold text-amber-700 hover:text-amber-800 transition-colors">
                Learn Vowels →
              </a>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-200 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Consonants (Vyanjanangal)
              </h3>
              <p className="text-stone-700 mb-6">
                Consonants are combined with vowel sounds. By default, every consonant carries the short "a" sound unless modified.
              </p>
              <ul className="space-y-3 mb-6 font-medium text-stone-700">
                <li className="flex items-center gap-2">
                  <span className="font-ml text-xl font-bold text-blue-700">ക</span> (ka) - Hard 'k'
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-ml text-xl font-bold text-blue-700">ഗ</span> (ga) - Soft 'g'
                </li>
              </ul>
              <a href="#consonants" className="inline-flex items-center font-bold text-blue-700 hover:text-blue-800 transition-colors">
                Learn Consonants →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vowels Section */}
      <section id="vowels" className="py-24 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-sans text-stone-900 mb-4">Swarangal (Vowels)</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Malayalam vowels are independent sounds. They form the foundation of the language. Click on any letter or word to hear its pronunciation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {vowels.map((v, i) => (
              <motion.div
                key={v.letter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative flex flex-col items-center p-6 rounded-2xl border ${v.color} shadow-sm hover:shadow-md transition-shadow group bg-opacity-30 ${playingLetter === v.letter ? 'ring-2 ring-amber-400 bg-opacity-50' : ''}`}
              >
                <div className={`absolute top-4 right-4 transition-opacity ${playingLetter === v.letter ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {playingLetter === v.letter ? (
                    <button onClick={stopAudio} className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow-sm transition-colors">
                      <Square className="h-4 w-4 fill-current" />
                    </button>
                  ) : (
                    <button onClick={() => playContinuous(v.letter, v.word)} className="p-2 rounded-full bg-white/60 hover:bg-white text-stone-700 shadow-sm transition-colors">
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => playContinuous(v.letter, v.word)}
                  className={`mb-4 text-7xl font-bold font-ml text-center cursor-pointer hover:scale-105 transition-transform ${playingLetter === v.letter ? 'animate-pulse' : ''}`}
                >
                  {v.letter}
                </button>
                <div className="w-full h-px bg-stone-200/50 my-4" />
                <div className="flex flex-col items-center text-center">
                   <div className="text-3xl mb-2">{v.image}</div>
                   <button 
                     onClick={() => playContinuous(v.letter, v.word)}
                     className="text-lg font-bold font-ml mb-1 cursor-pointer hover:underline decoration-dashed"
                   >
                     {v.word}
                   </button>
                   <span className="text-xs font-medium uppercase tracking-wider opacity-80">{v.meaning}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <Quiz title="Swarangal (Vowels)" items={vowels} />
        </div>
      </section>

      {/* Consonants Section */}
      <section id="consonants" className="py-24 bg-white border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-sans text-stone-900 mb-4">Vyanjanangal (Consonants)</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Malayalam consonants combine with vowels to form syllables. The script is highly phonetic. Explore the vast array of consonants below.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {consonants.map((c, i) => (
               <motion.div
                key={c.letter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 5) * 0.05 }}
                className={`relative flex flex-col items-center p-6 rounded-2xl border ${c.color} shadow-sm hover:shadow-md transition-shadow group bg-opacity-30 ${playingLetter === c.letter ? 'ring-2 ring-amber-400 bg-opacity-50' : ''}`}
              >
                <div className={`absolute top-4 right-4 transition-opacity ${playingLetter === c.letter ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {playingLetter === c.letter ? (
                    <button onClick={stopAudio} className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow-sm transition-colors">
                      <Square className="h-4 w-4 fill-current" />
                    </button>
                  ) : (
                    <button onClick={() => playContinuous(c.letter, c.word)} className="p-2 rounded-full bg-white/60 hover:bg-white text-stone-700 shadow-sm transition-colors">
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => playContinuous(c.letter, c.word)}
                  className={`mb-4 text-6xl font-bold font-ml text-center cursor-pointer hover:scale-105 transition-transform ${playingLetter === c.letter ? 'animate-pulse' : ''}`}
                >
                  {c.letter}
                </button>
                <div className="w-full h-px bg-stone-200/50 my-3" />
                <div className="flex flex-col items-center text-center">
                   <div className="text-2xl mb-2">{c.image}</div>
                   <button 
                     onClick={() => playContinuous(c.letter, c.word)}
                     className="text-base font-bold font-ml mb-1 cursor-pointer hover:underline decoration-dashed"
                   >
                     {c.word}
                   </button>
                   <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">{c.meaning}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <Quiz title="Vyanjanangal (Consonants)" items={consonants} />
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="py-20 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 flex items-center justify-center space-x-4">
            <Globe className="h-8 w-8 text-amber-500" />
            <h2 className="text-3xl font-bold font-sans text-stone-900">A Brief History</h2>
            <BookOpen className="h-8 w-8 text-amber-500" />
          </div>
          <div className="prose prose-lg prose-stone mx-auto text-stone-600 leading-relaxed font-ui grid md:grid-cols-2 gap-12">
            <div>
              <p>
                <strong>Malayalam (മലയാളം)</strong> is a Dravidian language predominantly spoken in the Indian state of Kerala and the union territories of Lakshadweep and Puducherry. With over 35 million speakers, it stands as one of the 22 scheduled languages of India and was designated a Classical Language of India in 2013.
              </p>
              <p className="mt-4">
                The origin of Malayalam is deeply rooted in <em>Early Middle Tamil</em>, but it gradually differentiated over centuries. The earliest written record of Malayalam is the <i>Vazhappally copper plate</i> (approx. 832 CE).
              </p>
            </div>
            <div>
               <p>
                As trade and culture flourished along the Malabar Coast, the language heavily assimilated words from Sanskrit, Arabic, Portuguese, and Dutch. The <em>Manipravalam</em> literary style, a unique mixture of Sanskrit and early Malayalam, hugely influenced its vocabulary and poetic forms.
              </p>
              <p className="mt-4">
                Today, the Malayalam script is syllabic in nature, written from left to right. It is renowned for its rounded characters, originating from the ancient <em>Vattezhuthu</em> script, adapted to be easily carved onto palm leaves without splitting them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-center text-sm border-t-4 border-amber-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-5 w-5" />
          <span className="font-sans font-bold text-lg text-white">Aksharamala by George</span>
        </div>
        <p>© {new Date().getFullYear()} Learn Malayalam. Designed thoughtfully with modern web technologies.</p>
      </footer>

      <AIAssistant />
    </div>
  );
}
