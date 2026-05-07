"use client";

import { useCallback, useEffect, useState } from "react";
import { endpoints } from "@/lib/api-client";

type HealthState = "checking" | "waking" | "ready" | "error";

const statusCopy = ["Checking API", "Waking backend", "Connecting to ledger service", "Ready"];

export function useApiHealth(enabled = true) {
  const [status, setStatus] = useState<HealthState>("checking");
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState(statusCopy[0]);

  const check = useCallback(async () => {
    if (!enabled) return;

    setStatus((current) => current === "ready" ? "checking" : current);
    for (let nextAttempt = 1; nextAttempt <= 8; nextAttempt += 1) {
      setAttempt(nextAttempt);
      setMessage(statusCopy[Math.min(nextAttempt - 1, statusCopy.length - 2)]);
      setStatus(nextAttempt > 1 ? "waking" : "checking");

      try {
        const response = await endpoints.health();
        if (response.ok) {
          setStatus("ready");
          setMessage("Ready");
          return;
        }
      } catch {
        await new Promise((resolve) => window.setTimeout(resolve, nextAttempt < 3 ? 2500 : 4500));
      }
    }

    setStatus("error");
    setMessage("Backend did not respond");
  }, [enabled]);

  useEffect(() => {
    const timer = window.setTimeout(() => void check(), 0);
    return () => window.clearTimeout(timer);
  }, [check]);

  return {
    attempt,
    check,
    isReady: status === "ready",
    message,
    status,
  };
}
