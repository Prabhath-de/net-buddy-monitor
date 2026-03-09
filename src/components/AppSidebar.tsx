import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Server, Bell, Settings, Activity } from "lucide-react";
import { useNetworkStore } from "@/lib/network-store";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/devices", icon: Server, label: "Devices" },
  { to: "/monitoring", icon: Activity, label: "Monitoring" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
];

export function AppSidebar() {
  const location = useLocation();
  const alerts = useNetworkStore((s) => s.alerts);
  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 lg:w-56 flex flex-col bg-card/80 backdrop-blur-xl border-r border-border/50">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <span className="hidden lg:block font-semibold text-sm tracking-wide text-foreground">
          NetMonitor
        </span>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-primary/10 text-primary glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 shrink-0" />
                {label === "Alerts" && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block">{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
