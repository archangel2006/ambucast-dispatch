import { RiskBadge } from "@/components/RiskBadge";
import { ambulances, zones, fleetSuggestions } from "@/lib/mockData";
import { ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";

const statusColor = {
  Idle: "text-neon-green",
  Busy: "text-neon-red",
  Moving: "text-neon-orange",
};

const statusDot = {
  Idle: "bg-neon-green",
  Busy: "bg-neon-red",
  Moving: "bg-neon-orange",
};

export default function FleetPage() {
  const uncovered = zones.filter(z => (z.risk === "CRITICAL" || z.risk === "HIGH") && !ambulances.some(a => a.zone === z.id && a.status !== "Idle"));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Fleet Optimization</h2>
          <p className="text-sm text-muted-foreground">Manage and optimize ambulance deployment</p>
        </div>
        <button
          onClick={() => toast.success("Fleet optimization executed! 4 units reassigned.")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors glow-blue"
        >
          <Zap className="h-4 w-4" /> Optimize Fleet Now
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Ambulance Fleet ({ambulances.length})</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {ambulances.map(a => {
              const z = zones.find(z => z.id === a.zone);
              return (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-foreground">{a.id}</span>
                    <div className={`h-2 w-2 rounded-full ${statusDot[a.status]}`} />
                    <span className={`text-xs font-medium ${statusColor[a.status]}`}>{a.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{z?.name || a.zone}</span>
                    {z && <RiskBadge level={z.risk} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Suggested Actions</h3>
            <div className="space-y-3">
              {fleetSuggestions.map(s => (
                <div key={s.ambulance} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary">{s.ambulance}</span>
                    <span className="text-xs text-muted-foreground">{s.from}</span>
                    <ArrowRight className="h-3 w-3 text-primary" />
                    <span className="text-xs font-semibold text-foreground">{s.to}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">ETA: {s.eta}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{s.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {uncovered.length > 0 && (
            <div className="bg-neon-red/5 rounded-xl border border-neon-red/20 p-5">
              <h3 className="text-sm font-semibold text-neon-red mb-3">Uncovered High-Risk Zones</h3>
              <div className="flex flex-wrap gap-2">
                {uncovered.map(z => (
                  <div key={z.id} className="flex items-center gap-2 px-3 py-1.5 bg-neon-red/10 rounded-lg">
                    <span className="text-xs font-bold text-foreground">{z.id}</span>
                    <span className="text-[10px] text-muted-foreground">{z.name}</span>
                    <RiskBadge level={z.risk} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
