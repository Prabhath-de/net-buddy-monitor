
-- Create enum for device types
CREATE TYPE public.device_type AS ENUM ('server', 'router', 'switch');

-- Create enum for alert severity  
CREATE TYPE public.alert_severity AS ENUM ('critical', 'warning', 'info');

-- Devices table
CREATE TABLE public.devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ip text NOT NULL,
  type device_type NOT NULL DEFAULT 'server',
  location text DEFAULT '',
  status text NOT NULL DEFAULT 'online',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Monitoring metrics table
CREATE TABLE public.monitoring_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  latency numeric DEFAULT 0,
  bandwidth_in numeric DEFAULT 0,
  bandwidth_out numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'online',
  recorded_at timestamptz NOT NULL DEFAULT now()
);

-- Alerts table
CREATE TABLE public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  message text NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helper function
CREATE OR REPLACE FUNCTION public.is_device_owner(_device_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.devices
    WHERE id = _device_id AND created_by = auth.uid()
  )
$$;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Devices policies
CREATE POLICY "Users can view own devices" ON public.devices
  FOR SELECT TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Users can insert own devices" ON public.devices
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update own devices" ON public.devices
  FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Users can delete own devices" ON public.devices
  FOR DELETE TO authenticated USING (created_by = auth.uid());

-- Metrics policies
CREATE POLICY "Users can view own device metrics" ON public.monitoring_metrics
  FOR SELECT TO authenticated USING (public.is_device_owner(device_id));
CREATE POLICY "Users can insert metrics for own devices" ON public.monitoring_metrics
  FOR INSERT TO authenticated WITH CHECK (public.is_device_owner(device_id));

-- Alerts policies
CREATE POLICY "Users can view own device alerts" ON public.alerts
  FOR SELECT TO authenticated USING (public.is_device_owner(device_id));
CREATE POLICY "Users can insert alerts for own devices" ON public.alerts
  FOR INSERT TO authenticated WITH CHECK (public.is_device_owner(device_id));
CREATE POLICY "Users can update own device alerts" ON public.alerts
  FOR UPDATE TO authenticated USING (public.is_device_owner(device_id));

-- Indexes
CREATE INDEX idx_devices_created_by ON public.devices(created_by);
CREATE INDEX idx_metrics_device_id ON public.monitoring_metrics(device_id);
CREATE INDEX idx_metrics_recorded_at ON public.monitoring_metrics(recorded_at);
CREATE INDEX idx_alerts_device_id ON public.alerts(device_id);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at);
