# IA Platform PWA - Quick Start Guide

Progressive Web App for Turkish farmers to mark parcels and view satellite imagery.

## Architecture

```
IA Platform MVP
├─ Backend: FastAPI (Python)
│  ├─ Authentication (JWT + bcrypt)
│  ├─ Parcel Management API
│  ├─ Satellite Imagery Serving
│  └─ Database: SQLite (MVP) → PostgreSQL (Phase 2)
│
├─ Frontend: React + TypeScript (PWA)
│  ├─ Login/Register Pages
│  ├─ Interactive Map (Leaflet)
│  ├─ Parcel Management
│  ├─ Satellite Imagery Viewer
│  └─ Offline Support (Service Worker)
│
└─ Docker Compose (Local Development)
```

## Quick Start (5 minutes)

### Prerequisites
- Docker + Docker Compose
- OR Python 3.11 + Node.js 18+

### Option 1: Docker Compose (Easiest)

```bash
cd /path/to/C:\Renta

# Start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
# API runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## First Login

**Test Account:**
- Email: `test@farm.com`
- Password: `password123`

**Or Register New Account:**
1. Click "Üye Ol" (Sign Up)
2. Fill in details
3. Click "Kaydet" (Save)

## Features

### 1. Authentication
✅ User registration and login  
✅ JWT-based sessions (30-day tokens for mobile offline)  
✅ Password hashing (bcrypt)  

### 2. Parcel Management
✅ Click map to mark parcel location  
✅ Enter parcel name and area (hectares)  
✅ View all marked parcels  
✅ Delete/edit parcels  

### 3. Satellite Imagery
✅ Fetch Sentinel-2 satellite data for marked parcels  
✅ View NDVI (vegetation health index)  
✅ Display RGB and NDVI imagery  
✅ Track cloud coverage  

### 4. PWA Features
✅ Install as mobile app (iOS/Android)  
✅ Offline support (Service Worker)  
✅ Local data caching  
✅ Push notifications (Phase 2)  

## API Endpoints (for developers)

### Authentication
- `POST /api/auth/register` — Create farmer account
- `POST /api/auth/login` — Login and get JWT token

### Parcels
- `GET /api/parcels` — List farmer's parcels
- `POST /api/parcels` — Create new parcel
- `GET /api/parcels/{id}` — Get specific parcel
- `DELETE /api/parcels/{id}` — Delete parcel

### Satellite Data
- `GET /api/parcels/{id}/satellite-images` — Get images for parcel
- `POST /api/parcels/{id}/fetch-satellite-data` — Trigger data fetch

### Map Tiles
- `GET /api/map/wms-tiles/{z}/{x}/{y}` — Get TKGM WMS tiles

**Note:** All endpoints except `/api/auth/register` and `/api/auth/login` require JWT token in `Authorization: Bearer {token}` header.

## Database Schema

### Farmers Table
```sql
CREATE TABLE farmers (
  id INTEGER PRIMARY KEY,
  email STRING UNIQUE,
  username STRING UNIQUE,
  password_hash STRING,
  full_name STRING,
  region STRING,
  phone STRING,
  farm_size_hectares FLOAT,
  primary_crops STRING,
  is_active BOOLEAN,
  is_verified BOOLEAN,
  created_at DATETIME,
  last_login DATETIME
);
```

### Parcels Table
```sql
CREATE TABLE parcels (
  id INTEGER PRIMARY KEY,
  farmer_id INTEGER FOREIGN KEY,
  parcel_id_government STRING,
  parcel_name STRING,
  centroid_lat FLOAT,
  centroid_lon FLOAT,
  area_hectares FLOAT,
  tkgm_parcel_id STRING,
  land_cover_classification STRING,
  marked_at DATETIME,
  is_active BOOLEAN,
  geometry_geojson TEXT
);
```

### Satellite Images Table
```sql
CREATE TABLE satellite_images (
  id INTEGER PRIMARY KEY,
  parcel_id INTEGER FOREIGN KEY,
  acquisition_date DATETIME,
  cloud_coverage_percent FLOAT,
  source STRING,
  tile_url_rgb STRING,
  tile_url_ndvi STRING,
  mean_ndvi FLOAT,
  min_ndvi FLOAT,
  max_ndvi FLOAT,
  fetched_at DATETIME
);
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./ia_platform.db
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## Development Workflow

