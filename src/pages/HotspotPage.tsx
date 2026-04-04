import { useState } from "react";
import { RiskBadge } from "@/components/RiskBadge";
import { zones, hourlyDemand } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function HotspotPage() {
  const [timeWindow, setTimeWindow] = useState(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const zone = zones.find(z => z.id === selectedZone);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-foreground">Hotspot Prediction</h2>
        <p className="text-sm text-muted-foreground">Predicted emergency demand across city zones</p>
      </div>

      <div className="flex items-center gap-4 bg-card rounded-xl border border-border p-4">
        <span className="text-xs text-muted-foreground">Prediction Window:</span>
        <input
          type="range" min={1} max={6} value={timeWindow}
          onChange={e => setTimeWindow(Number(e.target.value))}
          className="flex-1 accent-primary h-1"
        />
        <span className="text-sm font-mono text-primary font-semibold">{timeWindow}h</span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {zones.map(z => {
          const scaledCalls = Math.round(z.calls * (timeWindow / 1.5));
          const bg = z.risk === "CRITICAL" ? "bg-neon-red/25 border-neon-red/40" : z.risk === "HIGH" ? "bg-neon-red/10 border-neon-red/20" : z.risk === "MODERATE" ? "bg-neon-orange/10 border-neon-orange/20" : "bg-neon-green/10 border-neon-green/20";
          return (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`${bg} border rounded-xl p-4 text-center hover:scale-105 transition-all ${selectedZone === z.id ? 'ring-2 ring-primary' : ''}`}
            >
              <p className="text-xs font-bold text-foreground">{z.id}</p>
              <p className="text-[10px] text-muted-foreground truncate">{z.name}</p>
              <p className="text-lg font-bold text-foreground mt-1">{scaledCalls}</p>
              <p className="text-[9px] text-muted-foreground">predicted calls</p>
              <div className="mt-2"><RiskBadge level={z.risk} /></div>
            </button>
          );
        })}
      </div>

      {zone && (
        <div className="bg-card rounded-xl border border-border p-5 animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-1">{zone.name} ({zone.id})</h3>
          <p className="text-xs text-muted-foreground mb-4">Predicted calls over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyDemand.slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222 44% 9%)', border: '1px solid hsl(220 30% 18%)', borderRadius: '8px', fontSize: 12 }} />
              <Bar dataKey="calls" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
