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
import { ApiError } from "@/lib/api-client";
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
        description="Authenticate against the Fastify API and store the Bearer token through a centralized client-side auth helper."
      >
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C3AED]/20">
              <LockKeyhole className="h-6 w-6 text-[#B794FF]" />
            </span>
            <h2 className="text-3xl font-black text-white">Login</h2>
            <p className="mt-2 text-sm leading-6 text-[#8892B0]">Use a registered demo account to access wallet balance, keys and transactions.</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#D8DFF0]">Email</span>
            <input className="input-neon h-12 px-4" type="email" {...form.register("email")} />
            <span className="mt-1 block min-h-5 text-xs text-[#FF86B2]">{form.formState.errors.email?.message}</span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#D8DFF0]">Password</span>
            <input className="input-neon h-12 px-4" type="password" {...form.register("password")} />
            <span className="mt-1 block min-h-5 text-xs text-[#FF86B2]">{form.formState.errors.password?.message}</span>
          </label>

          {errorMessage ? (
            <div className="rounded-2xl border border-[#FF2D75]/30 bg-[#FF2D75]/10 px-4 py-3 text-sm text-[#FFB6CF]">
              {errorMessage}
            </div>
          ) : null}

          <button disabled={auth.loginPending} className="btn-bet flex h-13 w-full items-center justify-center gap-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60">
            {auth.loginPending ? "Authenticating..." : "Access dashboard"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-sm text-[#8892B0]">
            New to the demo? <Link className="font-semibold text-[#00E5FF]" href="/register">Create an account</Link>
          </p>
        </motion.form>
      </AuthShell>
    </ApiWakeGate>
  );
}
