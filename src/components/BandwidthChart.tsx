import { useNetworkStore } from "@/lib/network-store";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function BandwidthChart() {
  const bandwidthData = useNetworkStore((s) => s.bandwidthData);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-4">Bandwidth Usage (24h)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bandwidthData}>
            <defs>
              <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(187, 80%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(187, 80%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 70%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} tickLine={false} axisLine={false} unit=" Mbps" />
            <Tooltip
              contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(210, 20%, 90%)" }}
            />
            <Area type="monotone" dataKey="inbound" stroke="hsl(187, 80%, 45%)" fill="url(#colorIn)" strokeWidth={2} name="Inbound" />
            <Area type="monotone" dataKey="outbound" stroke="hsl(152, 70%, 45%)" fill="url(#colorOut)" strokeWidth={2} name="Outbound" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
