# TARBIL Data Architecture & IA Platform Integration Map
## Technical Integration Guide

**Document Type:** Technical Architecture & Data Integration Specification  
**Date:** August 2026  
**Audience:** CTO, ML Engineers, Data Engineers, Backend Engineers

---

## Overview

This document maps TARBIL's data sources and processing architecture to the IA Platform's 5-layer architecture, identifying integration points, data flows, and implementation requirements.

---

## Part 1: TARBIL Data Architecture (Current)

### TARBIL Tier 1: Satellite Data

```
AIRBUS DIRECT RECEIVING STATION (DRS)
│
├─ Input: SPOT 6/7 Satellites (Airbus)
│  ├─ Resolution: 1.5m multispectral
│  ├─ Frequency: Periodic (5-7 day revisit)
│  ├─ Coverage: Nationwide (Turkey)
│  └─ Processing latency: < 24 hours
│
├─ Processing: TARBIL Center (ITU)
│  ├─ Radiometric correction
│  ├─ Atmospheric correction
│  ├─ Cloud detection & masking
│  └─ Geometric registration (georeferencing)
│
└─ Output: Processed satellite mosaics
   ├─ Crop type classification
   ├─ NDVI maps (vegetation index)
   ├─ Phenology stage estimation
   └─ Yield forecasts (statistical models)
```

**TARBIL Advantage:** Direct receiving station = same-day processing  
**IA Alternative:** Copernicus Sentinel-2 (free, 5-day, sufficient for agriculture)

---

### TARBIL Tier 2: Ground Sensor Network

```
350+ AUTOMATED WEATHER STATIONS (expanding to 1,200)
│
├─ Location: Nationwide coverage (different agro-climatic zones)
│
├─ Sensor Types: Automated meteorological stations
│  ├─ Rainfall (mm/10min)
│  ├─ Temperature (°C)
│  ├─ Humidity (% relative)
│  ├─ Wind speed & direction
│  ├─ Solar radiation (if equipped)
│  ├─ Soil temperature (if equipped)
│  └─ Soil moisture (if equipped)
│
├─ Data Frequency: Every 10 minutes
│
├─ Data Transmission: GPRS/cellular to TARBIL Center
│
└─ Robotic Stations (Limited, research-grade)
   ├─ Advanced sensors (leaf wetness, spectroradiometer)
   ├─ Phenology observation (visual documentation)
   └─ Used for validation & research only
```

**TARBIL Scale:** 44,000+ total sensors across all types  
**IA Alternative:** Cooperative + farm-level sensors (distributed ownership)

---

### TARBIL Tier 3: Data Processing Pipeline

```
TARBIL CENTER (ITU) - DATA PROCESSING & MODELING

┌─ INPUT DATA LAYER ─────────────────────────────────┐
│ Satellite imagery (SPOT 6/7)                      │
│ Weather station data (10-min intervals)            │
│ Robotic station observations                       │
│ LPIS boundaries (Ministry data)                    │
│ Historical records (14+ years)                     │
└──────────────────────────────────────────────────┘
         ↓ [Automated Processing Pipeline]
┌─ PROCESSING LAYER ─────────────────────────────────┐
│                                                   │
│ 1. DATA QUALITY CONTROL                          │
│    ├─ Anomaly detection (sensor malfunction)     │
│    ├─ Data validation (range checks)             │
│    └─ Missing data interpolation                 │
│                                                   │
│ 2. SATELLITE IMAGE PROCESSING                    │
│    ├─ Cloud masking (remove cloudy pixels)       │
│    ├─ NDVI calculation (vegetation index)        │
│    ├─ Phenology estimation (growth stage)        │
│    └─ Change detection (anomalies vs. baseline)  │
│                                                   │
│ 3. MULTI-SENSOR FUSION                           │
│    ├─ Interpolate weather data (geostatistical)  │
│    ├─ Combine weather + satellite                │
│    ├─ Estimate key variables (ET, water stress)  │
│    └─ Cross-validate sensors (consistency check) │
│                                                   │
│ 4. STATISTICAL MODELING                          │
│    ├─ Crop yield prediction (regression models)  │
│    ├─ Disease risk assessment (empirical rules)  │
│    ├─ Phenology advancement (GDD models)         │
│    └─ Trend analysis (long-term monitoring)      │
│                                                   │
└──────────────────────────────────────────────────┘
         ↓ [Data Products]
┌─ OUTPUT LAYER ─────────────────────────────────────┐
│ Parcel-level yield estimates                     │
│ Crop type maps (annual)                          │
│ NDVI monitoring (weekly)                         │
│ Agro-meteorological parameter grids (120+)       │
│ Statistical forecasts                            │
│ Risk alerts (frost, disease, drought)            │
└──────────────────────────────────────────────────┘
         ↓ [Farmer Access]
┌─ DELIVERY LAYER ───────────────────────────────────┐
│ Tablet/web dashboard (interactive maps)          │
│ Mobile app (alerts, notifications)               │
│ SMS (basic text alerts)                          │
│ Government reports (statistics)                  │
└──────────────────────────────────────────────────┘
```

---

### TARBIL Tier 4: Data Products (Farmer-Facing)

| Product | Frequency | Resolution | Format | Farmer Use |
|---------|-----------|-----------|--------|------------|
| **NDVI Map** | Weekly | 10m | Color-coded map | Crop health tracking |
| **Crop Type Map** | Annual | Parcel (LPIS) | Field boundaries | Subsidy documentation |
| **Yield Forecast** | Monthly | Regional | Graph/number | Production planning |
| **Phenology Stage** | Weekly | Regional | Text/number | Growth tracking |
| **Agro-meteorological Alerts** | Real-time | Station-based | SMS/app | Immediate action (spray, irrigate) |
| **Risk Alerts** | Event-based | Regional | SMS/app | Frost, drought, hail warnings |

