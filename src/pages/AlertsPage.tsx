import { useNetworkStore } from "@/lib/network-store";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AlertsPage() {
  const { alerts, markAlertRead } = useNetworkStore();

  const severityConfig = {
    critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
    warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
    info: { icon: Info, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  };

  const unread = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-glow">Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">{unread} unread alert{unread !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.length === 0 && (
          <div className="glass-card rounded-xl p-10 text-center">
            <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
            <p className="text-muted-foreground">All clear — no alerts</p>
          </div>
        )}
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <button
              key={alert.id}
              onClick={() => markAlertRead(alert.id)}
              className={`w-full text-left glass-card rounded-xl p-4 border ${
                alert.read ? "border-border/30 opacity-50" : config.border
              } hover:bg-secondary/30 transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{alert.message}</p>
                    {!alert.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.deviceName} · {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <span className={`text-[10px] uppercase font-semibold tracking-wider ${config.color}`}>
                  {alert.severity}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
