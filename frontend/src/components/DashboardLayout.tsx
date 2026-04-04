import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RefreshCw, Circle, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border">
                <Circle className={`h-2 w-2 fill-current ${isLive ? 'text-neon-green animate-pulse-glow' : 'text-warning'}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {isLive ? 'LIVE' : 'SIMULATED'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-mono">
                {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                {' · '}
                {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <button
                onClick={() => setIsLive(l => !l)}
                className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLive ? 'Switch to Sim' : 'Go Live'}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
