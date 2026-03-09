import { useNetworkStore } from "@/lib/network-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function UptimeChart() {
  const uptimeHistory = useNetworkStore((s) => s.uptimeHistory);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-4">Network Uptime History (30 days)</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={uptimeHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis dataKey="date" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[90, 100]} tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(210, 20%, 90%)" }}
            />
            <Bar dataKey="uptime" fill="hsl(187, 80%, 45%)" radius={[4, 4, 0, 0]} name="Uptime %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
