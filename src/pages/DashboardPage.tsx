import { KPICard } from "@/components/KPICard";
import { RiskBadge } from "@/components/RiskBadge";
import { Ambulance, ShieldAlert, Clock, Target, AlertTriangle, Info, Siren } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { hourlyDemand, alerts, zones } from "@/lib/mockData";

const alertIcon = {
  critical: <Siren className="h-4 w-4 text-neon-red" />,
  warning: <AlertTriangle className="h-4 w-4 text-neon-orange" />,
  info: <Info className="h-4 w-4 text-primary" />,
};

const alertBorder = {
  critical: "border-l-neon-red",
  warning: "border-l-neon-orange",
  info: "border-l-primary",
};

export default function DashboardPage() {
  const criticalZones = zones.filter(z => z.risk === "CRITICAL");
  const hasCritical = criticalZones.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {hasCritical && (
        <div className="bg-neon-red/10 border border-neon-red/30 rounded-xl p-4 flex items-center gap-3 animate-blink-critical">
          <Siren className="h-5 w-5 text-neon-red animate-pulse-glow" />
          <div>
            <p className="text-sm font-bold text-neon-red">🚨 Emergency Alert Mode</p>
            <p className="text-xs text-muted-foreground">
              {criticalZones.length} CRITICAL zone(s) detected: {criticalZones.map(z => z.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Ambulances" value="10" subtitle="6 busy · 4 idle" icon={Ambulance} trend={{ value: 5, positive: true }} glowClass="glow-blue" iconColorClass="text-primary" />
        <KPICard title="High Risk Zones" value="5" subtitle="2 critical" icon={ShieldAlert} trend={{ value: 12, positive: false }} glowClass="glow-red" iconColorClass="text-neon-red" />
        <KPICard title="Avg Response Time" value="8.2 min" subtitle="Target: 7 min" icon={Clock} trend={{ value: 3, positive: false }} glowClass="glow-orange" iconColorClass="text-neon-orange" />
        <KPICard title="Coverage Efficiency" value="87%" subtitle="12 zones covered" icon={Target} trend={{ value: 2, positive: true }} glowClass="glow-green" iconColorClass="text-neon-green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Emergency Demand — Last 24 Hours</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={hourlyDemand}>
              <defs>
                <linearGradient id="callGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(222 44% 9%)', border: '1px solid hsl(220 30% 18%)', borderRadius: '8px', fontSize: 12 }} />
              <Area type="monotone" dataKey="calls" stroke="hsl(199 89% 48%)" fill="url(#callGrad)" strokeWidth={2} name="Actual" />
              <Area type="monotone" dataKey="predicted" stroke="hsl(142 71% 45%)" fill="url(#predGrad)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Alerts</h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {alerts.map(a => (
              <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border-l-2 ${alertBorder[a.type]}`}>
                {alertIcon[a.type]}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{a.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">AI Recommendation Panel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-foreground">📍 Deploy 2 more ambulances to <span className="text-primary font-semibold">North Zone</span> — predicted surge in next 2 hours.</p>
          </div>
          <div className="p-3 rounded-lg bg-neon-red/5 border border-neon-red/20">
            <p className="text-xs text-foreground">⚠️ Relocate <span className="text-neon-red font-semibold">A-03</span> from Dwarka → Mayur Vihar to cover CRITICAL gap.</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Heatmap Preview — Zone Risk</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {zones.map(z => {
            const bg = z.risk === "CRITICAL" ? "bg-neon-red/30" : z.risk === "HIGH" ? "bg-neon-red/15" : z.risk === "MODERATE" ? "bg-neon-orange/15" : "bg-neon-green/15";
            return (
              <div key={z.id} className={`${bg} rounded-lg p-3 text-center hover:scale-105 transition-transform cursor-pointer group relative`}>
                <p className="text-[10px] font-bold text-foreground">{z.id}</p>
                <p className="text-[9px] text-muted-foreground truncate">{z.name}</p>
                <RiskBadge level={z.risk} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg p-2 text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-36 shadow-lg">
                  <p className="text-[10px] text-foreground font-medium">{z.name}</p>
                  <p className="text-[9px] text-muted-foreground">Predicted calls: {z.calls}</p>
                  <p className="text-[9px] text-muted-foreground">AQI: {z.aqi}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
