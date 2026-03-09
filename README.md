# Smart Network Monitoring Dashboard

A modern, real-time network monitoring dashboard built with React and Lovable Cloud. Monitor your network devices, track bandwidth and latency, and receive alerts when devices go offline.

![Dashboard](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Backend](https://img.shields.io/badge/Backend-Lovable_Cloud-purple)

---

## Features

### Device Management
- Add, edit, and delete network devices (servers, routers, switches)
- Store device name, IP address, type, and location
- Search devices by name or IP address
- Filter by device type

### Real-Time Monitoring
- **Automated health checks** every minute via edge function
- HTTP ping to verify device availability
- Green/red status indicators for online/offline devices
- Live dashboard with device status grid
- Stores latency and bandwidth metrics in database

### Bandwidth Monitoring
- 24-hour bandwidth usage charts (inbound/outbound)
- Per-device traffic tracking
- Aggregate network throughput metrics

### Latency Monitoring
- 30-minute latency trend charts
- Average latency calculations across all devices
- Response time measured during health checks

### Alert System
- **Automatic critical alerts** when devices go offline
- **Info alerts** when devices come back online
- Severity levels: Critical, Warning, Info
- Mark alerts as read
- Unread alert badge in sidebar navigation

### Dashboard
- **Stat Cards**: Total devices, online, offline, active alerts
- **Charts**: Bandwidth usage, latency trends, uptime history
- **Device Grid**: Color-coded status tiles for all devices
- **Recent Alerts**: Quick access to latest notifications

### Authentication
- Secure admin login with email/password
- **Password reset flow** — forgot password + reset via email link
- Protected routes — only authenticated users can access the dashboard
- Row Level Security — users only see their own devices
- Session persistence with auto-refresh tokens

---

## Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | React 18, TypeScript, Vite              |
| Styling        | Tailwind CSS, shadcn/ui components      |
| State          | TanStack React Query, Zustand           |
| Charts         | Recharts                                |
| Backend        | Lovable Cloud (Supabase)                |
| Database       | PostgreSQL                              |
| Authentication | Supabase Auth                           |
| Edge Functions | Deno (device monitoring)                |
| Scheduling     | pg_cron (automated checks)              |
| Animations     | Framer Motion                           |

---

## Edge Functions

### `monitor-devices`
Automated device health check function that runs every minute via pg_cron.

**What it does:**
1. Fetches all devices from the database
2. Performs HTTP HEAD request to each device IP
3. Measures response time (latency)
4. Updates device status (online/offline)
5. Stores metrics in `monitoring_metrics` table
6. Creates alerts on status changes

**Endpoint:** `POST /functions/v1/monitor-devices`

**Note:** Devices must be publicly accessible via HTTP for health checks to work. Internal IPs (192.168.x.x, 10.x.x.x) are not reachable from edge functions.

---

## Database Schema

### `devices`
| Column       | Type          | Description                     |
|-------------|---------------|---------------------------------|
| `id`        | UUID (PK)     | Unique device identifier        |
| `name`      | TEXT          | Device name                     |
| `ip`        | TEXT          | IP address or hostname          |
| `type`      | ENUM          | `server`, `router`, `switch`    |
| `location`  | TEXT          | Physical location               |
| `status`    | TEXT          | `online` or `offline`           |
| `created_by`| UUID (FK)     | Owner (references auth.users)   |
| `created_at`| TIMESTAMPTZ   | Creation timestamp              |
| `updated_at`| TIMESTAMPTZ   | Last update timestamp           |

### `monitoring_metrics`
| Column         | Type          | Description                  |
|---------------|---------------|------------------------------|
| `id`          | UUID (PK)     | Unique metric identifier     |
| `device_id`   | UUID (FK)     | References devices table     |
| `latency`     | NUMERIC       | Ping response time (ms)      |
| `bandwidth_in`| NUMERIC       | Inbound traffic (Mbps)       |
| `bandwidth_out`| NUMERIC      | Outbound traffic (Mbps)      |
| `status`      | TEXT          | Device status at record time |
| `recorded_at` | TIMESTAMPTZ   | Measurement timestamp        |

### `alerts`
| Column       | Type          | Description                     |
|-------------|---------------|---------------------------------|
| `id`        | UUID (PK)     | Unique alert identifier         |
| `device_id` | UUID (FK)     | References devices table        |
| `message`   | TEXT          | Alert description               |
| `severity`  | ENUM          | `critical`, `warning`, `info`   |
| `read`      | BOOLEAN       | Read/unread status              |
| `created_at`| TIMESTAMPTZ   | Alert timestamp                 |

---

## Database Functions

### `is_device_owner(device_id UUID)`
Security helper function that checks if the current authenticated user owns a specific device. Used in RLS policies to prevent cross-user data access.

### `update_updated_at_column()`
Trigger function that automatically updates the `updated_at` timestamp when a device record is modified.

---

## Cron Jobs

| Job Name                    | Schedule    | Description                          |
|-----------------------------|-------------|--------------------------------------|
| `monitor-devices-every-minute` | `* * * * *` | Calls monitor-devices edge function |

Powered by `pg_cron` and `pg_net` extensions.

---

## Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own devices, metrics, and alerts
- `is_device_owner()` helper function prevents cross-user data access
- All API calls require authentication
- Edge function uses service role for cross-user device monitoring
- Passwords handled securely via Supabase Auth

---

## Project Structure

```
src/
├── components/
│   ├── AddDeviceDialog.tsx    # Add device modal form
│   ├── AppSidebar.tsx         # Navigation sidebar
│   ├── BandwidthChart.tsx     # Bandwidth area chart
│   ├── DeviceStatusGrid.tsx   # Device status tiles
│   ├── LatencyChart.tsx       # Latency line chart
│   ├── RecentAlerts.tsx       # Alert list component
│   ├── StatCard.tsx           # Dashboard stat cards
│   ├── UptimeChart.tsx        # Uptime bar chart
│   └── ui/                    # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx         # Authentication provider
├── lib/
│   ├── mock-data.ts           # Chart demo data generators
│   ├── supabase-queries.ts    # Database query functions
│   └── utils.ts               # Utility functions
├── pages/
│   ├── AlertsPage.tsx         # Alerts management page
│   ├── AuthPage.tsx           # Login/signup page
│   ├── Dashboard.tsx          # Main dashboard
│   ├── DevicesPage.tsx        # Device inventory page
│   ├── ForgotPasswordPage.tsx # Password reset request
│   ├── ResetPasswordPage.tsx  # Set new password
│   └── MonitoringPage.tsx     # Monitoring metrics page
└── integrations/
    └── supabase/              # Auto-generated types & client

supabase/
├── config.toml                # Supabase project config
└── functions/
    └── monitor-devices/       # Device health check function
        ├── deno.json
        └── index.ts
```

---

## Getting Started

1. **Sign up** — Create an account on the auth page
2. **Add devices** — Navigate to Devices → Add Device
3. **Monitor** — View real-time status on the Dashboard
4. **Alerts** — Check the Alerts page for notifications

### Adding a Device for Monitoring

For the automated health checks to work, devices must be accessible via HTTP:

```
✅ Works: google.com, api.example.com, 203.0.113.50 (public IP)
❌ Won't work: 192.168.1.1, 10.0.0.1 (private IPs)
```

---

## REST API Endpoints (via Supabase)

### Database Tables
| Method   | Endpoint              | Description            |
|----------|-----------------------|------------------------|
| `GET`    | `/devices`            | List user's devices    |
| `POST`   | `/devices`            | Add a new device       |
| `PATCH`  | `/devices/:id`        | Update a device        |
| `DELETE` | `/devices/:id`        | Delete a device        |
| `GET`    | `/monitoring_metrics` | Get monitoring data    |
| `GET`    | `/alerts`             | List alerts            |
| `PATCH`  | `/alerts/:id`         | Mark alert as read     |

### Edge Functions
| Method   | Endpoint                        | Description                    |
|----------|---------------------------------|--------------------------------|
| `POST`   | `/functions/v1/monitor-devices` | Trigger device health checks   |

---

## Authentication Routes

| Route              | Description                           |
|--------------------|---------------------------------------|
| `/auth`            | Login / Sign up page                  |
| `/forgot-password` | Request password reset email          |
| `/reset-password`  | Set new password (from email link)    |

---

## Design

- **Theme**: Dark NOC (Network Operations Center) style
- **Font**: Space Grotesk (display) + JetBrains Mono (data)
- **Accent**: Cyan (#06b6d4) primary with green/red status indicators
- **Effects**: Glassmorphism cards, glow effects, grid background
- **Responsive**: Mobile-friendly with collapsible sidebar

---

## Environment Variables

The following are automatically configured by Lovable Cloud:

| Variable                      | Description                    |
|-------------------------------|--------------------------------|
| `VITE_SUPABASE_URL`          | Supabase project URL           |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key    |
| `SUPABASE_SERVICE_ROLE_KEY`  | Service role key (edge functions) |

---

## Future Enhancements

- [ ] SNMP bandwidth collection
- [ ] Email alert notifications
- [ ] Device detail pages with individual metrics
- [ ] Network topology map
- [ ] Custom alert thresholds
- [ ] Admin role management
- [ ] Export monitoring reports (CSV/PDF)
- [ ] Dashboard widget customization

---

## License

MIT
