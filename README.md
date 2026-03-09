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
- Automatic device status checks every 30 seconds
- Green/red status indicators for online/offline devices
- Live dashboard with device status grid

### Bandwidth Monitoring
- 24-hour bandwidth usage charts (inbound/outbound)
- Per-device traffic tracking
- Aggregate network throughput metrics

### Latency Monitoring
- 30-minute latency trend charts
- Average latency calculations across all devices

### Alert System
- Automatic alerts when devices go offline
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
- Protected routes — only authenticated users can access the dashboard
- Row Level Security — users only see their own devices

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
| Animations     | Framer Motion                           |

---

## Database Schema

### `devices`
| Column       | Type          | Description                     |
|-------------|---------------|---------------------------------|
| `id`        | UUID (PK)     | Unique device identifier        |
| `name`      | TEXT          | Device name                     |
| `ip`        | TEXT          | IP address                      |
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

## Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own devices, metrics, and alerts
- `is_device_owner()` helper function prevents cross-user data access
- All API calls require authentication

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
│   └── MonitoringPage.tsx     # Monitoring metrics page
└── integrations/
    └── supabase/              # Auto-generated types & client
```

---

## Getting Started

1. **Sign up** — Create an account on the auth page
2. **Add devices** — Navigate to Devices → Add Device
3. **Monitor** — View real-time status on the Dashboard
4. **Alerts** — Check the Alerts page for notifications

---

## REST API Endpoints (via Supabase)

| Method   | Endpoint              | Description            |
|----------|-----------------------|------------------------|
| `GET`    | `/devices`            | List user's devices    |
| `POST`   | `/devices`            | Add a new device       |
| `PATCH`  | `/devices/:id`        | Update a device        |
| `DELETE` | `/devices/:id`        | Delete a device        |
| `GET`    | `/monitoring_metrics` | Get monitoring data    |
| `GET`    | `/alerts`             | List alerts            |
| `PATCH`  | `/alerts/:id`         | Mark alert as read     |

---

## Design

- **Theme**: Dark NOC (Network Operations Center) style
- **Font**: Space Grotesk (display) + JetBrains Mono (data)
- **Accent**: Cyan primary with green/red status indicators
- **Effects**: Glassmorphism cards, glow effects, grid background
- **Responsive**: Mobile-friendly with collapsible sidebar

---

## Future Enhancements

- [ ] Real ICMP ping monitoring via edge functions
- [ ] SNMP bandwidth collection
- [ ] Email alert notifications
- [ ] Device detail pages with individual metrics
- [ ] Password reset flow
- [ ] Admin role management
- [ ] Export monitoring reports
- [ ] Custom alert thresholds

---

## License

MIT
