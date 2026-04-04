import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { hourlyDemand, riskDistribution, featureImportance } from "@/lib/mockData";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-foreground">Analytics & Insights</h2>
        <p className="text-sm text-muted-foreground">Trends, patterns, and optimization analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Emergency Trends (Hourly)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hourlyDemand}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222 44% 9%)', border: '1px solid hsl(220 30% 18%)', borderRadius: '8px', fontSize: 12 }} />
              <Area type="monotone" dataKey="calls" stroke="hsl(199 89% 48%)" fill="url(#aGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(222 44% 9%)', border: '1px solid hsl(220 30% 18%)', borderRadius: '8px', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Feature Importance (Risk Model)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} domain={[0, 0.4]} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} width={90} />
              <Tooltip contentStyle={{ background: 'hsl(222 44% 9%)', border: '1px solid hsl(220 30% 18%)', borderRadius: '8px', fontSize: 12 }} />
              <Bar dataKey="importance" fill="hsl(199 89% 48%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Before vs After Optimization</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Avg Response Time", before: "11.4 min", after: "8.2 min", improvement: "-28%" },
              { label: "Coverage", before: "72%", after: "87%", improvement: "+21%" },
              { label: "Uncovered Zones", before: "5", after: "1", improvement: "-80%" },
              { label: "Idle Units", before: "2", after: "4", improvement: "+100%" },
            ].map(m => (
              <div key={m.label} className="bg-secondary rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase">{m.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs text-muted-foreground line-through">{m.before}</span>
                  <span className="text-sm font-bold text-foreground">{m.after}</span>
                </div>
                <p className="text-xs font-medium text-neon-green mt-0.5">{m.improvement}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-foreground">💡 <span className="font-medium">Insight:</span> High AQI correlates with 40% increased emergency demand. Temperature above 38°C compounds the effect by 18%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
