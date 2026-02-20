# Module 1 — Dashboard & UI
**Owner: Seran**  
**Stack: Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui**

---

## What This Module Does
This is the **front-end layer** of Neervazh Kavalan. It renders the health monitoring dashboard, ward-level risk heatmap, alerts panel, and data visualisation charts that health officers use every day.

The old project (`old_project/kpr_anti`) was ~50% complete with mock data. This module continues from that base and connects to **sachin's API** and **tarun's prediction engine** as those come online.

---

## Folder Structure
```
seran/
├── app/
│   ├── (dashboard)/      ← Protected routes: dashboard, alerts, upload, settings, zone_map
│   ├── landing/          ← Marketing/info page
│   ├── login/            ← Auth page
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/               ← shadcn/ui primitives (DO NOT edit directly)
│   ├── AlertsPanel.tsx
│   ├── CoimbatoreMap.tsx ← Ward heatmap (Mapbox/MapLibre)
│   ├── MetricCard.tsx
│   ├── Sidebar.tsx
│   ├── WardHeatmap.tsx
│   └── ...
├── contexts/             ← Auth & Theme provider
├── hooks/                ← useToast and custom hooks
├── lib/
│   ├── coimbatore-zones.ts  ← Ward geometry data
│   └── utils.ts
└── __tests__/            ← Jest/RTL unit tests
```

---

## Getting Started

```bash
cd kavalan/seran
npm install
npm run dev           # http://localhost:3000
```

---

## Key Tasks (from todo.txt)
- [ ] Replace mock data calls with real API calls to `sachin` module (port 8000)
- [ ] Connect heatmap to live risk scores from `tarun` module (port 8001)
- [ ] Implement Midnight Tech theme (`#010A39`, `#080908`, `#295EC9`)
- [ ] Add motion system: metric pulse, staggered tab transitions, alert pulse borders
- [ ] Add export buttons (PDF/CSV)
- [ ] Add color-blind safe mode

---

## API Integration Points
| Dashboard Feature       | Calls                                       |
|------------------------|---------------------------------------------|
| Ward list & map        | `GET /api/wards/`  (sachin)                 |
| Risk heatmap scores    | `POST /predict/{ward_id}` (tarun, port 8001)|
| Alerts panel           | `GET /api/alerts/` (sachin)                 |
| Alert acknowledge      | `PATCH /api/alerts/{id}/ack` (sachin)       |
| AI explanation         | `POST /explain/{ward_id}` (tarun)           |

---

## Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PREDICTION_API_URL=http://localhost:8001
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```
