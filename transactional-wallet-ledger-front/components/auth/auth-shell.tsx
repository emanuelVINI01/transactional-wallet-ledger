import Link from "next/link";
import { WalletCards } from "lucide-react";

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="grid-noise absolute inset-0 opacity-70" />
      <section className="relative z-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#FF2D75] to-[#00E5FF]">
              <WalletCards className="h-6 w-6 text-white" />
            </span>
            <span className="font-bold text-white">Transactional Wallet Ledger</span>
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#00E5FF]">{eyebrow}</p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-tight text-white">{title}</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#AEB8CF]">{description}</p>
          <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
            {["Bearer auth", "Ledger UX", "Wake-up retries", "Payment keys"].map((item) => (
              <div key={item} className="glass-surface rounded-2xl px-4 py-3 text-sm font-semibold text-[#D8DFF0]">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-surface rounded-[30px] p-5 sm:p-7">
          {children}
        </div>
      </section>
    </main>
  );
}