**Key Insight:** TARBIL delivers data products (outputs); **IA adds interpretation layer** (farmer-friendly recommendations)

---

## Part 2: IA Platform 5-Layer Architecture & TARBIL Integration

### IA Layer 1: User Interface

```
FARMER PORTAL & MOBILE APP (React.js + React Native)

┌─ WEB DASHBOARD ────────────────┐
│ • Field maps (satellite NDVI)   │
│ • Alert inbox (urgent actions)  │
│ • Production planning calendar  │
│ • Yield benchmarking            │
│ • Equipment marketplace         │
│ • Expert consultation booking   │
└────────────────────────────────┘

┌─ MOBILE APP (iOS/Android) ─────┐
│ • Push alerts (irrigation, frost)│
│ • Quick actions (book expert)   │
│ • Offline capability (sync when online)
│ • SMS fallback (low bandwidth)  │
│ • Voice interface (optional)    │
└────────────────────────────────┘

TARBIL INTEGRATION POINTS:
├─ Display NDVI maps (TARBIL → IA frontend)
├─ Show LPIS boundaries (TARBIL → IA visualization)
├─ Show regional benchmarks (TARBIL data → IA analytics)
└─ Link to historical yields (TARBIL data → IA reference)
```

---

### IA Layer 2: Business Logic (6 Core Modules)

```
FMIS MODULES (Python/Node.js Microservices)

┌─ FMIS.Monitor ────────────────┐   ← TARBIL DATA INPUT PRIMARY
│ Satellite + IoT monitoring     │
│ • Sentinel-2 NDVI processing   │
│ • Sentinel-1 soil moisture     │
│ • Weather data fusion          │
│ • Disease/pest detection (CNN) │
│ • Alert generation engine      │
│ ├─ Irrigation recommendations  │
│ ├─ Disease risk alerts         │
│ ├─ Frost/drought warnings      │
│ └─ Phenology tracking          │
└────────────────────────────────┘
         ↓
┌─ FMIS.Agro ───────────────────┐   ← TARBIL OUTPUT INTEGRATION
│ Production planning ERP        │
│ • 90-day farming schedule      │
│ • Task management              │
│ • Fertilizer/pesticide timing  │
│ • Water/irrigation planning    │
│ • Machinery operations         │
│ └─ TARBIL alerts feed into     │
│    production schedule         │
└────────────────────────────────┘
         ↓
┌─ FMIS.AI-Helpdesk ────────────┐   ← EXPERT LAYER (TARBIL gap)
│ Expert consultation marketplace│
│ • Connect to agronomists       │
│ • Disease specialist network   │
│ • Expert interpretation        │
│ └─ "What does TARBIL alert    │
│    mean for MY farm?"          │
└────────────────────────────────┘
         ↓
┌─ FMIS.Market-Access ─────────┐   ← MONETIZATION LAYER
│ B2B commerce + traceability   │
│ • Input procurement           │
│ • Buyer access (export)       │
│ • Price negotiation           │
│ • Blockchain traceability     │
│ └─ TARBIL satellite data      │
│    validates quality claim    │
└────────────────────────────────┘
         ↓
┌─ FMIS.Equipment ──────────────┐   ← OPERATIONAL LAYER
│ P2P equipment marketplace     │
│ • Equipment rental registry   │
│ • Booking system             │
│ • Ratings/reviews            │
│ └─ TARBIL alerts trigger     │
│    equipment needs           │
└────────────────────────────────┘
         ↓
┌─ FMIS.Livestock ──────────────┐   ← NON-TARBIL EXTENSION
│ Veterinary AI & marketplace   │
│ • Animal health monitoring    │
│ • Vet consultation network    │
│ • Livestock marketplace       │
│ └─ Orthogonal to TARBIL      │
│    (no satellite benefit)     │
└────────────────────────────────┘
```

**TARBIL Integration Strategy:**
- **FMIS.Monitor** = Direct TARBIL data consumer (satellite imagery, alerts)
- **FMIS.Agro** = TARBIL alerts + production planning integration
- **FMIS.AI-Helpdesk** = Expert interpretation of TARBIL data
- **FMIS.Market-Access** = TARBIL quality validation (satellite proof)
- **FMIS.Equipment** = Alert-triggered equipment rental needs
- **FMIS.Livestock** = No TARBIL integration (orthogonal)

---

### IA Layer 3: Service Integrations

