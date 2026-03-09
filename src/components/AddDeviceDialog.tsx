import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDevice } from "@/lib/supabase-queries";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddDeviceDialog({ open, onClose }: Props) {
  const [form, setForm] = useState({ name: "", ip: "", type: "server" as "server" | "router" | "switch", location: "" });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: addDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      setForm({ name: "", ip: "", type: "server", location: "" });
      onClose();
      toast({ title: "Device added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.ip) return;
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass-card rounded-xl p-6 w-full max-w-md mx-4 border border-border/50">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add Device</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary/50 text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Device Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Core Router 03" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">IP Address</label>
            <input type="text" required value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="192.168.1.100" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Device Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="mt-1 w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="server">Server</option>
              <option value="router">Router</option>
              <option value="switch">Switch</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="DC-East Rack A" />
          </div>
          <button type="submit" disabled={mutation.isPending}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {mutation.isPending ? "Adding..." : "Add Device"}
          </button>
        </form>
      </div>
    </div>
  );
}
