import { useState } from "react";
import { RiskBadge } from "@/components/RiskBadge";
import { zones, ambulances } from "@/lib/mockData";
import { Layers, Eye, EyeOff } from "lucide-react";

export default function LiveMapPage() {
  const [showRisk, setShowRisk] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedAmb, setSelectedAmb] = useState<string | null>(null);

  const amb = ambulances.find(a => a.id === selectedAmb);
  const ambZone = amb ? zones.find(z => z.id === amb.zone) : null;

  const riskColor = (r: string) => r === "CRITICAL" ? "#ef4444" : r === "HIGH" ? "#f87171" : r === "MODERATE" ? "#f59e0b" : "#22c55e";

  return (
    <div className="space-y-4 animate-fade-in h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Live Map View</h2>
          <p className="text-sm text-muted-foreground">Real-time city overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowRisk(!showRisk)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showRisk ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
            {showRisk ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} Risk Zones
          </button>
          <button onClick={() => setShowAmbulances(!showAmbulances)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showAmbulances ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
            {showAmbulances ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} Ambulances
          </button>
          <button onClick={() => setShowRoutes(!showRoutes)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showRoutes ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
            {showRoutes ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} Routes
          </button>
        </div>
      </div>

      <div className="relative bg-card rounded-xl border border-border overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Simulated map grid */}
        <svg viewBox="0 0 600 500" className="w-full h-full bg-background">
          {/* Grid lines */}
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 25} x2={600} y2={i * 25} className="stroke-border" strokeWidth={0.5} />
          ))}
          {Array.from({ length: 25 }, (_, i) => (
            <line key={`v${i}`} x1={i * 25} y1={0} x2={i * 25} y2={500} className="stroke-border" strokeWidth={0.5} />
          ))}

          {/* Risk zones */}
          {showRisk && zones.map((z, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const x = 50 + col * 130;
            const y = 40 + row * 145;
            return (
              <g key={z.id}>
                <rect x={x} y={y} width={110} height={120} rx={8} fill={riskColor(z.risk)} fillOpacity={0.15} stroke={riskColor(z.risk)} strokeOpacity={0.4} strokeWidth={1.5} />
                <text x={x + 55} y={y + 30} textAnchor="middle" className="fill-foreground" fontSize={11} fontWeight="bold">{z.id}</text>
                <text x={x + 55} y={y + 48} textAnchor="middle" className="fill-muted-foreground" fontSize={8}>{z.name}</text>
                <rect x={x + 25} y={y + 58} width={60} height={16} rx={8} fill={riskColor(z.risk)} fillOpacity={0.3} />
                <text x={x + 55} y={y + 70} textAnchor="middle" fill={riskColor(z.risk)} fontSize={8} fontWeight="bold">{z.risk}</text>
                <text x={x + 55} y={y + 95} textAnchor="middle" className="fill-muted-foreground" fontSize={9}>{z.calls} calls</text>
              </g>
            );
          })}

          {/* Ambulances */}
          {showAmbulances && ambulances.map((a, i) => {
            const zIdx = zones.findIndex(z => z.id === a.zone);
            const col = zIdx % 4;
            const row = Math.floor(zIdx / 4);
            const x = 95 + col * 130 + (i % 3) * 10;
            const y = 95 + row * 145;
            const isSelected = selectedAmb === a.id;
            return (
              <g key={a.id} onClick={() => setSelectedAmb(isSelected ? null : a.id)} className="cursor-pointer">
                <circle cx={x} cy={y} r={isSelected ? 14 : 10} fill={a.status === "Idle" ? "hsl(142 71% 45%)" : a.status === "Busy" ? "hsl(0 84% 60%)" : "hsl(38 92% 50%)"} fillOpacity={isSelected ? 0.5 : 0.3} stroke={a.status === "Idle" ? "hsl(142 71% 45%)" : a.status === "Busy" ? "hsl(0 84% 60%)" : "hsl(38 92% 50%)"} strokeWidth={isSelected ? 2 : 1} />
                <text x={x} y={y + 3} textAnchor="middle" className="fill-foreground" fontSize={7} fontWeight="bold">🚑</text>
              </g>
            );
          })}

          {/* Suggested routes */}
          {showRoutes && (
            <>
              <line x1={180} y1={325} x2={310} y2={180} stroke="hsl(199 89% 48%)" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.6} markerEnd="url(#arrow)" />
              <line x1={50} y1={325} x2={180} y2={40} stroke="hsl(199 89% 48%)" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.6} markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="hsl(199 89% 48%)" />
                </marker>
              </defs>
            </>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
          <div className="flex items-center gap-1 mb-2"><Layers className="h-3 w-3 text-muted-foreground" /><span className="text-[10px] font-semibold text-foreground">Legend</span></div>
          <div className="space-y-1">
            {[{ l: "Critical", c: "#ef4444" }, { l: "High", c: "#f87171" }, { l: "Moderate", c: "#f59e0b" }, { l: "Low", c: "#22c55e" }].map(i => (
              <div key={i.l} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ background: i.c, opacity: 0.5 }} />
                <span className="text-[9px] text-muted-foreground">{i.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected ambulance info */}
        {amb && (
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 w-56 animate-slide-up">
            <p className="text-sm font-bold text-foreground">🚑 {amb.id}</p>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <p>Zone: <span className="text-foreground">{ambZone?.name || amb.zone}</span></p>
              <p>Status: <span className={amb.status === "Idle" ? "text-neon-green" : amb.status === "Busy" ? "text-neon-red" : "text-neon-orange"}>{amb.status}</span></p>
              <p>ETA: <span className="text-foreground">~{Math.floor(Math.random() * 10 + 3)} min</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