### 1. Adding a New Feature

**Backend (API):**
1. Add database model to `backend/database.py`
2. Add route to `backend/main.py`
3. Test via `curl` or Postman
4. Document in this README

**Frontend (UI):**
1. Create page in `frontend/src/pages/`
2. Create store/hooks in `frontend/src/store/`
3. Add route to `App.tsx`
4. Style with Tailwind CSS

### 2. Testing

**Backend:**
```bash
cd backend
pytest test_api.py
```

**Frontend:**
```bash
cd frontend
npm run test
```

### 3. Build for Production

**Docker:**
```bash
docker-compose -f docker-compose.prod.yml up --build
```

**Manual:**
```bash
# Backend
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:8000 main:app

# Frontend
npm run build
npm install -g serve
serve -s dist -l 5173
```

## Troubleshooting

### "Cannot connect to backend"
- Check backend is running: `curl http://localhost:8000/health`
- Check CORS settings in `backend/main.py`
- Check `VITE_API_URL` in frontend `.env`

### "Database locked" error
- SQLite has concurrency limits
- Upgrade to PostgreSQL for Phase 2
- Or: close all connections and restart

### "Map not loading"
- Leaflet CSS might not be loaded
- Check browser console for errors
- Try clearing cache: Ctrl+Shift+Del (Chrome)

### "Satellite data not fetching"
- MVP uses placeholder URLs
- Real data integration: See Phase 2 (Google Earth Engine)
- Check `backend/main.py` line for fetch_satellite_data()

## Roadmap & Alignment

This PWA is **MVP Phase** aligned with `PROJECT_CHARTER.md`:

✅ **Phase 1 MVP (Months 1-3):**
- [x] Farmer authentication
- [x] Parcel marking on map
- [x] Satellite imagery structure (placeholder)
- [ ] Pilot with 1 cooperative (test next)

🔄 **Phase 2 Scale (Months 4-6):**
- [ ] Google Earth Engine integration (real satellite data)
- [ ] TARBIL weather data
- [ ] Multi-spectral analysis (NDVI, NDMI, NDWI)
- [ ] Mobile app offline mode

📋 **Phase 3 Gov Integration (Months 7-12):**
- [ ] LPIS government parcel data API
- [ ] Subsidy eligibility checker
- [ ] KVKK compliance audit

## Stack Details

### Backend
- **FastAPI:** Modern Python web framework
- **SQLAlchemy:** ORM for database
- **Pydantic:** Data validation
- **PyJWT:** JWT token handling
- **Passlib:** Password hashing
- **Uvicorn:** ASGI server

### Frontend
- **React 18:** UI library
- **TypeScript:** Type safety
- **React Router:** Page routing
- **Leaflet:** Interactive maps
- **Axios:** HTTP requests
- **Zustand:** State management
- **Tailwind CSS:** Styling
- **Vite:** Build tool

### Deployment
- **Docker:** Container orchestration
- **Docker Compose:** Local multi-service setup

## Security Notes (MVP → Production)

**Current (MVP - Development Only):**
- ⚠️ Secret key is hardcoded
- ⚠️ No HTTPS (only localhost)
- ⚠️ SQLite has no encryption
- ⚠️ CORS allows all origins

**Before Production:**
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS/TLS
- ✅ Migrate to PostgreSQL (encrypted)
- ✅ Restrict CORS to specific origins
- ✅ Add rate limiting
- ✅ Add KVKK compliance checks
- ✅ Audit logging for data access

## Getting Help

- **Docs:** See `PROJECT_CHARTER.md` for architecture
- **API Reference:** `backend/main.py` docstrings
- **Error Logs:** Check browser console + backend terminal
- **Database:** SQLite file at `backend/ia_platform.db`

## Next Steps

1. **Test login/parcel marking** with test account
2. **Try marking a parcel** on the map
3. **Click satellite button** (shows placeholder structure)
4. **Read Phase 2 tasks** in PROJECT_CHARTER.md
5. **Integrate Google Earth Engine** (Phase 2)

---

**Status:** MVP Complete - Ready for pilot testing  
**Latest:** August 2026  
**Alignment:** Phase 1 of PROJECT_CHARTER.md ✅
