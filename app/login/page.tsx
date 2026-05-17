"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { ApiError } from "@/lib/api-types";
import { useAuth } from "@/hooks/use-auth";

const loginFormSchema = z.object({
  email: z.email("Use a valid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginForm) {
    await auth.login(values);
    router.replace("/dashboard");
  }

  const errorMessage = auth.loginError instanceof ApiError ? auth.loginError.message : null;

  return (
    <ApiWakeGate>
      <AuthShell
        eyebrow="Secure demo access"
        title="Enter the ledger cockpit."
        description="Authenticate with Auth.js v5 credentials, JWT sessions and a server-side AUTH_SECRET."
      >
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#bd93f9]/20">
              <LockKeyhole className="h-6 w-6 text-[#bd93f9]" />
            </span>
            <h2 className="text-3xl font-black text-white">Login</h2>
            <p className="mt-2 text-sm leading-6 text-[#a7b0c8]">Use a registered demo account to access wallet balance, keys and transactions.</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">Email</span>
            <input className="input-neon h-12 px-4" type="email" {...form.register("email")} />
            <span className="mt-1 block min-h-5 text-xs text-[#ff79c6]">{form.formState.errors.email?.message}</span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">Password</span>
            <input className="input-neon h-12 px-4" type="password" {...form.register("password")} />
            <span className="mt-1 block min-h-5 text-xs text-[#ff79c6]">{form.formState.errors.password?.message}</span>
          </label>

          {errorMessage ? (
            <div className="rounded-2xl border border-[#ff79c6]/30 bg-[#ff79c6]/10 px-4 py-3 text-sm text-[#ff79c6]">
              {errorMessage}
            </div>
          ) : null}

          <button disabled={auth.loginPending} className="btn-bet flex h-13 w-full items-center justify-center gap-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60">
            {auth.loginPending ? "Authenticating..." : "Access dashboard"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-sm text-[#a7b0c8]">
            New to the demo? <Link className="font-semibold text-[#8be9fd]" href="/register">Create an account</Link>
          </p>
        </motion.form>
      </AuthShell>
    </ApiWakeGate>
  );
}
