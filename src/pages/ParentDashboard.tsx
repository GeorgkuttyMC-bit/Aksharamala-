import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Play, Settings, BarChart2, Award, Bird } from "lucide-react";

export function ParentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-ui text-slate-800">
      <header className="flex items-center justify-between bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-3xl">
             🐯
           </div>
           <div>
             <h1 className="text-xl font-bold text-slate-900">Maya's Dashboard</h1>
             <p className="text-sm font-medium text-slate-500">Parent View</p>
           </div>
        </div>
        <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          <Settings className="h-6 w-6" />
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
        {/* Call to action for the child to play */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg relative">
           <div className="p-8 md:p-12 z-10 relative">
             <h2 className="mb-2 font-sans text-4xl font-extrabold text-white">Ready to learn?</h2>
             <p className="mb-6 font-ui text-lg text-blue-100">Maya is on Level 1: Vowel Valley</p>
             <Button
                variant="primary"
                size="lg"
                className="bg-yellow-400 text-yellow-950 shadow-[0_4px_0_0_#ca8a04] hover:bg-yellow-300"
                onClick={() => navigate("/map")}
             >
                <Play className="mr-2 h-6 w-6 fill-current" /> Play Now!
             </Button>
           </div>
           
           <div className="absolute right-0 bottom-0 pointer-events-none opacity-20 md:opacity-50">
               <Bird className="h-64 w-64 text-white -mb-10 -mr-10" />
           </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
           {/* Progress */}
           <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-6 flex items-center justify-between">
                 <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <BarChart2 className="h-5 w-5 text-indigo-500" /> Learning Progress
                 </h3>
                 <span className="text-sm font-bold text-indigo-600">This Week</span>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                       <span>Swarangal (Vowels)</span>
                       <span className="text-slate-500">20%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                       <motion.div initial={{ width: 0 }} animate={{ width: "20%" }} className="h-full bg-indigo-500 rounded-full" />
                    </div>
                 </div>
                 <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                       <span>Vyanjanangal (Consonants)</span>
                       <span className="text-slate-500">0%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }} />
                    </div>
                 </div>
              </div>
           </section>

           {/* Achievements */}
           <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-6 flex items-center justify-between">
                 <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Award className="h-5 w-5 text-yellow-500" /> Recent Achievements
                 </h3>
              </div>
              
              <div className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center px-4">
                 <p className="text-sm font-medium text-slate-500">Maya hasn't earned any badges yet. Have them play their first lesson!</p>
              </div>
           </section>
        </div>
      </main>
    </div>
  );
}
