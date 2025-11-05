# TG Dunnage App

A backend API for managing dunnage data using Node.js, Express, TypeScript, and Prisma with PostgreSQL.

## 🚀 Quickstart

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TGDunnageApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your database connection string:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   PORT=4000
   JWT_SECRET=your-secret-key
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```
   
   When prompted, provide a name for the migration (e.g., "init").

6. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000`

## 📋 Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build the TypeScript project for production
- `npm start` - Start production server (requires build first)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with initial data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 🔌 API Endpoints

### Health Check
- **GET** `/health` - Check API status

### Dunnage Endpoints

#### List all dunnage items
- **GET** `/api/dunnage`
- Query parameters:
  - `team` (optional) - Filter by team name
  - `cell` (optional) - Filter by cell name
  - `search` (optional) - Search across team, cell, part number, and dunnage fields
- Example: `GET /api/dunnage?team=Team A&search=PN-001`

#### Get a single dunnage item
- **GET** `/api/dunnage/:id`
- Example: `GET /api/dunnage/1`

#### Create a new dunnage item
- **POST** `/api/dunnage`
- Request body:
  ```json
  {
    "team": "Team A",
    "cell": "Cell 1",
    "partNumber": "PN-009",
    "primaryDunnage": "Dunnage Type X",
    "backupDunnage": "Dunnage Type Y",
    "phStd": 100,
    "phBreak": 10,
    "phLunch": 30,
    "pkPiecesKanban": 50
  }
  ```
- Required fields: `team`, `cell`, `partNumber`, `primaryDunnage`
- Optional fields: `backupDunnage`, `phStd`, `phBreak`, `phLunch`, `pkPiecesKanban`

## 📁 Project Structure

```
TGDunnageApp/
├── data/
│   └── dunnage.csv          # Seed data (semicolon-separated)
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding script
├── src/
│   ├── routes/
│   │   └── dunnage.ts       # Dunnage API routes
│   ├── index.ts             # Express server entry point
│   └── prismaClient.ts      # Prisma client instance
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🗃️ Database Schema

### Dunnage Model

| Field           | Type     | Required | Description                    |
|-----------------|----------|----------|--------------------------------|
| id              | Int      | Yes      | Auto-increment primary key     |
| team            | String   | Yes      | Team name                      |
| cell            | String   | Yes      | Cell name                      |
| partNumber      | String   | Yes      | Part number                    |
| primaryDunnage  | String   | Yes      | Primary dunnage type           |
| backupDunnage   | String   | No       | Backup dunnage type            |
| phStd           | Int      | No       | Standard PH value              |
| phBreak         | Int      | No       | Break PH value                 |
| phLunch         | Int      | No       | Lunch PH value                 |
| pkPiecesKanban  | Int      | No       | Pieces per Kanban              |
| createdAt       | DateTime | Yes      | Record creation timestamp      |

## 🔜 Next Steps

- Frontend scaffold with React or Vue
- User authentication and authorization
- Additional CRUD operations (UPDATE, DELETE)
- Data validation and error handling enhancements
- Deployment configuration (Docker, CI/CD)
- API documentation (Swagger/OpenAPI)

## 📝 License

MIT
