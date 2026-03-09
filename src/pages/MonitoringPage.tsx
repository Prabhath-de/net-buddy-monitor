import { useNetworkStore } from "@/lib/network-store";
import { BandwidthChart } from "@/components/BandwidthChart";
import { LatencyChart } from "@/components/LatencyChart";
import { UptimeChart } from "@/components/UptimeChart";
import { useEffect } from "react";

export default function MonitoringPage() {
  const { devices, refreshMonitoring } = useNetworkStore();

  useEffect(() => {
    const interval = setInterval(refreshMonitoring, 30000);
    return () => clearInterval(interval);
  }, [refreshMonitoring]);

  const avgLatency = devices.filter(d => d.status === "online").reduce((sum, d) => sum + d.latency, 0) /
    (devices.filter(d => d.status === "online").length || 1);
  const totalBwIn = devices.reduce((sum, d) => sum + d.bandwidthIn, 0);
  const totalBwOut = devices.reduce((sum, d) => sum + d.bandwidthOut, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glow">Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Network performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Latency</p>
          <p className="text-3xl font-bold font-mono mt-2 text-warning">{avgLatency.toFixed(1)}<span className="text-sm text-muted-foreground ml-1">ms</span></p>
        </div>
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Inbound</p>
          <p className="text-3xl font-bold font-mono mt-2 text-primary">{(totalBwIn / 1000).toFixed(1)}<span className="text-sm text-muted-foreground ml-1">Gbps</span></p>
        </div>
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Outbound</p>
          <p className="text-3xl font-bold font-mono mt-2 text-success">{(totalBwOut / 1000).toFixed(1)}<span className="text-sm text-muted-foreground ml-1">Gbps</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BandwidthChart />
        <LatencyChart />
      </div>

      <UptimeChart />
    </div>
  );
}
