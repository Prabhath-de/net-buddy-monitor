import { useNetworkStore } from "@/lib/network-store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function LatencyChart() {
  const latencyData = useNetworkStore((s) => s.latencyData);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-4">Average Latency (30min)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} tickLine={false} axisLine={false} unit=" ms" />
            <Tooltip
              contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(210, 20%, 90%)" }}
            />
            <Line type="monotone" dataKey="latency" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="Latency" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
