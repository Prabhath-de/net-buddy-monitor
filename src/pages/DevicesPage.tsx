import { useState } from "react";
import { useNetworkStore } from "@/lib/network-store";
import { Search, Plus, Trash2, Edit2, Server, Router, Network } from "lucide-react";
import { AddDeviceDialog } from "@/components/AddDeviceDialog";
import { Device } from "@/lib/mock-data";

const typeIcons = {
  server: Server,
  router: Router,
  switch: Network,
};

export default function DevicesPage() {
  const { filteredDevices, searchQuery, setSearchQuery, typeFilter, setTypeFilter, deleteDevice } = useNetworkStore();
  const [showAdd, setShowAdd] = useState(false);
  const devices = filteredDevices();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-glow">Devices</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage network device inventory</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Device
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Types</option>
          <option value="server">Servers</option>
          <option value="router">Routers</option>
          <option value="switch">Switches</option>
        </select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Device</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">IP Address</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Latency</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Bandwidth</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                const Icon = typeIcons[device.type];
                return (
                  <tr key={device.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3">
                      <span className={`w-2.5 h-2.5 inline-block ${device.status === "online" ? "status-online" : "status-offline"}`} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{device.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell font-mono text-muted-foreground">{device.ip}</td>
                    <td className="px-5 py-3 hidden lg:table-cell capitalize text-muted-foreground">{device.type}</td>
                    <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground">{device.location}</td>
                    <td className="px-5 py-3 hidden sm:table-cell font-mono">
                      {device.status === "online" ? `${device.latency}ms` : "—"}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell font-mono text-xs">
                      {device.status === "online" ? `↓${device.bandwidthIn} ↑${device.bandwidthOut}` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteDevice(device.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {devices.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No devices found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddDeviceDialog open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