```
EXTERNAL SERVICES & APIs

┌─ TARBIL DATA INTEGRATION ──────┐   ← PRIMARY GOVERNMENT DATA
│ Historical yields              │
│ LPIS field boundaries          │
│ Multi-year satellite archive   │
│ Validated crop type data       │
│ Regional benchmarks            │
│ Data flow: TARBIL → IA cache  │
└────────────────────────────────┘

┌─ GOVERNMENT SYSTEMS ───────────┐   ← LPIS, SUBSIDY DATA
│ Ministry LPIS (field data)     │
│ Subsidy program integration    │
│ CAP audit support              │
│ Data flow: Ministry → IA       │
└────────────────────────────────┘

┌─ SATELLITE SERVICES ───────────┐   ← OPERATIONAL SATELLITE
│ Copernicus Sentinel-2 (FREE)   │
│ Sentinel-1 radar (FREE)        │
│ Google Earth Engine API        │
│ Data flow: ESA → IA pipeline   │
└────────────────────────────────┘

┌─ WEATHER SERVICES ─────────────┐   ← REAL-TIME METEOROLOGY
│ TSMS API (hourly real-time)    │
│ University stations            │
│ Cooperative IoT sensors        │
│ OpenWeatherMap (backup)        │
│ Data flow: Weather → IA        │
└────────────────────────────────┘

┌─ EXPERT MARKETPLACE ───────────┐   ← AGRONOMIST NETWORK
│ 300+ consultants (Phase 2)     │
│ Payment processing             │
│ Scheduling & communication     │
│ Consultation logging           │
│ Data flow: IA → Experts → IA   │
└────────────────────────────────┘

┌─ INPUT SUPPLIERS ──────────────┐   ← B2B PROCUREMENT
│ Fertilizer suppliers           │
│ Seed vendors                   │
│ Pesticide retailers            │
│ Equipment rental companies     │
│ Data flow: IA ↔ Suppliers      │
└────────────────────────────────┘

┌─ PAYMENT PROCESSING ───────────┐
│ Stripe (primary)               │
│ Local payment gateways         │
│ Data flow: IA ↔ Payment        │
└────────────────────────────────┘

┌─ IOT SENSOR NETWORKS ──────────┐   ← GROUND TRUTH VALIDATION
│ Cooperative weather stations   │
│ Farm-level soil sensors        │
│ Hardware-agnostic             │
│ Data flow: IoT → IA gateway    │
└────────────────────────────────┘
```

**TARBIL as Tier 3 Service:**
```
TARBIL ← Service Integration
├─ Data Provider Role: Historical satellite, yields, LPIS validation
├─ Credibility Provider: Government-backed data enhances IA trust
├─ Partnership Benefits: ITU researchers access IA farmer feedback data
└─ Data Flow: Batch (daily TARBIL exports) + Real-time (alerts)
```

---

### IA Layer 4: Data & Infrastructure

```
DATABASE & ANALYTICS LAYER

┌─ RELATIONAL DATABASE (PostgreSQL) ────┐
│ Tables:                              │
│ ├─ farmers (user profiles)           │
│ ├─ fields (farm parcels)             │
│ ├─ production_plans (FMIS.Agro)      │
│ ├─ satellite_observations (weekly)   │
│ ├─ weather_data (hourly)             │
│ ├─ alerts (recommendations)          │
│ ├─ expert_consultations (bookings)   │
│ ├─ marketplace_transactions (B2B)    │
│ ├─ equipment_rentals (P2P)           │
│ └─ farmer_feedback (outcomes)        │
│                                      │
│ TARBIL Integration:                  │
│ ├─ tarbil_historical_yields table    │
│ ├─ tarbil_lpis_reference             │
│ ├─ tarbil_phenology_archive          │
│ └─ benchmark_comparisons             │
└──────────────────────────────────────┘

┌─ TIME-SERIES DATABASE (MongoDB) ──────┐
│ Collections:                         │
│ ├─ satellite_ndvi_timeseries         │
│ ├─ weather_timeseries                │
│ ├─ sensor_timeseries (IoT)           │
│ ├─ alert_history                     │
│ └─ farmer_action_logs                │
│                                      │
│ TARBIL Integration:                  │
│ ├─ tarbil_satellite_archive          │
│ ├─ tarbil_weather_archive            │
│ └─ historical_ndvi_timeseries        │
└──────────────────────────────────────┘

┌─ CACHE (Redis) ──────────────────────┐
│ Real-time data:                      │
│ ├─ Current alert status              │
│ ├─ Active consultations              │
│ ├─ Recent recommendations            │
│ └─ Live commodity prices             │
└──────────────────────────────────────┘

┌─ DATA WAREHOUSE (Analytics) ──────────┐
│ OLAP cube for analytics:             │
│ ├─ Yield trends (farmer vs. regional)│
│ ├─ Alert effectiveness (correlation │
│    with farmer outcomes)             │
│ ├─ Expert recommendation validation  │
│ ├─ Satellite accuracy metrics        │
│ ├─ Farmer adoption trends            │
│ └─ ROI analysis                      │
│                                      │
│ TARBIL Comparison Data:              │
│ ├─ Regional yield benchmarks         │
│ ├─ IA vs. TARBIL accuracy            │
│ ├─ Model calibration metrics         │
│ └─ Government reporting              │
└──────────────────────────────────────┘
```

**Data Flow from TARBIL:**
```
TARBIL Historical Database
    ↓ (Daily export via API/FTP)
IA Staging Area
    ↓ (ETL process, data validation)
PostgreSQL (farmer benchmarks)
MongoDB (time-series archive)
Data Warehouse (analytics)
    ↓
Farmer Dashboard (regional yield comparison)
Data Scientist (model training)
Government Reports (validation)
```

---

### IA Layer 5: ICT Technology Backbone

