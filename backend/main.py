"""
IA Platform Backend API
FastAPI server for farmer authentication, parcel management, satellite imagery
"""

import ee
from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException, status, UploadFile, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
import google.auth
from google.auth.transport.requests import AuthorizedSession
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional
import jwt
import os
import sys
import logging
import time
from pathlib import Path

logging.basicConfig(level=logging.INFO, stream=sys.stdout, format='%(message)s')

from database import init_db, get_db, Farmer, Parcel, SatelliteImage
from auth import verify_password, get_password_hash, create_access_token

# Initialize FastAPI app
app = FastAPI(
    title="IA Platform API",
    description="Agricultural intelligence platform - Farmer, parcel, and satellite data API",
    version="1.0.0-mvp"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup():
    init_db()
    print("âœ“ Database initialized")


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class FarmerRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
    region: Optional[str] = None
    phone: Optional[str] = None


class FarmerLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    farmer_id: int
    username: str


class FarmerProfile(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    region: Optional[str]
    phone: Optional[str]
    farm_size_hectares: Optional[float]
    primary_crops: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ParcelCreate(BaseModel):
    parcel_name: str
    centroid_lat: float
    centroid_lon: float
    area_hectares: float
    land_cover_classification: Optional[str] = None
    geometry_geojson: Optional[str] = None  # GeoJSON polygon


class ParcelResponse(BaseModel):
    id: int
    farmer_id: int
    parcel_name: str
    centroid_lat: float
    centroid_lon: float
    area_hectares: float
    land_cover_classification: Optional[str]
    geometry_geojson: Optional[str]  # GeoJSON polygon data
    marked_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


class SatelliteImageResponse(BaseModel):
    id: int
    parcel_id: int
    acquisition_date: datetime
    cloud_coverage_percent: float
    source: str
    mean_ndvi: Optional[float]
    tile_url_rgb: Optional[str]
    tile_url_ndvi: Optional[str]

    class Config:
        from_attributes = True


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def extract_token_from_header(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Extract Bearer token from Authorization header"""
    print(f"[DEBUG] Authorization header received: {authorization[:50] if authorization else 'None'}...")
    if not authorization:
        print("[DEBUG] No authorization header")
        return None
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        token = parts[1]
        print(f"[DEBUG] Token extracted: {token[:50]}...")
        return token
    print(f"[DEBUG] Invalid header format: {parts}")
    return None


def get_current_farmer(token: str = None, db: Session = Depends(get_db)) -> Farmer:
    """Verify JWT token and return current farmer"""
    print(f"[DEBUG] get_current_farmer called with token: {token[:50] if token else 'None'}...")
    if not token:
        print("[DEBUG] No token provided - raising 401")
        raise HTTPException(status_code=401, detail="No token provided")

    try:
        secret = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
        print(f"[DEBUG] Using SECRET_KEY for decode: {secret[:20]}...")
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        farmer_id = payload.get("sub")
        print(f"[DEBUG] Token decoded successfully, farmer_id: {farmer_id}")
        if not farmer_id:
            print("[DEBUG] No farmer_id in token")
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.InvalidTokenError as e:
        print(f"[DEBUG] JWT decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    print(f"[DEBUG] Farmer query result: {farmer}")
    if not farmer:
        print(f"[DEBUG] Farmer not found for id: {farmer_id}")
        raise HTTPException(status_code=404, detail="Farmer not found")

    print(f"[DEBUG] Farmer authenticated: {farmer.email}")
    return farmer


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/health")
async def health_check():
    """API health check"""
    return {
        "status": "healthy",
        "service": "IA Platform Backend",
        "timestamp": datetime.utcnow().isoformat()
    }


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/api/auth/register", response_model=TokenResponse)
async def register(farmer: FarmerRegister, db: Session = Depends(get_db)):
    """Register new farmer account"""
    # Check if email already exists
    if db.query(Farmer).filter(Farmer.email == farmer.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(Farmer).filter(Farmer.username == farmer.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create new farmer
    db_farmer = Farmer(
        email=farmer.email,
        username=farmer.username,
        password_hash=get_password_hash(farmer.password),
        full_name=farmer.full_name,
        region=farmer.region,
        phone=farmer.phone,
        is_active=True
    )
    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)

    # Generate token
    token = create_access_token(data={"sub": str(db_farmer.id)})

    return {
        "access_token": token,
        "farmer_id": db_farmer.id,
        "username": db_farmer.username
    }


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: FarmerLogin, db: Session = Depends(get_db)):
    """Farmer login"""
    farmer = db.query(Farmer).filter(Farmer.username == credentials.email).first()

    if not farmer or not verify_password(credentials.password, farmer.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Update last login
    farmer.last_login = datetime.utcnow()
    db.commit()

    # Generate token
    token = create_access_token(data={"sub": str(farmer.id)})

    return {
        "access_token": token,
        "farmer_id": farmer.id,
        "username": farmer.username
    }


# ============================================================================
# FARMER PROFILE
# ============================================================================

@app.get("/api/auth/profile", response_model=FarmerProfile)
async def get_profile(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get current farmer's profile"""
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)
    return farmer


@app.put("/api/auth/profile")
async def update_profile(
    farm_size_hectares: Optional[float] = None,
    primary_crops: Optional[str] = None,
    phone: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update farmer profile"""
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)

    if farm_size_hectares is not None:
        farmer.farm_size_hectares = farm_size_hectares
    if primary_crops is not None:
        farmer.primary_crops = primary_crops
    if phone is not None:
        farmer.phone = phone

    db.commit()
    return {"status": "updated"}


# ============================================================================
# PARCEL MANAGEMENT
# ============================================================================

@app.post("/api/parcels", response_model=ParcelResponse)
async def create_parcel(
    parcel: ParcelCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Farmer marks a new parcel on map"""
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)

    # Check if parcel already marked
    existing = db.query(Parcel).filter(
        Parcel.farmer_id == farmer.id,
        Parcel.centroid_lat == parcel.centroid_lat,
        Parcel.centroid_lon == parcel.centroid_lon
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Parcel already marked")

    # Create parcel
    db_parcel = Parcel(
        farmer_id=farmer.id,
        parcel_name=parcel.parcel_name,
        centroid_lat=parcel.centroid_lat,
        centroid_lon=parcel.centroid_lon,
        area_hectares=parcel.area_hectares,
        land_cover_classification=parcel.land_cover_classification,
        geometry_geojson=parcel.geometry_geojson
    )
    db.add(db_parcel)
    db.commit()
    db.refresh(db_parcel)

    print(f"âœ“ Parcel marked: {db_parcel.parcel_name} at ({parcel.centroid_lat}, {parcel.centroid_lon})")

    return db_parcel


@app.get("/api/parcels", response_model=list[ParcelResponse])
async def list_parcels(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all parcels for current farmer"""
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)
    parcels = db.query(Parcel).filter(
        Parcel.farmer_id == farmer.id,
        Parcel.is_active == True
    ).all()
    for p in parcels:
        logging.info(f"[PARCEL] id={p.id} name={p.parcel_name} geom_len={len(p.geometry_geojson) if p.geometry_geojson else 0}")
    logging.info(f"[GET] farmer={farmer.id} returned {len(parcels)} parcels")
    return parcels


@app.get("/api/parcels/{parcel_id}", response_model=ParcelResponse)
async def get_parcel(
    parcel_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get specific parcel"""
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)
    parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id,
        Parcel.farmer_id == farmer.id
    ).first()

    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")

    return parcel


@app.put("/api/parcels/{parcel_id}", response_model=ParcelResponse)
async def update_parcel(
    parcel_id: int,
    parcel: ParcelCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update parcel details and geometry"""
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)

    # Get parcel
    db_parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id,
        Parcel.farmer_id == farmer.id
    ).first()

    if not db_parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")

    # Update parcel
    print(f"[UPDATE] Before update - parcel_name: {db_parcel.parcel_name}, area: {db_parcel.area_hectares}")
    db_parcel.parcel_name = parcel.parcel_name
    db_parcel.centroid_lat = parcel.centroid_lat
    db_parcel.centroid_lon = parcel.centroid_lon
    db_parcel.area_hectares = parcel.area_hectares
    if parcel.geometry_geojson:
        db_parcel.geometry_geojson = parcel.geometry_geojson
    if parcel.land_cover_classification:
        db_parcel.land_cover_classification = parcel.land_cover_classification

    print(f"[UPDATE] Before commit - parcel_name: {db_parcel.parcel_name}, area: {db_parcel.area_hectares}")
    db.commit()
    print(f"[UPDATE] After commit")
    db.refresh(db_parcel)
    print(f"[UPDATE] After refresh - parcel_name: {db_parcel.parcel_name}, area: {db_parcel.area_hectares}")

    print(f"âœ“ Parcel updated: {db_parcel.parcel_name} (id={db_parcel.id}, farmer={farmer.email})")
    return db_parcel


@app.delete("/api/parcels/{parcel_id}")
async def delete_parcel(
    parcel_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Delete a parcel (soft delete - set is_active=false)"""
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)

    # Get parcel
    db_parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id,
        Parcel.farmer_id == farmer.id
    ).first()

    if not db_parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")

    # Soft delete
    db_parcel.is_active = False
    db.commit()

    print(f"âœ“ Parcel deleted: {db_parcel.parcel_name} (parcel_id={parcel_id})")
    return {"status": "deleted", "parcel_id": parcel_id}


# ============================================================================
# SATELLITE IMAGERY
# ============================================================================

@app.get("/api/parcels/{parcel_id}/satellite-images", response_model=list[SatelliteImageResponse])
async def get_satellite_images(
    parcel_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get satellite images for a parcel"""
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)

    # Verify parcel belongs to farmer
    parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id,
        Parcel.farmer_id == farmer.id
    ).first()

    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")

    # Get satellite images
    images = db.query(SatelliteImage).filter(
        SatelliteImage.parcel_id == parcel_id
    ).order_by(SatelliteImage.acquisition_date.desc()).all()

    return images


@app.post("/api/parcels/{parcel_id}/fetch-satellite-data")
async def fetch_satellite_data(
    parcel_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Trigger satellite data fetch for parcel
    In MVP: returns placeholder URLs
    In Phase 2: connects to Google Earth Engine / AWS S3
    """
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)

    # Verify parcel
    parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id,
        Parcel.farmer_id == farmer.id
    ).first()

    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")

    # MVP: Create placeholder satellite image record
    # In Phase 2: Call Google Earth Engine API
    satellite_image = SatelliteImage(
        parcel_id=parcel_id,
        acquisition_date=datetime.utcnow(),
        cloud_coverage_percent=5.0,
        source="sentinel2",
        tile_url_rgb="https://placeholder.sentinel-2.rgb.tif",
        tile_url_ndvi="https://placeholder.sentinel-2.ndvi.tif",
        mean_ndvi=0.65  # Placeholder
    )
    db.add(satellite_image)
    db.commit()

    return {
        "status": "processing",
        "message": "Satellite data is being fetched. Check again in a few minutes.",
        "parcel_id": parcel_id
    }


