const riskStyles = {
  CRITICAL: "bg-neon-red/20 text-neon-red border-neon-red/30 animate-blink-critical",
  HIGH: "bg-neon-red/10 text-neon-red border-neon-red/20",
  MODERATE: "bg-neon-orange/10 text-neon-orange border-neon-orange/20",
  LOW: "bg-neon-green/10 text-neon-green border-neon-green/20",
};

export function RiskBadge({ level }: { level: keyof typeof riskStyles }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${riskStyles[level]}`}>
      {level}
    </span>
  );
}
