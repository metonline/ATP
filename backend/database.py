"""
IA Platform - Database Models
SQLite for MVP, scales to PostgreSQL later
"""

from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database URL - SQLite for MVP
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ia_platform.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Farmer(Base):
    """Farmer user account"""
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)  # bcrypt hash
    full_name = Column(String)
    phone = Column(String, nullable=True)

    # Location (for quick lookup)
    region = Column(String, nullable=True)  # Turkish province/region
    district = Column(String, nullable=True)

    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Profile
    farm_size_hectares = Column(Float, nullable=True)
    primary_crops = Column(String, nullable=True)  # JSON: ["wheat", "corn"]


class Parcel(Base):
    """Agricultural parcel (land plot)"""
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))

    # Parcel identification
    parcel_id_government = Column(String, nullable=True, index=True)  # LPIS ID from government
    parcel_name = Column(String)  # User-given name (e.g., "Field A")

    # Geometry (simplified for MVP - full GeoJSON in Phase 2)
    centroid_lat = Column(Float)
    centroid_lon = Column(Float)
    area_hectares = Column(Float)

    # Government data reference
    tkgm_parcel_id = Column(String, nullable=True)  # Link to TKGM cadastral ID
    land_cover_classification = Column(String, nullable=True)  # From LPIS (wheat, corn, etc)

    # Farmer's marking
    marked_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    # Geometry (GeoJSON for Phase 2)
    geometry_geojson = Column(Text, nullable=True)  # Full boundary polygon


class SatelliteImage(Base):
    """Cached satellite imagery for parcels"""
    __tablename__ = "satellite_images"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id"))

    # Image metadata
    acquisition_date = Column(DateTime)  # When satellite captured it
    cloud_coverage_percent = Column(Float)
    source = Column(String)  # "sentinel2", "landsat9", etc

    # Image reference (for MVP - just links to external storage)
    tile_url_rgb = Column(String)  # URL to RGB composite
    tile_url_ndvi = Column(String)  # URL to NDVI index

    # Image stats
    mean_ndvi = Column(Float, nullable=True)  # Average NDVI for parcel
    min_ndvi = Column(Float, nullable=True)
    max_ndvi = Column(Float, nullable=True)

    fetched_at = Column(DateTime, default=datetime.utcnow)


class AnalysisResult(Base):
    """Analysis results for a parcel"""
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id"))

    # Analysis type
    analysis_type = Column(String)  # "ndvi", "moisture", "yield_forecast"
    analysis_date = Column(DateTime)

    # Result
    recommendation = Column(String)  # "Healthy", "Needs irrigation", etc
    confidence = Column(Float)  # 0.0 to 1.0
    details = Column(Text)  # JSON with detailed metrics

    created_at = Column(DateTime, default=datetime.utcnow)


# Create all tables on startup
def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