```
COMMUNICATION + INFORMATION TECHNOLOGIES INTEGRATION

┌─ COMMUNICATION INFRASTRUCTURE ────┐
│ • Mobile networks (4G/LTE)        │
│ • ISP internet connectivity       │
│ • Offline-capable sync            │
│ • Real-time WebSocket alerts      │
│ • SMS fallback (critical alerts)  │
│ • Message queue (Kafka)           │
│                                   │
│ TARBIL Alignment:                 │
│ ├─ Satellite data pushed          │
│ │  via WebSocket (real-time)      │
│ ├─ LPIS data cached               │
│ │  locally (offline access)       │
│ ├─ Weather alerts via SMS         │
│ │  (low bandwidth)                │
│ └─ Batch TARBIL exports           │
│    (nightly sync)                 │
└───────────────────────────────────┘

┌─ INFORMATION TECHNOLOGIES ────────┐
│ • Cloud (AWS/Azure Turkey)        │
│ • GPU compute (TensorFlow)        │
│ • Data processing (satellite)     │
│ • Analytics (BI, dashboards)      │
│                                   │
│ TARBIL Integration:               │
│ ├─ Sentinel processing (free ESA) │
│ ├─ TARBIL data cache (on-disk)    │
│ ├─ Model serving (inference)      │
│ └─ Analytics queries (OLAP)       │
└───────────────────────────────────┘

┌─ INTEGRATION TECHNOLOGIES ────────┐
│ • APIs (REST, GraphQL)            │
│ • Message queues (Kafka, MQTT)    │
│ • ETL pipelines (Airflow)         │
│ • Protocol adapters (IoT, legacy) │
│                                   │
│ TARBIL Integration:               │
│ ├─ TARBIL REST API wrapper        │
│ ├─ Batch data pipeline (daily)    │
│ ├─ IoT sensor aggregator          │
│ └─ Government system bridge       │
└───────────────────────────────────┘

┌─ SECURITY & COMPLIANCE ───────────┐
│ • SSL/TLS (data in transit)       │
│ • Encryption at rest              │
│ • KVKK compliance (data privacy)  │
│ • Blockchain (traceability)       │
│ • Access controls (role-based)    │
│                                   │
│ TARBIL Compliance:                │
│ ├─ Government data segregation    │
│ ├─ LPIS data access logging       │
│ ├─ Audit trail (KVKK required)    │
│ └─ Data residency (Turkey)        │
└───────────────────────────────────┘
```

---

## Part 3: Data Integration Specifications

### Integration Scenario 1: Satellite Data Flow

```
SATELLITE DATA FLOW (Weekly)

Copernicus ESA Sentinel-2
    │ (10m resolution, 5-day revisit)
    │ [Via Google Earth Engine API]
    ↓
IA ML Pipeline
    ├─ Cloud masking (remove cloud pixels)
    ├─ NDVI calculation ((NIR-RED)/(NIR+RED))
    ├─ Crop classification (ML model)
    ├─ Change detection (vs. week-prior)
    └─ Anomaly scoring (unusual patterns)
    ↓
Alert Generation Engine
    ├─ IF NDVI < threshold: "Water needed?"
    ├─ IF NDVI declining: "Investigate decline"
    ├─ IF crop stage → fertilizer timing
    └─ IF disease pattern (CNN): "Disease risk 60%"
    ↓
Farmer Notification
    ├─ "Sulamaya 3 gün kaldı" (SMS/App)
    ├─ "Fungal disease risk detected"
    └─ [Expert interpretation available]
    ↓
TARBIL Comparison (Reference)
    ├─ TARBIL satellite: SPOT 6/7 at 1.5m resolution
    ├─ IA satellite: Sentinel-2 at 10m resolution
    ├─ Difference: TARBIL higher resolution, IA more frequent
    ├─ Validation: Cross-check IA NDVI vs. TARBIL yields
    └─ Correlation: 85%+ agreement expected

Data Storage:
├─ PostgreSQL: Field-level statistics (mean NDVI per field)
├─ MongoDB: Time-series NDVI values (weekly points)
├─ Data Warehouse: Seasonal trends, farmer comparison
└─ Cache: Most recent NDVI (Redis, 5-day cache)
```

---

### Integration Scenario 2: TARBIL Historical Data Training

```
YIELD PREDICTION MODEL TRAINING

TARBIL Historical Database
    ├─ 14+ years of satellite yields
    ├─ Regional crop statistics
    ├─ Seasonal variation patterns
    └─ Damage assessments (frost, hail, drought)
    │
    ↓ [Data Request → M5-8 Negotiation]
    │
IA Data Science Team
    ├─ CSV export (TARBIL yields by parcel, year, crop)
    ├─ Data cleaning (outlier removal, validation)
    ├─ Feature engineering:
    │   ├─ NDVI trajectory (season start → harvest)
    │   ├─ Weather aggregate (rainfall, temp, GDD)
    │   ├─ Phenology stage progression
    │   ├─ Soil characteristics (from LPIS)
    │   └─ Regional averages (benchmark)
    └─ Train LSTM model:
        ├─ Input: Weekly NDVI + weather + phenology (90 days)
        ├─ Output: Final yield prediction (tons/hectare)
        ├─ Accuracy: 85%+ (TARBIL level)
        └─ Model refinement: Monthly with IA farmer outcomes
    │
    ↓ [Model Serving]
    │
IA Yield Prediction Service
    ├─ Weekly: "Your yield on track for X tons"
    ├─ Comparison: "Regional average Y tons"
    ├─ Confidence: "85% confident (calibrated on 10K+ fields)"
    └─ Trend: "Up 10% vs. last 3-year average"
    │
    ↓ [Feedback Loop]
    │
Farmer Outcome Data
    ├─ Actual harvested yield (farmer reported)
    ├─ Model error: (Predicted - Actual) / Actual
    ├─ Retraining data: Accumulate farmer outcomes
    └─ By Year 3: 1,500 farmers × 3 years = 4,500 validation points

Model Performance Tracking:
├─ TARBIL model: 85% accuracy (on TARBIL data)
├─ IA model Year 1: 70% accuracy (Sentinel + public data)
├─ IA model Year 2: 80% accuracy (+ farmer feedback)
├─ IA model Year 3: 85%+ accuracy (+ 4,500 validation points)
└─ Outcome: IA surpasses TARBIL accuracy through continuous learning
```

