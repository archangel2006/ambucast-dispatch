import { useState } from "react";
import { RiskBadge } from "@/components/RiskBadge";
import { zones } from "@/lib/mockData";
import { Wind, Thermometer, Users, Droplets, HelpCircle } from "lucide-react";

export default function RiskPage() {
  const [selectedZone, setSelectedZone] = useState<string | null>("Z03");
  const zone = zones.find(z => z.id === selectedZone);

  const getAqiColor = (aqi: number) => aqi > 300 ? "text-neon-red" : aqi > 200 ? "text-neon-orange" : "text-neon-green";
  const getTempColor = (t: number) => t > 39 ? "text-neon-red" : t > 36 ? "text-neon-orange" : "text-neon-green";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-foreground">RiskPulse — Zone Risk Analysis</h2>
        <p className="text-sm text-muted-foreground">Explainable risk scoring for every zone</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {zones.map(z => (
          <button
            key={z.id}
            onClick={() => setSelectedZone(z.id)}
            className={`bg-card border rounded-xl p-4 text-left hover:scale-[1.02] transition-all ${selectedZone === z.id ? 'ring-2 ring-primary border-primary' : 'border-border'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground">{z.id}</span>
              <RiskBadge level={z.risk} />
            </div>
            <p className="text-xs text-muted-foreground">{z.name}</p>
            <p className="text-lg font-bold text-foreground mt-1">{z.calls} <span className="text-xs font-normal text-muted-foreground">calls</span></p>
          </button>
        ))}
      </div>

      {zone && (
        <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-foreground">{zone.name}</h3>
              <p className="text-xs text-muted-foreground">Zone {zone.id} · Detailed Risk Breakdown</p>
            </div>
            <RiskBadge level={zone.risk} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className={`h-4 w-4 ${getAqiColor(zone.aqi)}`} />
                <span className="text-[10px] text-muted-foreground uppercase">AQI</span>
              </div>
              <p className={`text-2xl font-bold ${getAqiColor(zone.aqi)}`}>{zone.aqi}</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${zone.aqi > 300 ? 'bg-neon-red' : zone.aqi > 200 ? 'bg-neon-orange' : 'bg-neon-green'}`} style={{ width: `${Math.min(zone.aqi / 5, 100)}%` }} />
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className={`h-4 w-4 ${getTempColor(zone.temp)}`} />
                <span className="text-[10px] text-muted-foreground uppercase">Temperature</span>
              </div>
              <p className={`text-2xl font-bold ${getTempColor(zone.temp)}`}>{zone.temp}°C</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${zone.temp > 39 ? 'bg-neon-red' : zone.temp > 36 ? 'bg-neon-orange' : 'bg-neon-green'}`} style={{ width: `${(zone.temp / 50) * 100}%` }} />
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase">Elderly %</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{zone.elderly}%</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${zone.elderly * 3}%` }} />
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-4 w-4 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase">Humidity</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{zone.humidity}%</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${zone.humidity}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-semibold text-foreground">Why this risk level?</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {zone.aqi > 300 && <li>• <span className="text-neon-red font-medium">Severe AQI ({zone.aqi})</span> — increases respiratory emergencies by ~40%</li>}
              {zone.temp > 38 && <li>• <span className="text-neon-orange font-medium">High temperature ({zone.temp}°C)</span> — heat-related illness risk elevated</li>}
              {zone.elderly > 20 && <li>• <span className="text-primary font-medium">High elderly population ({zone.elderly}%)</span> — vulnerable demographic concentration</li>}
              {zone.humidity > 70 && <li>• <span className="text-primary font-medium">High humidity ({zone.humidity}%)</span> — compounds heat stress effects</li>}
              {zone.risk === "LOW" && <li>• All environmental factors within safe ranges</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
