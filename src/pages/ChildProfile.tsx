import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, Check, Stars } from "lucide-react";
import { cn } from "@/src/lib/utils";

const AVATARS = [
  { id: "tiger", emoji: "🐯", bg: "bg-orange-100" },
  { id: "elephant", emoji: "🐘", bg: "bg-slate-100" },
  { id: "monkey", emoji: "🐒", bg: "bg-amber-100" },
  { id: "peacock", emoji: "🦚", bg: "bg-emerald-100" },
];

export function ChildProfile() {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState<string>("tiger");
  const [level, setLevel] = useState<number>(0);

  return (
    <div className="flex min-h-screen flex-col bg-cyan-50 text-slate-800">
      <header className="flex flex-col p-6 pb-2">
         <button
          onClick={() => navigate("/parent-setup")}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-200/50 text-cyan-800 transition-colors hover:bg-cyan-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-4xl font-extrabold text-cyan-950">Who is playing?</h1>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col p-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex flex-col gap-8"
        >
          {/* Name */}
          <div className="space-y-3">
             <label className="text-xl font-bold text-cyan-900">Child's Name</label>
             <input
                type="text"
                placeholder="e.g. Maya"
                className="w-full rounded-2xl border-4 border-cyan-200 bg-white px-6 py-4 text-2xl font-bold text-slate-800 outline-none transition-colors focus:border-cyan-500"
              />
          </div>

          {/* Avatars */}
          <div className="space-y-3">
             <label className="text-xl font-bold text-cyan-900">Pick an Avatar</label>
             <div className="grid grid-cols-4 gap-4">
               {AVATARS.map((av) => (
                 <button
                   key={av.id}
                   onClick={() => setSelectedAvatar(av.id)}
                   className={cn(
                     "relative flex aspect-square items-center justify-center rounded-2xl border-4 text-5xl transition-all",
                     av.bg,
                     selectedAvatar === av.id 
                      ? "border-cyan-500 shadow-lg scale-105" 
                      : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                   )}
                 >
                   {av.emoji}
                   {selectedAvatar === av.id && (
                     <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white">
                       <Check className="h-4 w-4" />
                     </div>
                   )}
                 </button>
               ))}
             </div>
          </div>

          {/* Level */}
          <div className="space-y-3">
            <label className="text-xl font-bold text-cyan-900">Malayalam Level</label>
            <div className="flex flex-col gap-3">
              {[
                { id: 0, title: "Absolute Beginner", desc: "No prior knowledge" },
                { id: 1, title: "Knows some words", desc: "Understands basics" },
                { id: 2, title: "Can speak, can't read", desc: "Needs alphabet practice" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id)}
                  className={cn(
                    "flex flex-col items-start rounded-2xl border-4 p-4 transition-all text-left",
                    level === lvl.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-cyan-100 bg-white hover:border-cyan-200"
                  )}
                >
                  <span className={cn("text-lg font-bold", level === lvl.id ? "text-purple-700" : "text-slate-700")}>{lvl.title}</span>
                  <span className="text-sm font-medium text-slate-500">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 pb-8">
             <Button
                variant="primary"
                size="lg"
                className="w-full h-16 text-2xl"
                onClick={() => navigate("/parent-dashboard")}
              >
                <Stars className="mr-2 h-6 w-6" /> Create Profile
             </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
