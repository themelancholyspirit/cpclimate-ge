# Quick Start Guide

## 🚀 Get Your Backend Running in 5 Minutes

**Note:** This project uses **Prisma 7** which has a new configuration system.

### Step 1: Database Setup (Choose One)

**Option A - Quick Local Setup with Docker:**
```bash
docker run --name postgres-env -e POSTGRES_PASSWORD=password -e POSTGRES_DB=environmental_monitoring -p 5432:5432 -d postgres:15
```

**Option B - Free Cloud Database (Supabase):**
1. Go to https://supabase.com
2. Create new project
3. Copy the PostgreSQL connection string

### Step 2: Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local and set your DATABASE_URL
```

### Step 3: Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma db push

# Seed with sample data
npm install tsx --save-dev
npx tsx prisma/seed.ts
```

### Step 4: Start App
```bash
npm run dev
```

Done! Visit http://localhost:3000

---

## 📋 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/map-points` | GET | Get map points (filter: ?type=water&status=normal) |
| `/api/map-points` | POST | Create map point |
| `/api/projects` | GET | Get projects (filter: ?status=Active) |
| `/api/projects/[slug]` | GET | Get project by slug |
| `/api/resources` | GET | Get resources (filter: ?category=Research) |
| `/api/media` | GET | Get media items |
| `/api/reports` | GET | Get reports (filter: ?status=pending) |
| `/api/reports` | POST | Submit citizen report |
| `/api/reports/[id]` | GET | Get report details |
| `/api/reports/[id]` | PATCH | Update report status |

---

## 🛠 Useful Commands

```bash
# View database in browser
npx prisma studio

# Reset and reseed database (deletes all data!)
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Check database connection
npx prisma db execute --stdin <<< "SELECT 1"
```

---

## 📂 Project Structure

```
environmental-monitoring-platform/
├── app/
│   ├── api/                    # ← Backend API routes
│   │   ├── map-points/
│   │   ├── projects/
│   │   ├── resources/
│   │   ├── media/
│   │   └── reports/
│   └── [pages]/               # Frontend pages
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data
├── lib/
│   └── prisma.ts              # Database client
└── .env.local                 # Environment variables
```

---

## 🔍 Testing

Test API endpoints:
```bash
# Get all map points
curl http://localhost:3000/api/map-points

# Submit a report
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"issueType":"water","location":"Test","locationDesc":"Test location","description":"Test description","reporterName":"Test User","reporterEmail":"test@example.com"}'
```

---

## ⚠️ Troubleshooting

**"Can't reach database server"**
→ Check PostgreSQL is running and DATABASE_URL is correct

**"Unknown argument: --stdin"** 
→ Update Prisma: `npm install prisma@latest @prisma/client@latest`

**Pages show "Loading..." forever**
→ Check browser console for API errors
→ Verify database has data: `npx prisma studio`

**"Module not found: @prisma/client"**
→ Run: `npx prisma generate`

---

For detailed instructions, see BACKEND_SETUP.md