# ============================================================================
# MAP TILES (TKGM WMS Proxy)
# ============================================================================

@app.get("/api/map/wms-tiles/{z}/{x}/{y}")
async def get_wms_tiles(z: int, x: int, y: int):
    """
    Proxy TKGM WMS tiles for parcel boundaries
    In MVP: Redirects to TKGM public service
    In Phase 2: Caches tiles locally
    """
    # TKGM WMS endpoint (public, no auth required)
    tkgm_wms_url = "https://wms.tapu.gov.tr/kbs/rest/services/Basemap_Vector/MapServer/tile"

    # Redirect to TKGM service (MVP: simple redirect)
    return {
        "tile_url": f"{tkgm_wms_url}/{z}/{y}/{x}",
        "source": "TKGM (Turkish Land Registry)",
        "attribution": "Â© Turkish Land Registry Directorate (TKGM)"
    }


# ============================================================================
# HEALTH & INFO ENDPOINTS
# ============================================================================

@app.get("/api/info")
async def api_info():
    """API version and features"""
    return {
        "service": "IA Platform Backend",
        "version": "1.0.0-mvp",
        "features": [
            "Farmer authentication (JWT)",
            "Parcel management (mark on map)",
            "Satellite imagery serving (placeholder URLs)",
            "TKGM WMS tile proxy"
        ],
        "database": "SQLite (MVP) â†’ PostgreSQL+PostGIS (Phase 2)",
        "next_phase": "Google Earth Engine integration, multi-region cloud deployment"
    }


