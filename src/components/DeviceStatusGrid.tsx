import type { Database } from "@/integrations/supabase/types";

type DeviceRow = Database["public"]["Tables"]["devices"]["Row"];

export function DeviceStatusGrid({ devices }: { devices: DeviceRow[] }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-4">Device Status</h3>
      {devices.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No devices yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {devices.map((device) => (
            <div key={device.id} className="p-3 rounded-lg border border-border/30 bg-secondary/20 hover:bg-secondary/40 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 shrink-0 ${device.status === "online" ? "status-online" : "status-offline"}`} />
                <span className="text-xs font-medium truncate">{device.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">{device.ip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
