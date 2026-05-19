import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, User, Shield } from "lucide-react";

export function ParentOnboarding() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-ui text-slate-800">
      <header className="flex items-center p-6 pb-0">
        <button
          onClick={() => navigate("/")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-32 h-32" />
          </div>

          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">Parent Setup</h1>
          <p className="mb-8 text-slate-500">Create an account to track your child's progress.</p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="pt-4">
              <Button
                variant="default"
                className="w-full font-ui h-14 text-lg bg-slate-900 shadow-[0_4px_0_0_#0f172a] hover:bg-slate-800 hover:shadow-[0_4px_0_0_#020617]"
                onClick={() => navigate("/child-profile")}
              >
                Continue
              </Button>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <User className="h-4 w-4" />
            <span>Already have an account? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Sign in</span></span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
