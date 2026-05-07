"use client";

import { motion } from "framer-motion";
import { Activity, RotateCcw, Server } from "lucide-react";
import { useApiHealth } from "@/hooks/use-api-health";

export function ApiWakeGate({ children }: { children: React.ReactNode }) {
  const health = useApiHealth(true);

  if (health.isReady) {
    return children;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="grid-noise absolute inset-0 opacity-60" />
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-surface relative z-10 w-full max-w-xl rounded-[28px] p-7 text-center sm:p-10"
      >
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          >
            <Server className="h-9 w-9 text-[#00E5FF]" />
          </motion.div>
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#00E5FF]">{health.message}</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Starting demo backend...</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#8892B0] sm:text-base">
          This API runs on a free instance and may take up to a minute to wake up. The client retries automatically with a timeout per request.
        </p>
        <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between text-sm text-[#8892B0]">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#00FFA3]" />
              Attempt {health.attempt || 1} of 8
            </span>
            <span className="capitalize">{health.status}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] via-[#FF2D75] to-[#00E5FF]"
              animate={{ width: `${Math.min((health.attempt || 1) * 13, 100)}%` }}
            />
          </div>
        </div>
        {health.status === "error" ? (
          <button
            onClick={() => void health.check()}
            className="btn-bet mt-7 inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-bold"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        ) : null}
      </motion.section>
    </main>
  );
}