---

### Integration Scenario 3: LPIS Field Validation

```
LPIS FIELD BENCHMARKING (After Government Approval)

Farmer Registration
    ├─ "I farm 10 hectares of wheat"
    └─ "Location: 39.8°N, 35.2°E"
    │
    ↓ [Government Data Access]
    │
LPIS (Ministry Database)
    ├─ Query: Parcels within 500m of farmer location
    ├─ Returns: Parcel IDs, boundaries, registered crop type, owner name
    ├─ Validation: "Your farm matches LPIS parcel XYZ"
    └─ Confirmation: Farmer approves field mapping
    │
    ↓ [Benchmarking Enabled]
    │
Farmer Dashboard
    ├─ "Your wheat yield: 6.2 tons/ha"
    ├─ "Regional average (LPIS wheat, same district): 5.8 tons/ha"
    ├─ "Your performance: Top 20% in your region"
    ├─ "Subsidy opportunity: Water conservation program (50K TL grant)"
    └─ "[Based on TARBIL regional yields]"
    │
    ↓ [Subsidy Validation Support]
    │
Government (CAP Subsidy Audit)
    ├─ Ministry question: "Farmer claims 10ha wheat, did they actually plant wheat?"
    ├─ IA response: "Satellite data confirms wheat (NDVI pattern matches wheat signature)"
    ├─ Fraud detection: "Farmer declared wheat, satellite shows corn = Fraud alert"
    └─ Result: Ministry uses IA satellite validation for subsidy auditing

Data Flow:
├─ Farm location → LPIS query → Field boundaries
├─ Field boundaries → Sentinel satellite imagery
├─ Satellite imagery → Crop classification (CNN)
├─ Classification → Comparison with LPIS declared crop
├─ Mismatch → Fraud alert; Match → Approval
└─ All historical yields → Farmer benchmark comparison
```

---

## Part 4: Implementation Roadmap (Technical)

### M0-3: Foundation Phase

#### Data Integration Tasks

```
SATELLITE DATA PIPELINE:
[ ] Create Google Earth Engine account (free tier)
[ ] Authenticate ESA Copernicus Sentinel access
[ ] Write Sentinel-2 download script (weekly batch)
[ ] Implement cloud masking algorithm (remove clouds)
[ ] Calculate NDVI formula: (NIR - RED) / (NIR + RED)
[ ] Store NDVI results in MongoDB (time-series)
[ ] Validate accuracy: Compare Sentinel NDVI vs. known ground truth
├─ Acceptance criteria: ±10% accuracy (80%+ pixels within tolerance)
└─ Timeline: 4 weeks (M1-2)

WEATHER DATA INTEGRATION:
[ ] Contact TSMS for API access (official request)
[ ] Receive API credentials & documentation
[ ] Implement TSMS API client (real-time data pull)
[ ] Parse weather data (rainfall, temp, humidity, wind)
[ ] Validate weather data quality (range checks)
[ ] Store weather data in PostgreSQL (historical) + Redis (current)
[ ] Implement alert rules (frost, rainfall, high humidity)
├─ Acceptance criteria: >95% data availability, <2 hour latency
└─ Timeline: 3 weeks (M1-2)

LPIS REFERENCE DATA:
[ ] Document LPIS data access requirements (government forms)
[ ] Identify Ministry contact person (MFAL Data Department)
[ ] Prepare data-sharing proposal (CEO to sign)
[ ] Request pilot LPIS data for 1-2 pilot regions
├─ Note: Full access likely delayed; request pilot data instead
[ ] If granted: Import LPIS shapefiles into PostGIS
[ ] If denied: Plan manual field boundary collection (farmer-drawn)
├─ Acceptance criteria: Field boundaries validated with GPS
└─ Timeline: 4-8 weeks (M2-3), likely delayed to Phase 1

TARBIL CONTACT & EXPLORATION:
[ ] Identify TARBIL directorate (ITU, Center of Satellite Communication)
[ ] Document TARBIL data structure (what they have, what we need)
[ ] Prepare informal inquiry (not formal request yet)
[ ] Explore data access possibilities (discuss with director)
[ ] Understand TARBIL data licensing terms (free? Fee-based?)
├─ Note: Formal request → M5, but groundwork → M1-3
└─ Timeline: 2-3 weeks (M2-3)
```

#### Architecture Tasks

```
DATABASE SCHEMA:
[ ] Design PostgreSQL tables:
    ├─ fields (parcel data, LPIS mapping)
    ├─ satellite_observations (weekly NDVI per field)
    ├─ weather_observations (hourly data per weather station)
    ├─ alerts (generated recommendations)
    ├─ tarbil_reference (benchmark yields by crop/region)
    └─ benchmarks (farmer performance vs. regional)
[ ] Implement time-series storage (MongoDB collections)
[ ] Design Redis cache schema (real-time data)
[ ] Implement data retention policy (how long to keep data)
└─ Timeline: 2 weeks (M1)

API DESIGN:
[ ] Design REST API endpoints:
    ├─ GET /fields/{fieldId}/ndvi (satellite data)
    ├─ GET /weather/{location} (weather current)
    ├─ GET /alerts/{fieldId} (current alerts)
    ├─ GET /benchmarks/{fieldId} (regional comparison)
    └─ POST /farmer/outcomes (farmer result logging)
[ ] Implement API authentication (farmer, system)
[ ] Write API documentation
└─ Timeline: 2 weeks (M1-2)

ETL PIPELINE:
[ ] Design data pipeline (airflow DAG):
    ├─ Sentinel download (weekly trigger)
    ├─ Weather ingestion (hourly trigger)
    ├─ NDVI calculation (post-satellite processing)
    ├─ Alert generation (daily rule evaluation)
    └─ Model inference (yield prediction)
[ ] Implement error handling (retry logic, notifications)
[ ] Set up monitoring (pipeline health, data freshness)
└─ Timeline: 3 weeks (M1-3)
```

