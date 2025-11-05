# Material Handler (MH) Dunnage Management — Architecture Overview

Overview
This single-page app (SPA) prioritizes real-time visibility and collaborative control. Firestore (Cloud Firestore) is the canonical database for:
- PartCatalog (public, readonly-ish for Material Handlers, writable by CMs)
- CellStatus (public, real-time state per cell)
- DunnageLog subcollections for activity audit

Recommended stack
- Frontend: React (Vite) + Firebase JS SDK (Realtime listeners) — responsive UI, fast dev loop.
- Hosting: Firebase Hosting (single command deploy).
- Backend (optional): Cloud Functions / Cloud Run for server-side validation, event-driven notifications, or scheduled tasks.
- Auth: Firebase Authentication (Google + email). Role mapping via custom claims:
  - mh_manager, mh_a, mh_b, cm (Cell Manager)
- CI: GitHub Actions for build/test and deploy to Firebase Hosting.

Realtime & offline behavior
- Use Firestore onSnapshot listeners for realtime updates.
- Use local persistence (Firestore SDK) to provide offline resilience for MHs in the plant.

Security model (high level)
- Public read access to PartCatalog and CellStatus for visibility.
- Writes restricted by role:
  - MHs: allowed to append to dunnageLog subcollections and update certain fields (DROP_OFF, PICKUP, LABEL_ADJUSTMENT) on their assigned cells.
  - CM: allowed full CRUD on PartCatalog and modify PH/PK and dunnage descriptions, and change cell metadata.
  - MH Manager: higher privileges across Team or Zone for bulk actions, changeovers.

Monitoring & alerts
- Implement Cloud Functions to watch for near-empty label batches or dunnage and push notifications (FCM) or Slack messages.

Deployable units
- SPA on Firebase Hosting.
- Optional Cloud Functions for notifications and server-side checks.
- CI pipeline to run lint/test and deploy.
