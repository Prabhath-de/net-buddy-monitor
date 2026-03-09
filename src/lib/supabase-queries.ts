import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DeviceRow = Database["public"]["Tables"]["devices"]["Row"];
type AlertRow = Database["public"]["Tables"]["alerts"]["Row"];
type MetricRow = Database["public"]["Tables"]["monitoring_metrics"]["Row"];

export async function fetchDevices() {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DeviceRow[];
}

export async function addDevice(device: { name: string; ip: string; type: "server" | "router" | "switch"; location: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  const { data, error } = await supabase
    .from("devices")
    .insert({ ...device, created_by: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDevice(id: string, updates: Partial<Pick<DeviceRow, "name" | "ip" | "type" | "location" | "status">>) {
  const { error } = await supabase.from("devices").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteDevice(id: string) {
  const { error } = await supabase.from("devices").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data as AlertRow[];
}

export async function markAlertRead(id: string) {
  const { error } = await supabase.from("alerts").update({ read: true }).eq("id", id);
  if (error) throw error;
}

export async function fetchMetrics(deviceId?: string) {
  let query = supabase
    .from("monitoring_metrics")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(100);
  if (deviceId) query = query.eq("device_id", deviceId);
  const { data, error } = await query;
  if (error) throw error;
  return data as MetricRow[];
}