---

### M3-6: MVP Launch Phase

#### Model Development

```
NDVI-BASED ALERT RULES (MVP):
[ ] Define irrigation alert trigger:
    IF (NDVI < 0.60 AND soil_moisture < 40% AND no_rain_forecast_7days)
    THEN "Irrigate in 2-3 days"
[ ] Define disease risk alert:
    IF (humidity > 85% AND temp 15-25°C AND NDVI_increasing)
    THEN "Fungal disease risk HIGH, spray today"
[ ] Define frost alert:
    IF (forecast_min_temp < 2°C AND cloud_cover_low)
    THEN "Frost risk tonight, activate protection"
[ ] Test rules on historical TARBIL data (14 years)
    ├─ Validate accuracy (compare alerts vs. actual outcomes)
    ├─ Tune thresholds (sensitivity vs. specificity)
    └─ Acceptance: 80%+ alert accuracy
└─ Timeline: 4 weeks (M3-4)

SIMPLE YIELD PREDICTION (MVP):
[ ] Collect TARBIL historical yields (for reference)
[ ] Build simple regression model:
    Input: Peak NDVI + average rainfall + GDD (growing degree days)
    Output: Predicted yield (tons/ha)
[ ] Validate model: 75%+ accuracy (acceptable for MVP)
[ ] Deploy model to production (weekly yield forecast)
[ ] Farmer dashboard: "Your yield on track for X tons"
└─ Timeline: 3 weeks (M3-4)

SATELLITE DATA VALIDATION:
[ ] Compare Sentinel-2 NDVI vs. TARBIL SPOT data (where both available)
[ ] Calculate correlation: Expected 0.85+ agreement
[ ] Document differences (resolution, timing, cloud coverage)
[ ] Establish validation dataset (10-20 test fields, ground truth)
└─ Timeline: 2 weeks (M4-5)
```

#### Integration Tasks

```
TARBIL HISTORICAL DATA ACCESS:
[ ] Submit formal data-sharing proposal to ITU (M5)
[ ] Proposal includes:
    ├─ IA platform overview (what we're building)
    ├─ Data needs (yields, NDVI archives, phenology data)
    ├─ Use case (model training, farmer benchmarking)
    ├─ Benefit to TARBIL (farmer feedback data, validation dataset)
    └─ Timeline (M8 signature, M12 data delivery)
[ ] Negotiate terms (revenue share? Free access? Joint research?)
[ ] Pending approval (M8 target)
└─ Timeline: 4 weeks (M5-8 negotiation)

LPIS DATA INTEGRATION (IF APPROVED BY M6):
[ ] Receive LPIS data from Ministry
[ ] Import shapefile (field boundaries) into PostGIS
[ ] Match farmer fields to LPIS parcels (automated + manual)
[ ] Validate matches (accuracy, coverage)
[ ] Enable regional benchmarking (yield comparison)
└─ Timeline: 3 weeks (M5-6), if data received; else delayed to Phase 1

COOPERATIVE SENSOR PILOTS:
[ ] Identify 3-5 cooperatives (different regions)
[ ] Propose weather station investment (30K TL each)
[ ] Deploy weather stations (20 cooperatives × 5 = 100K TL budget)
[ ] Connect sensors to IA platform (data ingestion)
[ ] Validate sensor data (accuracy checks)
[ ] Generate hyperlocal alerts (cooperative + farmer-level)
└─ Timeline: 6 weeks (M4-6, field deployment M5-6)
```

---

### M6-12: Phase 1 Expansion

#### Advanced Model Development

