import { useQuery } from "@tanstack/react-query";
import { fetchDevices } from "@/lib/supabase-queries";
import { BandwidthChart } from "@/components/BandwidthChart";
import { LatencyChart } from "@/components/LatencyChart";
import { UptimeChart } from "@/components/UptimeChart";

export default function MonitoringPage() {
  const { data: devices = [] } = useQuery({ queryKey: ["devices"], queryFn: fetchDevices, refetchInterval: 30000 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glow">Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Network performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Devices</p>
          <p className="text-3xl font-bold font-mono mt-2 text-primary">{devices.length}</p>
        </div>
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Online</p>
          <p className="text-3xl font-bold font-mono mt-2 text-success">{devices.filter(d => d.status === "online").length}</p>
        </div>
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Offline</p>
          <p className="text-3xl font-bold font-mono mt-2 text-destructive">{devices.filter(d => d.status === "offline").length}</p>
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
