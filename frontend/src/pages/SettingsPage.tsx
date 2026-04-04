import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [mode, setMode] = useState<"live" | "simulated">("live");
  const [aqi, setAqi] = useState(250);
  const [temp, setTemp] = useState(37);
  const [traffic, setTraffic] = useState(60);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-foreground">Settings & Simulation</h2>
        <p className="text-sm text-muted-foreground">Configure data sources and run simulations</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Data Mode</h3>
        <div className="flex gap-3">
          {(["live", "simulated"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-primary text-primary-foreground glow-blue' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
              {m === "live" ? "🟢 Real-Time Data" : "🔵 Simulated Data"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Simulation Parameters</h3>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs text-muted-foreground">AQI Level</label>
            <span className="text-xs font-mono text-primary">{aqi}</span>
          </div>
          <input type="range" min={50} max={500} value={aqi} onChange={e => setAqi(Number(e.target.value))} className="w-full accent-primary h-1" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs text-muted-foreground">Temperature (°C)</label>
            <span className="text-xs font-mono text-primary">{temp}</span>
          </div>
          <input type="range" min={20} max={50} value={temp} onChange={e => setTemp(Number(e.target.value))} className="w-full accent-primary h-1" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs text-muted-foreground">Traffic Intensity (%)</label>
            <span className="text-xs font-mono text-primary">{traffic}</span>
          </div>
          <input type="range" min={0} max={100} value={traffic} onChange={e => setTraffic(Number(e.target.value))} className="w-full accent-primary h-1" />
        </div>
      </div>

      <button
        onClick={() => toast.success(`Simulation started: AQI=${aqi}, Temp=${temp}°C, Traffic=${traffic}%`)}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors glow-blue"
      >
        🚀 Run Simulation
      </button>
    </div>
  );
}
