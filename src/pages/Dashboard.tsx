import { useQuery } from "@tanstack/react-query";
import { fetchDevices, fetchAlerts } from "@/lib/supabase-queries";
import { StatCard } from "@/components/StatCard";
import { BandwidthChart } from "@/components/BandwidthChart";
import { LatencyChart } from "@/components/LatencyChart";
import { UptimeChart } from "@/components/UptimeChart";
import { RecentAlerts } from "@/components/RecentAlerts";
import { DeviceStatusGrid } from "@/components/DeviceStatusGrid";
import { Server, Wifi, WifiOff, Bell } from "lucide-react";

export default function Dashboard() {
  const { data: devices = [] } = useQuery({ queryKey: ["devices"], queryFn: fetchDevices, refetchInterval: 30000 });
  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: fetchAlerts, refetchInterval: 30000 });

  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;
  const unread = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glow">Network Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time monitoring of all network devices</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Devices" value={devices.length} icon={<Server className="w-5 h-5" />} />
        <StatCard title="Online" value={online} icon={<Wifi className="w-5 h-5" />} variant="success" />
        <StatCard title="Offline" value={offline} icon={<WifiOff className="w-5 h-5" />} variant="destructive" />
        <StatCard title="Active Alerts" value={unread} icon={<Bell className="w-5 h-5" />} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BandwidthChart />
        <LatencyChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DeviceStatusGrid devices={devices} />
        </div>
        <RecentAlerts alerts={alerts} />
      </div>

      <UptimeChart />
    </div>
  );
}