```
SOIL MOISTURE (SENTINEL-1 SAR PROCESSING):
[ ] Implement SAR backscatter processing (radar data)
[ ] Retrieve historical Sentinel-1 (6-day revisit, all-weather)
[ ] Calibrate soil moisture estimation (algorithm tuning)
[ ] Validate against ground truth (cooperative sensors)
[ ] Integrate into irrigation recommendation (combine with NDVI)
[ ] Accuracy target: ±10% soil moisture estimation
└─ Timeline: 6 weeks (M8-10)

DISEASE DETECTION CNN (CNN Image Recognition):
[ ] Collect training dataset (if TARBIL data available):
    ├─ TARBIL historical satellite imagery (disease cases)
    ├─ Actual farmer reports (verified diseases)
    └─ 1,000+ training samples (minimum)
[ ] Train CNN model:
    ├─ Architecture: ResNet or similar (proven for satellite imagery)
    ├─ Input: Sentinel-2 satellite images + weather
    ├─ Output: Disease class (none, powdery mildew, leaf spot, rust, etc.)
    ├─ Accuracy target: 75%+ classification
    └─ Timeline: 8 weeks (M8-12)
[ ] Validate model on pilot farms
[ ] Deploy to production (disease risk alerts)

YIELD PREDICTION LSTM (Recurrent Neural Network):
[ ] Build LSTM model:
    ├─ Input: Weekly NDVI, weather, phenology (time-series, 90 weeks)
    ├─ Output: Final yield prediction
    ├─ Architecture: 2-layer LSTM + dense layers
    ├─ Loss function: MAPE (mean absolute percentage error)
    └─ Training data: TARBIL (14 years) + IA farmer data (1+ year)
[ ] Accuracy targets:
    ├─ Year 1: 75-80% accuracy
    ├─ Year 2: 80-85% accuracy
    └─ Year 3: 85%+ accuracy (approaching TARBIL)
[ ] Retrain monthly (add new farmer outcomes)
└─ Timeline: 10 weeks (M8-12, ongoing refinement)

MULTI-SENSOR FUSION:
[ ] Combine 5 data sources:
    ├─ Satellite NDVI (Sentinel-2)
    ├─ Soil moisture (Sentinel-1 + sensors)
    ├─ Weather (TSMS + stations)
    ├─ Phenology stage (calendar + GDD)
    ├─ Historical benchmark (TARBIL yields)
[ ] Ensemble method:
    ├─ Weighted average of multiple models
    ├─ Weights calibrated on farmer outcomes
    └─ Confidence scoring (alert reliability)
[ ] Accuracy: 85%+ (multi-sensor advantage)
└─ Timeline: 8 weeks (M9-12, ongoing refinement)
```

#### TARBIL Partnership Execution

```
IF TARBIL DATA-SHARING AGREEMENT SIGNED (M8):
[ ] Receive TARBIL historical yield data (CSV export or database)
[ ] Data structure:
    ├─ Parcel ID / Longitude / Latitude
    ├─ Crop type
    ├─ Year / Season
    ├─ Estimated yield (tons/ha)
    ├─ Confidence / Accuracy metric
    └─ Associated NDVI archive
[ ] Data cleaning:
    ├─ Remove outliers (yields > 150% of regional average)
    ├─ Validate geographic coverage (all regions represented)
    ├─ Check temporal coverage (full seasons, not partial)
    └─ Identify crop-specific patterns
[ ] Feature extraction for model training:
    ├─ NDVI trajectory (start → peak → harvest)
    ├─ Weather aggregate (seasonal rainfall, temperature sum)
    ├─ Phenology stage progression
    ├─ Regional/soil characteristics
    └─ Multi-year trend (yield stability)
[ ] Model retraining (M10-12):
    ├─ LSTM: Retrain on TARBIL + IA data
    ├─ Accuracy improvement: Expect +5-10% (validation on IA farmers)
    ├─ Regional models: Separate models per crop/region
    └─ Cross-validation: Hold-out test set
[ ] Outcome tracking:
    ├─ IA models surpass TARBIL accuracy (by Year 3)
    ├─ Share farmer feedback data back to TARBIL (partnership value)
    └─ Co-publish research paper (IA + ITU collaboration)
└─ Timeline: 6 weeks (M10-12, if data received M8)

IF TARBIL DATA DENIED:
[ ] Alternative model training:
    ├─ Use public satellite data (Sentinel archive: free)
    ├─ Use IA farmer outcomes (manual yield logging)
    ├─ Model accuracy slower to improve (no historical TARBIL data)
    ├─ Collect 500-1,000 farmer outcomes (Year 1-2)
    └─ Retrain models quarterly (continuous improvement)
[ ] Timeline: Same, but slower accuracy gains
```

---

## Part 5: Data Quality & Validation

### Satellite Data Validation

```
SENTINEL-2 NDVI VALIDATION CHECKLIST:

Cloud Detection:
├─ Pixel-level cloud probability > 20% → mask out
├─ Cloud shadow detection → mask out
├─ Snow detection → mask out
└─ Result: Clean pixels only

NDVI Calculation:
├─ Formula: NDVI = (NIR - RED) / (NIR + RED)
├─ Expected range: -1.0 to +1.0
├─ Crop NDVI range: 0.4 to 0.8 (healthy crop)
├─ Validation: Compare to TARBIL reference (±0.05 tolerance)
└─ Quality flag: Assign confidence score to each NDVI value

Spatial Validation:
├─ Geospatial accuracy: ±30m (Sentinel pixel size)
├─ Field-level aggregation: Mean NDVI per field
├─ Temporal consistency: NDVI smoothly increasing (phenology)
└─ Outlier detection: NDVI jumps > 0.1/week (anomaly alert)

Temporal Validation:
├─ Data gaps: Expected 5-day revisit (allow 10-day for clouds)
├─ Phenology progression: NDVI increases early season, decreases late
├─ Seasonal pattern: NDVI low at planting, peaks at flowering/grain fill
└─ Multi-year comparison: Similar phenology pattern across years
```

### Weather Data Validation

```
TSMS WEATHER DATA VALIDATION CHECKLIST:

Range Checks:
├─ Temperature: -40°C to +50°C (out-of-range = error)
├─ Humidity: 0% to 100% (impossible values = error)
├─ Rainfall: 0 to 500 mm/day (>500mm = likely error/flood)
├─ Wind speed: 0 to 50 m/s (>50 m/s = hurricane, rare)
└─ Pressure: 950 to 1050 hPa (extreme values = error)

Spatial Validation:
├─ Station coverage: Check geographic distribution
├─ Station density: Minimum 1 station per 100 km² (acceptance)
├─ Interpolation error: Weather grid accuracy ±5% (validation)
└─ Microclimate detection: Identify outlier stations (broken?)

Temporal Validation:
├─ Data freshness: <2 hour latency (real-time requirement)
├─ Missing data: <1% gaps (acceptable)
├─ Data continuity: No sudden jumps (e.g., temp +20°C/hour = error)
├─ Seasonal pattern: Temperature trends match expected climate
└─ Multi-year consistency: Similar seasonal pattern across years

Cross-Validation:
├─ Satellite vs. weather: High rainfall → NDVI stable (validation)
├─ Farmer report vs. weather: "It rained Tuesday" matches TSMS data
├─ Station redundancy: Multiple stations in region → agree with each other
└─ Third-party data: Compare TSMS vs. OpenWeatherMap (±10% acceptable)
```

