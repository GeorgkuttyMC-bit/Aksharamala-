import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Bird } from "lucide-react"; // Hornbill mascot

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 text-slate-800">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <motion.div
        id="welcome-content"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center"
      >
        <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-full border-8 border-white bg-amber-200 shadow-xl">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Bird className="h-24 w-24 text-teal-600" />
          </motion.div>
        </div>
        
        <h1 className="mb-2 text-5xl font-black text-white drop-shadow-md sm:text-7xl">
          മലയാളം <span className="text-yellow-300">പഠിക്കാം</span>
        </h1>
        <p className="mb-10 text-xl font-bold text-white/90 drop-shadow sm:text-3xl">
          അപ്പുവിനോടൊപ്പം!
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button id="btn-start" size="lg" variant="primary" onClick={() => navigate("/map")}>
            തുടങ്ങാം!
          </Button>
          <Button id="btn-parent-setup" size="lg" variant="ghost" className="bg-white/50 backdrop-blur-sm" onClick={() => navigate("/parent-setup")}>
            മാതാപിതാക്കൾക്ക്
          </Button>
        </div>
      </motion.div>
      
      {/* Decorative floating elements */}
      <motion.div
        className="absolute left-10 top-20 text-6xl opacity-50"
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        അ
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-7xl opacity-50 text-white"
        animate={{ y: [0, -30, 0], rotate: [0, -15, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5, delay: 1 }}
      >
        ക
      </motion.div>
    </div>
  );
}
