# Sentinel-2 Data Fetcher - IA Platform MVP

Simple Python script to query and configure Sentinel-2 satellite imagery for agricultural analysis.

## Quick Start

### 1. Install Dependencies
```bash
cd scripts/
pip install -r requirements.txt
```

### 2. Run Query
```bash
# Turkey (Istanbul region) - August 2024
python sentinel2_fetch.py \
  --bbox "28.5,41.0,29.5,41.5" \
  --date-start "2024-08-01" \
  --date-end "2024-08-31"

# OR smaller area (10km x 10km around a specific farm)
python sentinel2_fetch.py \
  --bbox "35.5,39.0,35.6,39.1" \
  --date-start "2024-08-01" \
  --date-end "2024-08-15"
```

### 3. Output
Script generates:
- `metadata_YYYY-MM-DD_to_YYYY-MM-DD.json` — Query config + available spectral indices (NDVI, NDMI, NDWI, NDBI)
- Console output with next steps

## Understanding the Data

### Sentinel-2 Characteristics
- **Resolution:** 10 meters/pixel (sufficient for 5-10 hectare fields)
- **Revisit Cycle:** Every 5 days (cloud cover permitting)
- **Cost:** FREE (public domain)
- **Coverage:** Global, including Turkey in full
- **Spectral Bands:** 13 bands including RGB + NIR (needed for NDVI)

### Key Spectral Indices

**NDVI (Normalized Difference Vegetation Index)**
```
NDVI = (NIR - RED) / (NIR + RED)
     = (B08 - B04) / (B08 + B04)

Range: -1.0 to +1.0
- -1.0 = Water
-  0.0 = Bare soil
- +0.4 = Healthy crops (minimum threshold)
- +0.9 = Dense vegetation
```

**NDMI (Normalized Difference Moisture Index)**
```
NDMI = (B8A - B11) / (B8A + B11)

Detects soil and vegetation water content
Useful for irrigation planning
```

**NDWI (Normalized Difference Water Index)**
```
NDWI = (GREEN - NIR) / (GREEN + NIR)
     = (B03 - B08) / (B03 + B08)

Detects water bodies and wetlands
```

## How to Download Actual Data

This MVP script **queries and plans** data. To download actual satellite imagery:

### Option 1: Google Earth Engine (RECOMMENDED)
**Easiest for Python development**

```python
# After signing up at https://earthengine.google.com
import ee

ee.Authenticate()
ee.Initialize()

# Define region and date range
geometry = ee.Geometry.Rectangle([35.5, 39.0, 35.6, 39.1])
date_start = '2024-08-01'
date_end = '2024-08-31'

# Filter Sentinel-2 imagery
sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(geometry) \
    .filterDate(date_start, date_end) \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))

# Calculate NDVI
image = sentinel2.first()
ndvi = image.normalizedDifference(['B8', 'B4'])

# Download
download_task = ee.batch.Export.image.toAsset(
    image=ndvi,
    description='sentinel2_ndvi',
    assetId='projects/YOUR_PROJECT/assets/sentinel2_ndvi'
)
download_task.start()
```

### Option 2: Copernicus Open Hub (Manual)
1. Sign up: https://apihub.copernicus.eu
2. Use web interface or python-sentinelsat library
3. Data available in JPEG2000 format (need conversion to GeoTIFF)

### Option 3: AWS S3 (Direct Download, No Account)
```bash
# List available tiles
aws s3 ls s3://sentinel-cogs/sentinel-s2-l2a/

# Download via GDAL/rasterio (handles cloud-optimized GeoTIFFs)
python -c "
import rasterio
from rasterio.io import MemoryFile

# Open remote GeoTIFF directly
with rasterio.open('s3://sentinel-cogs/sentinel-s2-l2a/...') as src:
    print(src.profile)  # Check metadata
"
```

## Architecture Alignment

✅ **In Scope (MVP Phase):**
- [ ] Query structure for Sentinel-2 L2A (bottom-of-atmosphere)
- [ ] NDVI + basic indices configuration
- [ ] Metadata generation
- [ ] Ready for integration with actual download APIs

❌ **Not in Scope (do later):**
- Direct image download (requires external service account)
- Real-time processing (Spark job for scale phase)
- Sentinel-1 SAR data (add in scale phase)
- Cloud masking algorithms (phase 2)

## Next Steps (After This MVP)

### Phase 1 Integration
1. Connect to Google Earth Engine or AWS S3
2. Implement actual image download
3. Add cloud masking (skip pixels with clouds)
4. Upload tiles to PostgreSQL+PostGIS

### Phase 2+ Enhancements
1. Batch processing (Spark/Airflow for 50K farmers)
2. Sentinel-1 SAR complement (all-weather analysis)
3. Temporal analysis (multi-year NDVI trends)
4. Government LPIS boundary validation

## File Structure
```
C:\Renta\
├── scripts/
│   ├── sentinel2_fetch.py          ← This script
│   ├── requirements.txt
│   ├── README_SENTINEL2.md          ← You are here
│   └── [Phase 2] ndvi_processor.py  ← Calculate NDVI from tiles
│
├── data/
│   └── sentinel2/
│       └── metadata_2024-08-01_to_2024-08-31.json
│
├── PROJECT_CHARTER.md               ← Technical foundation
├── DEVELOPMENT_ALIGNMENT_GUIDE.md   ← Feature decisions
└── CLAUDE.md                        ← (To be created)
```

## Troubleshooting

**"Invalid bbox format"**
- BBox must be 4 numbers: `min_lon,min_lat,max_lon,max_lat`
- Turkey example: `28.5,41.0,29.5,41.5` (Istanbul region)

**"Invalid date format"**
- Use YYYY-MM-DD format only
- Example: `2024-08-01`

**Need help with Turkish coordinates?**
- Use Google Maps, copy lat/lon, swap to lon,lat
- Or: https://www.coordtransform.com/ (Turkish GPS ↔ Decimal)

## References

- **PROJECT_CHARTER.md** → Canonical satellite strategy (Sentinel-2 primary)
- **Sentinel-2 Handbook:** https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi/overview
- **NDVI Interpretation:** https://www.usgs.gov/faqs/what-normalized-difference-vegetation-index-ndvi
- **Google Earth Engine:** https://developers.google.com/earth-engine/guides/getstarted
