import React, { useState, useEffect, useRef } from "react";
import { Volume2, BookOpen, Clock, Globe, Square } from "lucide-react";
import { motion } from "motion/react";

import { Quiz } from "../components/Quiz";
import { AIAssistant } from "../components/AIAssistant";
import { playIndianAudio, stopAudio as playLibStopAudio } from "../lib/audio";

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
      playLibStopAudio();
    };
  }, []);

  const stopAudio = () => {
    currentlyPlayingRef.current = null;
    setPlayingLetter(null);
    playLibStopAudio();
  };

  const playContinuous = (letter: string, word: string) => {
    playLibStopAudio();
    currentlyPlayingRef.current = letter;
    setPlayingLetter(letter);

    const playSequence = () => {
      if (currentlyPlayingRef.current !== letter) return;

      playIndianAudio(letter, () => {
        if (currentlyPlayingRef.current !== letter) return;
        
        playIndianAudio(word, () => {
          if (currentlyPlayingRef.current === letter) {
            setTimeout(() => {
              if (currentlyPlayingRef.current === letter) {
                playSequence();
              }
            }, 800);
          }
        }, { cancel: false, rate: 0.8 });
      }, { cancel: false, rate: 0.8 });
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
            <a href="#history" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">ചരിത്രം</a>
            <a href="#vowels" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">സ്വരങ്ങൾ</a>
            <a href="#consonants" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">വ്യഞ്ജനങ്ങൾ</a>
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
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="mx-auto w-32 h-32 mb-6 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            onClick={() => {
              playIndianAudio("നമസ്കാരം! ഞാൻ അപ്പു.");
            }}
            title="Hello, I am Appu!"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(0, 10)">
                {/* Ears */}
                <path d="M 50 60 C 20 60, 20 120, 50 130 C 60 130, 70 110, 70 90 C 70 70, 60 60, 50 60 Z" fill="#94a3b8" />
                <path d="M 150 60 C 180 60, 180 120, 150 130 C 140 130, 130 110, 130 90 C 130 70, 140 60, 150 60 Z" fill="#94a3b8" />
                {/* Ear Details (robotic) */}
                <circle cx="45" cy="95" r="15" fill="#64748b" />
                <circle cx="155" cy="95" r="15" fill="#64748b" />
                
                {/* Head */}
                <rect x="65" y="50" width="70" height="80" rx="35" fill="#cbd5e1" />
                
                {/* Screen Face */}
                <rect x="75" y="75" width="50" height="30" rx="10" fill="#0f172a" />
                {/* Digital Eyes */}
                <circle cx="90" cy="90" r="4" fill="#38bdf8" />
                <circle cx="110" cy="90" r="4" fill="#38bdf8" />
                
                {/* Trunk Base */}
                <path d="M 85 125 L 115 125 L 110 140 L 90 140 Z" fill="#94a3b8" />
                {/* Trunk Segments */}
                <rect x="92" y="142" width="16" height="8" rx="2" fill="#cbd5e1" />
                <rect x="94" y="152" width="12" height="8" rx="2" fill="#cbd5e1" />
                <rect x="96" y="162" width="8" height="8" rx="2" fill="#cbd5e1" />
                <circle cx="100" cy="170" r="4" fill="#38bdf8" />
                
                {/* Antenna */}
                <rect x="97" y="25" width="6" height="25" fill="#94a3b8" />
                <circle cx="100" cy="20" r="8" fill="#ef4444" className="animate-pulse" />
                
                {/* Tusks */}
                <path d="M 70 120 C 60 140, 50 140, 45 130" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
                <path d="M 130 120 C 140 140, 150 140, 155 130" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              </g>
            </svg>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-stone-900 tracking-tight mb-6">
            മലയാളം <span className="text-amber-600">പഠിക്കാം</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
            കേരളത്തിന്റെ തനതായ ഭാഷ. വളരെ ലളിതമായി മലയാളം പഠിക്കാൻ തുടങ്ങാം.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl mb-5">1</div>
                <h3 className="font-bold text-xl text-stone-900 mb-3">കേൾക്കാം, പഠിക്കാം</h3>
                <p className="text-stone-600">ശരിയായ ഉച്ചാരണം കേൾക്കാൻ സ്പീക്കർ ഐക്കണുകളിലോ അക്ഷരങ്ങളിലോ ക്ലിക്ക് ചെയ്യുക.</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="bg-amber-100 text-amber-600 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl mb-5">2</div>
                <h3 className="font-bold text-xl text-stone-900 mb-3">അറിവ് പരിശോധിക്കാം</h3>
                <p className="text-stone-600">ഓരോ പാഠത്തിനും ശേഷമുള്ള ചോദ്യങ്ങൾക്കുള്ള ഉത്തരങ്ങൾ നൽകാം.</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="bg-emerald-100 text-emerald-600 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl mb-5">3</div>
                <h3 className="font-bold text-xl text-stone-900 mb-3">അപ്പുവിനോട് സംസാരിക്കാം</h3>
                <p className="text-stone-600">ചോദ്യങ്ങൾ ചോദിക്കാനും പഠിക്കാനും AI ടീച്ചറെ ഉപയോഗിക്കുക.</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Phonetic Guide Section */}
      <section id="phonetic-guide" className="py-16 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-sans text-stone-900 mb-4">ഉച്ചാരണ സഹായി</h2>
            <p className="text-lg text-stone-600">
              മലയാളം ഉച്ചാരണ പ്രധാനമായ ഭാഷയാണ്. എങ്ങനെയാണോ എഴുതുന്നത് അതുപോലെയാണ് വായിക്കുന്നത്!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
              <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                <span className="bg-amber-200 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                സ്വരങ്ങൾ (Swarangal)
              </h3>
              <p className="text-stone-700 mb-6">
                സ്വതന്ത്രമായി ഉച്ചരിക്കാൻ കഴിയുന്ന അക്ഷരങ്ങളാണ് സ്വരങ്ങൾ. ഇവയ്ക്ക് ഹ്രസ്വവും ദീർഘവുമായ രൂപങ്ങളുണ്ട്.
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
                സ്വരങ്ങൾ പഠിക്കാം →
              </a>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-200 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                വ്യഞ്ജനങ്ങൾ (Vyanjanangal)
              </h3>
              <p className="text-stone-700 mb-6">
                സ്വരങ്ങളുടെ സഹായത്തോടെ ഉച്ചരിക്കുന്ന അക്ഷരങ്ങളാണ് വ്യഞ്ജനങ്ങൾ.
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
                വ്യഞ്ജനങ്ങൾ പഠിക്കാം →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vowels Section */}
      <section id="vowels" className="py-24 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-sans text-stone-900 mb-4">സ്വരങ്ങൾ (Vowels)</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              സ്വതന്ത്രമായി ഉച്ചരിക്കാൻ കഴിയുന്ന അക്ഷരങ്ങളാണ് സ്വരങ്ങൾ. ഉച്ചാരണം കേൾക്കാൻ അക്ഷരങ്ങളിലോ വാക്കുകളിലോ ക്ലിക്ക് ചെയ്യുക.
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
            <h2 className="text-4xl font-bold font-sans text-stone-900 mb-4">വ്യഞ്ജനങ്ങൾ (Consonants)</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              സ്വരങ്ങളുടെ സഹായത്തോടെ ഉച്ചരിക്കുന്ന അക്ഷരങ്ങളാണ് വ്യഞ്ജനങ്ങൾ. മലയാളത്തിൽ നിരവധി വ്യഞ്ജനാക്ഷരങ്ങളുണ്ട്.
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

          <Quiz title="വ്യഞ്ജനങ്ങൾ (Consonants)" items={consonants} />
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="py-20 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 flex items-center justify-center space-x-4">
            <Globe className="h-8 w-8 text-amber-500" />
            <h2 className="text-3xl font-bold font-sans text-stone-900">ചരിത്രം</h2>
            <BookOpen className="h-8 w-8 text-amber-500" />
          </div>
          <div className="prose prose-lg prose-stone mx-auto text-stone-600 leading-relaxed font-ui grid md:grid-cols-2 gap-12">
            <div>
              <p>
                <strong>മലയാളം</strong> ഇന്ത്യയിലെ കേരള സംസ്ഥാനത്തിലും ലക്ഷദ്വീപിലും പുതുച്ചേരിയിലും പ്രധാനമായും സംസാരിക്കുന്ന ഒരു ദ്രാവിഡ ഭാഷയാണ്. 3 കോടിയിലധികം പേർ സംസാരിക്കുന്ന ഈ ഭാഷ ഇന്ത്യയിലെ 22 ഔദ്യോഗിക ഭാഷകളിൽ ഒന്നാണ്. 2013-ൽ ഇതിനെ ഒരു ക്ലാസിക്കൽ ഭാഷയായി പ്രഖ്യാപിച്ചു.
              </p>
              <p className="mt-4">
                പ്രാചീന തമിഴിൽ നിന്നാണ് മലയാളത്തിന്റെ ഉത്ഭവം. ലഭ്യമായതിൽ വെച്ച് ഏറ്റവും പഴയ മലയാള ലിഖിത രേഖ ഏകദേശം എ.ഡി. 832-ലെ <i>വാഴപ്പള്ളി ശാസനമാണ്</i>.
              </p>
            </div>
            <div>
               <p>
                മലബാർ തീരത്ത് വ്യാപാരവും സംസ്കാരവും വികസിച്ചതോടെ സംസ്‌കൃതം, അറബി, പോർച്ചുഗീസ്, ഡച്ച് എന്നീ ഭാഷകളിൽ നിന്നും ധാരാളം വാക്കുകൾ മലയാളത്തിലേക്ക് കടന്നുവന്നു. സംസ്‌കൃതവും ആദ്യകാല മലയാളവും ചേർന്ന <em>മണിപ്രവാളം</em> എന്ന സാഹിത്യ ശൈലി മലയാളത്തിന്റെ പദസമ്പത്തിനെയും കവിതാ രൂപങ്ങളെയും പിൽക്കാലത്ത് വളരെയധികം സ്വാധീനിച്ചു.
              </p>
              <p className="mt-4">
                ഇടത്തുനിന്ന് വലത്തോട്ടാണ് മലയാളം എഴുതുന്നത്. പനയോലകളിൽ എഴുതാൻ എളുപ്പമുള്ള രൂപമായ <em>വട്ടെഴുത്ത്</em> ലിപിയിൽ നിന്നാണ് ഇന്ന് നാം കാണുന്ന ഉരുളൻ അക്ഷരങ്ങൾ രൂപപ്പെട്ടത്.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-center text-sm border-t-4 border-amber-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-5 w-5" />
          <span className="font-sans font-bold text-lg text-white">അക്ഷരമാല (Aksharamala) by George</span>
        </div>
        <p>© {new Date().getFullYear()} മലയാളം പഠിക്കാം. ആധുനിക വെബ് സാങ്കേതികവിദ്യകൾ ഉപയോഗിച്ച് രൂപകൽപ്പന ചെയ്തത്.</p>
      </footer>

      <AIAssistant />
    </div>
  );
}
