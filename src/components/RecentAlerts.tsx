import { useNetworkStore } from "@/lib/network-store";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function RecentAlerts() {
  const alerts = useNetworkStore((s) => s.alerts);
  const markAlertRead = useNetworkStore((s) => s.markAlertRead);
  const recent = alerts.slice(0, 8);

  const severityIcon = {
    critical: <AlertCircle className="w-4 h-4 text-destructive" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning" />,
    info: <Info className="w-4 h-4 text-primary" />,
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-4">Recent Alerts</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {recent.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No alerts</p>
        )}
        {recent.map((alert) => (
          <button
            key={alert.id}
            onClick={() => markAlertRead(alert.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
              alert.read
                ? "border-border/30 bg-transparent opacity-60"
                : "border-border/50 bg-secondary/30"
            } hover:bg-secondary/50`}
          >
            <div className="flex items-start gap-2">
              {severityIcon[alert.severity]}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-xs">{alert.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                </p>
              </div>
              {!alert.read && <span className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
