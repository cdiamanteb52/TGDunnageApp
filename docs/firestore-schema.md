# Firestore Schema — MH Dunnage Management

Base path conventions
- appId: unique identifier for the app (environment-specific)
- Use: /artifacts/{appId}/public/data/...

1) PartCatalog (collection)
Path:
/artifacts/{appId}/public/data/partCatalog/{partNumber}

Doc fields:
- partNumber (string)  // doc ID = partNumber
- team (string)
- cell (string)
- primaryDunnage (string|null)
- backupDunnage (string|null)
- phStd (number|null)
- phBreak (number|null)
- phLunch (number|null)
- pk (number|null)
- createdAt (timestamp)
- updatedAt (timestamp)

2) CellStatus (collection)
Path:
/artifacts/{appId}/public/data/cellStatus/{cellName}

Doc fields:
- cellName (string) // doc ID = cellName
- isRunning (boolean)
- isDown (boolean)
- currentPartNumber (string|null)
- currentLabelBatch (number|null)
- lastUpdated (timestamp)
- changeoverPending (map|null) // { newPartNumber, requestedBy, requestedAt, labelBatch }
- isBackupCell (boolean)
- originalCell (string|null)
- lastDropOff (map|null) // { quantity, timestamp, materialHandlerId } (cached convenience)
- lastPickup (map|null)
- team (string) // convenience

3) DunnageLog (subcollection) — realtime, append-only
Path:
/artifacts/{appId}/public/data/cellStatus/{cellName}/dunnageLog/{logId}

Doc fields:
- timestamp (timestamp)
- materialHandlerId (string)
- type (string) // DROP_OFF, PICKUP, MANUAL_ADJUSTMENT, LABEL_ADJUSTMENT
- quantity (number)
- notes (string|null)

Business logic notes
- Countdown calculations are local (client) using:
    timeRemainingHours = (currentLabelBatch * PK) / PH
- PH/PK edits live in PartCatalog. When a CM changes PH/PK, clients using that part should display a "PH/PK changed — recalc?" prompt.

Security rules (short)
- Public read: allow read to partCatalog and cellStatus.
- Writes:
  - allow MH role to write new dunnageLog entries for cells in their team.
  - allow MH role to update limited fields on cellStatus for their assigned cells (isRunning toggle, lastDropOff cached).
  - allow CM role to write to partCatalog and full update cellStatus.

Note: implement server-side validation (Cloud Function or Firestore Rules) for critical transitions (e.g., changeover instant vs pending).

Migration & seeding
- Provide a seed script to load PartCatalog from CSV/JSON (example included).
