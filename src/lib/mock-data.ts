export type DeviceType = "server" | "router" | "switch";
export type DeviceStatus = "online" | "offline";

export interface Device {
  id: string;
  name: string;
  ip: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  latency: number; // ms
  uptime: number; // percentage
  bandwidthIn: number; // Mbps
  bandwidthOut: number; // Mbps
  lastChecked: Date;
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: Date;
  read: boolean;
}

export interface BandwidthPoint {
  time: string;
  inbound: number;
  outbound: number;
}

export interface LatencyPoint {
  time: string;
  latency: number;
}

export interface UptimePoint {
  date: string;
  uptime: number;
}

const deviceNames = [
  "Core Router 01", "Core Router 02", "Edge Switch A1", "Edge Switch A2",
  "Web Server 01", "Web Server 02", "DB Server Primary", "DB Server Replica",
  "Firewall 01", "Access Switch B1", "Access Switch B2", "App Server 01",
  "Load Balancer 01", "DNS Server", "Mail Server", "Backup Server",
];

const locations = ["DC-East Rack A", "DC-East Rack B", "DC-West Rack A", "DC-West Rack B", "Remote Office NY", "Remote Office LA"];
const types: DeviceType[] = ["router", "switch", "server"];

export function generateDevices(): Device[] {
  return deviceNames.map((name, i) => {
    const isOffline = Math.random() < 0.12;
    return {
      id: `dev-${i + 1}`,
      name,
      ip: `192.168.${Math.floor(i / 6) + 1}.${(i % 254) + 1}`,
      type: name.toLowerCase().includes("router") || name.toLowerCase().includes("firewall") ? "router"
        : name.toLowerCase().includes("switch") ? "switch" : "server",
      location: locations[i % locations.length],
      status: isOffline ? "offline" : "online",
      latency: isOffline ? 0 : Math.floor(Math.random() * 45) + 1,
      uptime: isOffline ? Math.floor(Math.random() * 80) + 10 : Math.floor(Math.random() * 5) + 95,
      bandwidthIn: isOffline ? 0 : Math.floor(Math.random() * 800) + 50,
      bandwidthOut: isOffline ? 0 : Math.floor(Math.random() * 400) + 20,
      lastChecked: new Date(),
    };
  });
}

export function generateAlerts(devices: Device[]): Alert[] {
  const offlineDevices = devices.filter(d => d.status === "offline");
  const alerts: Alert[] = offlineDevices.map((d, i) => ({
    id: `alert-${i + 1}`,
    deviceId: d.id,
    deviceName: d.name,
    message: `${d.name} (${d.ip}) is unreachable`,
    severity: "critical",
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    read: false,
  }));

  // Add some warning alerts
  const onlineDevices = devices.filter(d => d.status === "online");
  for (let i = 0; i < 3 && i < onlineDevices.length; i++) {
    const d = onlineDevices[i];
    alerts.push({
      id: `alert-warn-${i + 1}`,
      deviceId: d.id,
      deviceName: d.name,
      message: d.latency > 30 ? `High latency on ${d.name}: ${d.latency}ms` : `High bandwidth usage on ${d.name}`,
      severity: "warning",
      timestamp: new Date(Date.now() - Math.random() * 7200000),
      read: Math.random() > 0.5,
    });
  }

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateBandwidthData(): BandwidthPoint[] {
  const points: BandwidthPoint[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    points.push({
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      inbound: Math.floor(Math.random() * 600) + 200,
      outbound: Math.floor(Math.random() * 300) + 100,
    });
  }
  return points;
}

export function generateLatencyData(): LatencyPoint[] {
  const points: LatencyPoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60000);
    points.push({
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      latency: Math.floor(Math.random() * 30) + 5,
    });
  }
  return points;
}

export function generateUptimeHistory(): UptimePoint[] {
  const points: UptimePoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    points.push({
      date: d.toLocaleDateString([], { month: "short", day: "numeric" }),
      uptime: Math.floor(Math.random() * 3) + 97,
    });
  }
  return points;
}