# ============================================================================
# RUN LOCALLY
# ============================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )






@app.post("/api/parcels/{parcel_id}/satellite/fetch")
async def fetch_satellite_image(parcel_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Sentinel-2 görüntüsünü background'da fetch et"""
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    if not parcel:
        return {"error": "Parcel not found"}
    
    # Background task başlat
    background_tasks.add_task(fetch_satellite_bg, parcel_id, parcel.centroid_lat, parcel.centroid_lon)
    return {"status": "Fetching satellite image...", "parcel_id": parcel_id}

def get_ee_session() -> AuthorizedSession:
    """
    EE thumbnail URL'leri (getThumbURL) authenticated bir istek gerektiriyor.
    ee.Initialize()'ın kullandığı aynı Application Default Credentials
    (renta-key.json service account) ile authorized bir requests session döner.
    """
    credentials, _ = google.auth.default(
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    return AuthorizedSession(credentials)


# --- Kalıcı uydu görüntüsü depolama ---
# EE'nin getThumbURL() ile döndürdüğü linkler SÜRELİ/geçici imzalı URL'lerdir,
# bir süre sonra geçersiz kalıp kırık görüntüye sebep olur. Bunu önlemek için
# fetch anında bytes'ı kendimiz indirip diskte kalıcı olarak saklıyoruz ve
# DB'ye EE linki yerine kendi sabit URL'imizi yazıyoruz.
SATELLITE_IMAGE_DIR = Path(__file__).parent / "satellite_images"
SATELLITE_IMAGE_DIR.mkdir(exist_ok=True)

BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")

app.mount("/satellite-static", StaticFiles(directory=str(SATELLITE_IMAGE_DIR)), name="satellite_static")


def save_ee_thumbnail(ee_url: str, filename: str) -> str:
    """EE thumbnail'ini authenticated şekilde indirip diske kaydeder, kalıcı/sabit public URL döner."""
    session = get_ee_session()
    resp = session.get(ee_url, timeout=30)
    resp.raise_for_status()
    filepath = SATELLITE_IMAGE_DIR / filename
    filepath.write_bytes(resp.content)
    return f"{BACKEND_BASE_URL}/satellite-static/{filename}"


def cleanup_old_satellite_images(parcel_id: int, keep: int = 3):
    """
    Parsel başına eski görüntü dosyalarının diskte sınırsız birikmesini önler
    (mgbric.info'daki 816 dosya / ~103GB disk krizi burada tekrarlanmasın diye).
    Her fetch sonrası çağrılır, sadece en yeni `keep` kadar dosyayı tutar.
    """
    for suffix in ("rgb", "ndvi"):
        pattern = f"parcel_{parcel_id}_*_{suffix}.png"
        files = sorted(
            SATELLITE_IMAGE_DIR.glob(pattern),
            key=lambda p: p.stat().st_mtime,
            reverse=True
        )
        for old_file in files[keep:]:
            try:
                old_file.unlink()
            except Exception as cleanup_err:
                print(f'⚠ Eski dosya silinemedi ({old_file.name}): {cleanup_err}')


def fetch_satellite_bg(parcel_id: int, lat: float, lng: float):
    """Background: Sentinel-2 uydu görüntüsünü indir"""
    from database import SessionLocal, SatelliteImage
    db = SessionLocal()
    
    try:
        # First create satellite image record
        sat_image = SatelliteImage(parcel_id=parcel_id, status="pending")
        db.add(sat_image)
        db.commit()
        
        ee.Initialize(project='renta-platform-505621')
        
        geometry = ee.Geometry.Point([lng, lat])
        # SR_HARMONIZED = atmosfer düzeltmeli surface reflectance.
        # S2_HARMONIZED (TOA) atmosferik saçılma yüzünden renk kaymasına
        # (pembe/eflatun ton) sebep oluyordu.
        image = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')\
            .filterBounds(geometry)\
            .filterDate('2026-06-01', '2026-08-15')\
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))\
            .sort('system:time_start', False)\
            .first()
        
        if image:
            # Parsel polygon'ıyla clip et
            import json
            parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
            geom_dict = json.loads(parcel.geometry_geojson)
            parcel_geometry = ee.Geometry(geom_dict)
            
            # Küçük parsellerde 10m'lik pikseller thumbnail'de kocaman/bloklu
            # görünüyor; bicubic resample bunu yumuşatıyor.
            smoothed = image.resample('bicubic')
            
            # Image'ı parsel sınırlarıyla kırp
            clipped = smoothed.clip(parcel_geometry)
            
            # RGB channels seç
            rgb = clipped.select(['B4', 'B3', 'B2'])

            # Sabit min/max yerine, parselin kendi piksel değerlerinden
            # %2-%98 percentile aralığını hesaplayıp otomatik "doğru pozlama"
            # elde ediyoruz. Mevsim/toprak/ışık koşuluna göre her seferinde
            # kendini ayarlıyor, elle sabit sayı tutmamıza gerek kalmıyor.
            try:
                stats = rgb.reduceRegion(
                    reducer=ee.Reducer.percentile([2, 98]),
                    geometry=parcel_geometry,
                    scale=10,
                    maxPixels=1e9
                ).getInfo()
                band_min = min(v for k, v in stats.items() if k.endswith('_p2') and v is not None)
                band_max = max(v for k, v in stats.items() if k.endswith('_p98') and v is not None)
            except Exception as stat_err:
                print(f'⚠ Percentile stretch hesaplanamadı, sabit değerlere düşülüyor: {stat_err}')
                band_min, band_max = 0, 3000

            url_ee = rgb.getThumbURL({
                'min': band_min,
                'max': band_max,
                'gamma': 1.4,
                'dimensions': 1024,  # 512'den yükseltildi: UI'da daha büyük/pürüzsüz görünüm
                'format': 'png'
            })

            # --- NDVI (bitki sağlığı indeksi) ---
            # NDVI = (NIR - Red) / (NIR + Red) = (B8 - B4) / (B8 + B4)
            # normalizedDifference(['B8','B4']) tam olarak bunu hesaplıyor.
            ndvi = clipped.normalizedDifference(['B8', 'B4']).rename('NDVI')

            # Parselin ortalama NDVI değeri (dashboard/trend grafiği için tek sayı)
            try:
                ndvi_stats = ndvi.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=parcel_geometry,
                    scale=10,
                    maxPixels=1e9
                ).getInfo()
                mean_ndvi = ndvi_stats.get('NDVI')
            except Exception as ndvi_stat_err:
                print(f'⚠ NDVI ortalaması hesaplanamadı: {ndvi_stat_err}')
                mean_ndvi = None

            # Renklendirilmiş NDVI haritası: kırmızı (düşük/stresli) -> sarı -> yeşil (sağlıklı yoğun bitki)
            ndvi_palette = [
                '#d73027', '#f46d43', '#fdae61', '#fee08b',
                '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'
            ]
            ndvi_url_ee = ndvi.getThumbURL({
                'min': -0.2,
                'max': 0.8,
                'palette': ndvi_palette,
                'dimensions': 1024,
                'format': 'png'
            })

            # EE'nin süreli linklerini kalıcı hale getir: bytes'ı şimdi indirip
            # diske kaydediyoruz, DB'ye kendi sabit URL'imizi yazıyoruz.
            timestamp = int(time.time())
            url = save_ee_thumbnail(url_ee, f"parcel_{parcel_id}_{timestamp}_rgb.png")
            ndvi_url = save_ee_thumbnail(ndvi_url_ee, f"parcel_{parcel_id}_{timestamp}_ndvi.png")
            cleanup_old_satellite_images(parcel_id)
            
            image_record = db.query(SatelliteImage)\
                .filter(SatelliteImage.parcel_id == parcel_id)\
                .order_by(SatelliteImage.created_at.desc())\
                .first()
            
            if image_record:
                image_record.url = url
                image_record.ndvi_url = ndvi_url
                image_record.mean_ndvi = mean_ndvi
                image_record.status = 'success'
                db.commit()
                print(f'✓ Satellite image ready for parcel {parcel_id} (mean NDVI: {mean_ndvi})')
        else:
            image_record = db.query(SatelliteImage)\
                .filter(SatelliteImage.parcel_id == parcel_id)\
                .order_by(SatelliteImage.created_at.desc())\
                .first()
            if image_record:
                image_record.status = 'error'
                image_record.error_message = 'No image found'
                db.commit()
    except Exception as e:
        image_record = db.query(SatelliteImage)\
            .filter(SatelliteImage.parcel_id == parcel_id)\
            .order_by(SatelliteImage.created_at.desc())\
            .first()
        if image_record:
            image_record.status = 'error'
            image_record.error_message = str(e)
            db.commit()
        print(f'✗ Error: {e}')
    finally:
        db.close()

@app.get("/api/parcels/{parcel_id}/satellite-status")
async def get_satellite_status(parcel_id: int):
    """Satellite fetch durumu"""
    # TODO: Database'de status tutmak lazım
    return {"status": "pending", "parcel_id": parcel_id}





@app.get("/api/parcels/{parcel_id}/satellite")
async def get_satellite_image(parcel_id: int, db: Session = Depends(get_db)):
    """Son Sentinel-2 satellite image'ı döndür"""
    try:
        image = db.query(SatelliteImage) \
            .filter(SatelliteImage.parcel_id == parcel_id) \
            .order_by(SatelliteImage.created_at.desc()) \
            .first()
        
        if not image:
            return {"status": "pending", "url": None, "error": "No image yet"}
        
        return {
            "id": image.id,
            "parcel_id": image.parcel_id,
            "status": image.status,
            "url": image.url,
            "mean_ndvi": image.mean_ndvi,
            "ndvi_url": image.ndvi_url,
            "error": image.error_message,
            "created_at": image.created_at.isoformat()
        }
    except Exception as e:
        return {"error": str(e)}








@app.get("/api/auth/profile")
async def get_profile(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)
    return {
        "id": farmer.id,
        "username": farmer.username,
        "full_name": farmer.full_name,
        "phone": farmer.phone
    }

@app.post("/api/auth/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    token = extract_token_from_header(authorization)
    farmer = get_current_farmer(token, db)
    if not verify_password(old_password, farmer.password_hash):
        raise HTTPException(status_code=400, detail="Eski şifre yanlış")
    farmer.password_hash = get_password_hash(new_password)
    db.commit()
    return {"message": "Şifre başarıyla değiştirildi"}











