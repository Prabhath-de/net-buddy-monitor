import { create } from "zustand";
import {
  Device, Alert, BandwidthPoint, LatencyPoint, UptimePoint,
  generateDevices, generateAlerts, generateBandwidthData,
  generateLatencyData, generateUptimeHistory,
} from "./mock-data";

interface NetworkStore {
  devices: Device[];
  alerts: Alert[];
  bandwidthData: BandwidthPoint[];
  latencyData: LatencyPoint[];
  uptimeHistory: UptimePoint[];
  searchQuery: string;
  typeFilter: string;
  setSearchQuery: (q: string) => void;
  setTypeFilter: (t: string) => void;
  addDevice: (device: Omit<Device, "id" | "status" | "latency" | "uptime" | "bandwidthIn" | "bandwidthOut" | "lastChecked">) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  markAlertRead: (id: string) => void;
  refreshMonitoring: () => void;
  filteredDevices: () => Device[];
}

export const useNetworkStore = create<NetworkStore>((set, get) => {
  const devices = generateDevices();
  return {
    devices,
    alerts: generateAlerts(devices),
    bandwidthData: generateBandwidthData(),
    latencyData: generateLatencyData(),
    uptimeHistory: generateUptimeHistory(),
    searchQuery: "",
    typeFilter: "all",

    setSearchQuery: (q) => set({ searchQuery: q }),
    setTypeFilter: (t) => set({ typeFilter: t }),

    addDevice: (device) => set((state) => ({
      devices: [...state.devices, {
        ...device,
        id: `dev-${Date.now()}`,
        status: "online" as const,
        latency: Math.floor(Math.random() * 20) + 1,
        uptime: 100,
        bandwidthIn: Math.floor(Math.random() * 500) + 50,
        bandwidthOut: Math.floor(Math.random() * 200) + 20,
        lastChecked: new Date(),
      }],
    })),

    updateDevice: (id, updates) => set((state) => ({
      devices: state.devices.map(d => d.id === id ? { ...d, ...updates } : d),
    })),

    deleteDevice: (id) => set((state) => ({
      devices: state.devices.filter(d => d.id !== id),
      alerts: state.alerts.filter(a => a.deviceId !== id),
    })),

    markAlertRead: (id) => set((state) => ({
      alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a),
    })),

    refreshMonitoring: () => set((state) => {
      const devices = state.devices.map(d => {
        const flip = Math.random() < 0.03;
        const newStatus = flip ? (d.status === "online" ? "offline" : "online") : d.status;
        return {
          ...d,
          status: newStatus,
          latency: newStatus === "offline" ? 0 : Math.floor(Math.random() * 45) + 1,
          bandwidthIn: newStatus === "offline" ? 0 : Math.floor(Math.random() * 800) + 50,
          bandwidthOut: newStatus === "offline" ? 0 : Math.floor(Math.random() * 400) + 20,
          lastChecked: new Date(),
        } as Device;
      });

      const newAlerts = [...state.alerts];
      devices.forEach(d => {
        const prev = state.devices.find(p => p.id === d.id);
        if (prev && prev.status === "online" && d.status === "offline") {
          newAlerts.unshift({
            id: `alert-${Date.now()}-${d.id}`,
            deviceId: d.id,
            deviceName: d.name,
            message: `${d.name} (${d.ip}) went offline`,
            severity: "critical",
            timestamp: new Date(),
            read: false,
          });
        }
      });

      return {
        devices,
        alerts: newAlerts.slice(0, 50),
        latencyData: generateLatencyData(),
      };
    }),

    filteredDevices: () => {
      const { devices, searchQuery, typeFilter } = get();
      return devices.filter(d => {
        const matchesSearch = !searchQuery ||
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.ip.includes(searchQuery);
        const matchesType = typeFilter === "all" || d.type === typeFilter;
        return matchesSearch && matchesType;
      });
    },
  };
});
