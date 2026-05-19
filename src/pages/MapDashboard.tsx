import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Map, MapPin, Star, Volume2, ArrowLeft } from "lucide-react";

export function MapDashboard() {
  const navigate = useNavigate();

  // Basic map levels
  const levels = [
    { id: 1, name: "Vowel Valley", subName: "സ്വരങ്ങൾ", status: "unlocked", path: "/lesson/vowels", x: "20%", y: "70%", color: "bg-green-400" },
    { id: 2, name: "Consonant Cave", subName: "വ്യഞ്ജനങ്ങൾ", status: "unlocked", path: "/lesson/consonants", x: "40%", y: "45%", color: "bg-slate-300" },
    { id: 3, name: "Animal Safari", subName: "മൃഗങ്ങൾ", status: "locked", path: "#", x: "70%", y: "25%", color: "bg-slate-300" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-sky-200">
      {/* Background layer */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-20 pointer-events-none"></div>
      
      {/* Clouds */}
      <motion.div 
        animate={{ x: [0, 100, 0] }} 
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute top-10 left-10 text-white opacity-80"
      >
        ☁️☁️☁️
      </motion.div>

      <header className="absolute top-0 z-10 flex w-full justify-between p-6">
         <button
          onClick={() => navigate("/parent-dashboard")}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 p-2 text-sky-800 shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
        >
          <ArrowLeft className="h-8 w-8" />
        </button>
        <div className="flex h-16 items-center gap-2 rounded-full bg-white/80 px-6 shadow-md backdrop-blur-sm">
           <Star className="h-8 w-8 fill-yellow-400 text-yellow-500" />
           <span className="text-2xl font-bold text-slate-800">0</span>
        </div>
      </header>

      {/* Map Content */}
      <main className="relative flex-1">
         {/* Path container (SVG would be better here for real curves, simplifying for now) */}
         <div className="absolute inset-0 pointer-events-none">
            {/* Draw lines between points via simple absolute positioning approx */}
         </div>

         {levels.map((level) => (
           <motion.div
              key={level.id}
              className="absolute flex flex-col items-center"
              style={{ left: level.x, top: level.y }}
              whileHover={level.status === "unlocked" ? { scale: 1.1 } : {}}
              whileTap={level.status === "unlocked" ? { scale: 0.95 } : {}}
           >
              <button
                 className={`relative flex h-24 w-24 items-center justify-center rounded-full border-8 ${level.color} ${level.status === 'unlocked' ? 'border-white shadow-[0_8px_0_0_rgba(0,0,0,0.1)] cursor-pointer' : 'border-slate-200 cursor-not-allowed opacity-80 z-0'}`}
                 onClick={() => {
                   if (level.status === "unlocked") {
                     // Play sound then navigate
                     navigate(level.path);
                   }
                 }}
              >
                  {level.status === "unlocked" ? (
                     <div className="text-4xl text-white drop-shadow-md">{level.id}</div>
                  ) : (
                     <div className="text-4xl text-slate-400">🔒</div>
                  )}
              </button>
              
              <div className={`mt-4 rounded-xl px-4 py-2 text-center shadow-sm ${level.status === 'unlocked' ? 'bg-white' : 'bg-white/50 backdrop-blur-sm'}`}>
                 <h2 className="text-xl font-bold text-slate-800">{level.name}</h2>
                 <p className="font-ml text-sm font-bold text-slate-500">{level.subName}</p>
              </div>
           </motion.div>
         ))}

         {/* Mascot encouraging */}
         <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-10 right-10 flex gap-4"
         >
            <div className="relative flex items-center justify-center rounded-3xl rounded-br-none bg-white p-4 shadow-xl">
               <p className="text-xl font-bold text-slate-800">Tap on Level 1 to start!</p>
               <button className="ml-2 rounded-full bg-slate-100 p-2 text-blue-500">
                  <Volume2 className="h-6 w-6" />
               </button>
            </div>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-amber-200 text-6xl shadow-lg">
               🦚
            </div>
         </motion.div>
      </main>
    </div>
  );
}