### Model Validation

```
YIELD PREDICTION MODEL VALIDATION:

Accuracy Metrics:
├─ MAE (Mean Absolute Error): Average error in tons/ha
├─ RMSE (Root Mean Squared Error): Penalizes large errors
├─ MAPE (Mean Absolute Percentage Error): Relative error (%)
├─ R² (Coefficient of Determination): Explained variance (0-1)
└─ Target: 85%+ accuracy (TARBIL-level)

Cross-Validation:
├─ K-fold (5-fold): Train on 4 folds, test on 1 fold (repeat 5x)
├─ Time-series split: Train on past years, test on recent years
├─ Hold-out test: 20% of data reserved (not used in training)
└─ Expected: Consistent accuracy across folds (no overfitting)

Farmer Outcome Validation:
├─ Collect actual yields from farmers (harvest time)
├─ Compare predicted vs. actual yield (error analysis)
├─ Identify systematic bias (model over/under-predicts certain crops)
├─ Retrain models (farmer outcomes improve predictions)
└─ Continuous improvement cycle (monthly retraining)

Regional Validation:
├─ Separate models per crop/region (e.g., wheat in Anatolia vs. Aegean)
├─ Cross-region testing: Can model trained on one region predict another?
├─ Expected: Regional-specific models +5-10% more accurate
└─ Benchmark: Compare to TARBIL regional models
```

---

## Part 6: Data Security & Compliance

### KVKK Compliance (Turkish Data Protection)

```
PERSONAL DATA HANDLING:

Farmer Data Classification:
├─ High Sensitivity: Contact info (phone, email), location (GPS)
├─ Medium Sensitivity: Crop/yield data, farm practices
├─ Low Sensitivity: Regional benchmarks (aggregated)

Data Minimization:
├─ Collect only necessary data (name, location, crops)
├─ Don't retain historical locations after 2 years (unless farmer approves)
├─ Aggregate data (LPIS benchmarks anonymous: "Regional average = X tons")
└─ Purpose limitation: Use data only for platform services (not third-party)

Storage & Encryption:
├─ Sensitive data: Encrypted at rest (AES-256)
├─ Transit: SSL/TLS encrypted (all API calls)
├─ Access control: Role-based (farmer sees own data only)
├─ Audit trail: Log all data access (compliance requirement)
└─ Retention: Delete after farmer account closure (30-day grace period)

Third-Party Data Sharing:
├─ TARBIL partnership: Share aggregated farmer feedback (not PII)
├─ Government (subsidy validation): Only confirmed field data + satellite
├─ Experts: Share farm location/crop (not farmer identity details)
├─ Insurers: Aggregate statistics only (not individual data)
└─ Consent: Explicit opt-in required (farmer checkbox)
```

### Government Data Security

```
LPIS DATA HANDLING:

Government Data Classification:
├─ LPIS field boundaries: Potentially sensitive (landowner privacy)
├─ TARBIL yields: Public research data (less sensitive)
├─ Weather data (TSMS): Public (available to all)

Data Access Restrictions:
├─ Physical access: Separate database server (restricted access)
├─ Network access: VPN-only access to government data
├─ User access: Logged access by farmer ID (audit trail)
└─ Data export: Restricted (no bulk export to third parties)

Compliance Requirements:
├─ Formal data-sharing agreement (Ministry signature required)
├─ Data protection agreement (KVKK article 11)
├─ Audit provisions (Government can audit IA usage)
├─ Termination clause (if misuse detected, immediate data deletion)
└─ Reporting requirements (quarterly usage reports to Ministry)
```

---

## Summary: TARBIL-IA Integration Layers

| IA Layer | TARBIL Dependency | Integration Type | Data Flow | Status |
|----------|-------------------|------------------|-----------|--------|
| **Layer 1: UI** | Reference (display TARBIL maps) | Display | TARBIL data → farmer view | Planned |
| **Layer 2: FMIS** | Critical (satellite data input) | Processing | TARBIL outputs → IA recommendations | MVP |
| **Layer 3: Services** | Major (partnerships) | API | TARBIL/ITU ↔ IA (data-sharing) | Phase 1 |
| **Layer 4: Data** | Critical (historical training) | Database | TARBIL archives → IA models | Phase 1 |
| **Layer 5: ICT** | Supporting (infrastructure) | Infrastructure | TARBIL receiving station (reference model) | Phase 2 |

**Overall TARBIL Integration Level:** ⭐⭐⭐⭐⭐ (5/5 - Critical Success Factor)

IA Platform's success depends on successful TARBIL partnership and data integration, especially for:
1. Historical yield data (model training)
2. LPIS field validation (government integration)
3. Credibility (government endorsement)
4. Nationwide coverage (cooperative sensor network inspired by TARBIL scale)

---

**Document Status:** Technical Specification Ready for Implementation  
**Owner:** Chief Technology Officer  
**Last Updated:** August 2026
