import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  glowClass?: string;
  iconColorClass?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, glowClass = "glow-blue", iconColorClass = "text-primary" }: KPICardProps) {
  return (
    <div className={`bg-card rounded-xl border border-border p-5 ${glowClass} animate-slide-up hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? 'text-neon-green' : 'text-neon-red'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last hour
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg bg-secondary ${iconColorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
