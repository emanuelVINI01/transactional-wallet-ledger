import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "cyan",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "cyan" | "green" | "pink" | "purple" | "yellow";
}) {
  const tones = {
    cyan: "text-[#00E5FF]",
    green: "text-[#00FFA3]",
    pink: "text-[#FF2D75]",
    purple: "text-[#B794FF]",
    yellow: "text-[#FFC107]",
  };

  return (
    <article className="glass-surface-2 hover-scale rounded-3xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <Icon className={`h-5 w-5 ${tones[tone]}`} />
        </span>
        <span className="h-2 w-2 rounded-full bg-[#00FFA3] shadow-[0_0_18px_rgba(0,255,163,0.8)]" />
      </div>
      <p className="text-sm text-[#8892B0]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </article>
  );
}
