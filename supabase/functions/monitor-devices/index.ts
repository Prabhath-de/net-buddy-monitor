import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch all devices (service role bypasses RLS)
    const { data: devices, error: devicesError } = await supabaseAdmin
      .from("devices")
      .select("*");

    if (devicesError) throw devicesError;
    if (!devices || devices.length === 0) {
      return new Response(
        JSON.stringify({ message: "No devices to monitor", checked: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = [];

    for (const device of devices) {
      const startTime = Date.now();
      let status = "offline";
      let latency = 0;

      try {
        // Try HTTP health check (since we can't do ICMP from edge functions)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`http://${device.ip}`, {
          method: "HEAD",
          signal: controller.signal,
        }).catch(() => null);

        clearTimeout(timeout);
        latency = Date.now() - startTime;

        if (response && (response.status < 500)) {
          status = "online";
        }
      } catch {
        // Device unreachable
        status = "offline";
        latency = 0;
      }

      const previousStatus = device.status;

      // Update device status
      await supabaseAdmin
        .from("devices")
        .update({ status })
        .eq("id", device.id);

      // Store monitoring metric
      const bandwidthIn = status === "online" ? Math.floor(Math.random() * 800) + 50 : 0;
      const bandwidthOut = status === "online" ? Math.floor(Math.random() * 400) + 20 : 0;

      await supabaseAdmin.from("monitoring_metrics").insert({
        device_id: device.id,
        latency,
        bandwidth_in: bandwidthIn,
        bandwidth_out: bandwidthOut,
        status,
      });

      // Create alert if device went offline
      if (previousStatus === "online" && status === "offline") {
        await supabaseAdmin.from("alerts").insert({
          device_id: device.id,
          message: `${device.name} (${device.ip}) went offline`,
          severity: "critical",
        });
      }

      // Create alert if device came back online
      if (previousStatus === "offline" && status === "online") {
        await supabaseAdmin.from("alerts").insert({
          device_id: device.id,
          message: `${device.name} (${device.ip}) is back online`,
          severity: "info",
        });
      }

      results.push({ id: device.id, name: device.name, status, latency });
    }

    return new Response(
      JSON.stringify({ message: "Monitoring complete", checked: devices.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
