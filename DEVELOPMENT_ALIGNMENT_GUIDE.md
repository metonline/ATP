# Development Alignment Guide
**Quick Reference for Feature & Architecture Decisions**

Use this checklist when you're about to make technical or product decisions. If your proposed work doesn't align with the foundation, escalate before implementing.

---

## Feature Decision Framework

### ✅ Before You Code

**Ask these 5 questions in order:**

1. **Does this feature support Sentinel-2 NDVI analysis + Turkish farmer's LPIS parcel?**
   - YES → ✅ Proceed. Core workflow aligned.
   - NO → Go to Q2.

2. **Does this feature support integrating government data (TKGM, LPIS, TARBIL, MEGSİS)?**
   - YES → ✅ Proceed. Government integration path aligned.
   - NO → Go to Q3.

3. **Does this feature improve farmer experience (mobile app, SMS, offline mode)?**
   - YES → ✅ Proceed. Product value aligned.
   - NO → Go to Q4.

4. **Does this feature reduce cost per farmer or improve SLA (cloud, caching, optimization)?**
   - YES → ✅ Proceed. Economics aligned.
   - NO → Go to Q5.

5. **Does this feature support scaling from 50→50,000 farmers or multi-region expansion?**
   - YES → ✅ Proceed. Infrastructure aligned.
   - NO → ⚠️ **ESCALATE.** This is likely out-of-scope. Discuss with product lead.

---

## Architecture Decision Framework

### Data Pipelines

✅ **ALIGNED:**
- Sentinel-2 as primary satellite source (free, 10m, 5-day revisit)
- Sentinel-1 SAR as complement (all-weather)
- Landsat-9 as fallback (cloud cover mitigation)
- TARBIL weather data (government precedent)
- LPIS parcel boundaries (from public WMS initially)

❌ **NOT ALIGNED:**
- Planet Labs or Maxar as primary (too expensive, locks in commercial dependency)
- Storing government ownership data locally (KVKK violation risk)
- Building custom cadastral database instead of integrating TKGM (duplicates work, legal risk)

### Cloud & Infrastructure

✅ **ALIGNED:**
- AWS/Azure multi-region (Kubernetes)
- PostgreSQL+PostGIS (geospatial database)
- GeoServer or similar (OGC WMS/WFS/WMTS)
- Serverless for batch satellite processing (Lambda/Cloud Functions)
- CDN for map tiles (performance at scale)
- 99.5% SLA target, multi-region failover

❌ **NOT ALIGNED:**
- Single-region deployment (doesn't scale, fails to meet SLA)
- Custom GIS database (use PostGIS, avoid reinventing)
- Proprietary data formats (use GeoJSON, GeoTIFF, open standards)
- Monolithic architecture (won't scale to 50K farmers, TARBIL integration)

### APIs & Integration

✅ **ALIGNED:**
- OGC WMS/WFS/WMTS for government data (standard, no licensing)
- RESTful APIs for parcel analysis (satellite NDVI, weather context, prescriptions)
- GeoJSON for spatial data (open, widely supported)
- Kafka or similar for government data feeds (real-time LPIS updates post-agreement)

❌ **NOT ALIGNED:**
- Building custom map format (use OGC standards)
- Direct database access to parcel data (use API layer, security/audit)
- Non-reversible vendor lock-in (avoid proprietary cloud services that don't export)

### Compliance & Data Governance

✅ **ALIGNED:**
- KVKK (Turkish Data Protection) compliance from day 1 (not retrofit)
- ISO/TC211 spatial data standards
- INSPIRE directive alignment
- Audit logs for data access (who accessed what parcel data, when)
- API lookups for government data (never cache ownership info)

❌ **NOT ALIGNED:**
- Storing farmer personal data without explicit consent (KVKK violation)
- Sharing parcel boundaries with 3rd parties without farmer permission
- Audit logs added in "phase 2" (implement from sprint 1)
- No documentation of data ownership / access policies

---

## Current Phase Alignment Matrix

### MVP Phase (Months 1-3)

**IN SCOPE:**
- [ ] Sentinel-2 ingestion pipeline (AWS Lambda/batch job)
- [ ] NDVI calculation (basic spectral indices)
- [ ] PostgreSQL+PostGIS parcel database (cached TKGM public WMS)
- [ ] Web + mobile map interface (Leaflet + React)
- [ ] Pilot with 1 cooperative (20-50 farmers)
- [ ] Government engagement kickoff meetings

**NOT IN SCOPE:**
- [ ] Government data sharing agreement (too early, do in Scale phase)
- [ ] Subsidy automation (wait for LPIS agreement)
- [ ] Multi-region cloud deployment (single region MVP okay)
- [ ] Sentinel-1 SAR integration (do in Scale phase)
- [ ] Advanced ML models (start with simple indices)

---

### Scale Phase (Months 4-6)

**IN SCOPE:**
- [ ] All 13 Sentinel-2 bands (vegetation, water, SWIR)
- [ ] TARBIL weather integration (temperature, precipitation, solar)
- [ ] Farmer feedback collection (ground-truth validation)
- [ ] Cloud infrastructure multi-region setup
- [ ] Government partnership negotiation active
- [ ] Mobile app refinement (offline mode, SMS)

**NOT IN SCOPE:**
- [ ] Subsidy eligibility checking (wait for LPIS agreement)
- [ ] Financial services layer (depends on government integration)
- [ ] 50K farmer scale (target 5-10 cooperatives)

---

### Government Integration Phase (Months 7-12)

**IN SCOPE (if agreement signed):**
- [ ] LPIS parcel + land-cover data feed
- [ ] Subsidy eligibility checker
- [ ] IACS compliance automation
- [ ] KVKK audit + certification
- [ ] Third-party API (B2B partners)

**NOT IN SCOPE:**
- [ ] Sentinel-1 SAR (do in Enterprise phase)
- [ ] Regional weather stations (do in Enterprise phase)
- [ ] Multi-country expansion (MVP is Turkey-only)

---

## Quick Reference: What Gets Escalated

**ESCALATE TO PRODUCT LEAD if:**
- Feature uses non-free satellite data as primary source
- Feature requires storing government data (ownership, tax info) locally
- Feature doesn't integrate with Sentinel-2 or government parcel data
- Feature requires regulatory exception or non-KVKK-compliant handling

**ESCALATE TO CTO if:**
- Architecture doesn't support PostgreSQL+PostGIS
- Design uses proprietary data formats instead of GeoJSON/GeoTIFF
- Infrastructure doesn't assume multi-region / cloud-native
- Performance design doesn't target <1s API response (Scale phase) or <500ms (Enterprise)

**ESCALATE TO LEGAL if:**
- Feature touches farmer personal data (email, phone, identity)
- Feature accesses government cadastral data (even public WMS)
- Data handling approach deviates from KVKK principles
- Anything involving data sharing with external parties

---

## Roadmap Check-In: Are We Aligned?

**After each 2-week sprint:**

- [ ] New code / features reference Sentinel-2 or government data integration
- [ ] API responses meet latency targets for current phase
- [ ] No features added that contradict MVP/Scale/Enterprise scope
- [ ] Government engagement on track (MVP kickoff → Scale negotiation → Gov Integration sign)
- [ ] KVKK / compliance debt = 0 (not deferred to later phase)
- [ ] Tech debt related to foundation = prioritized in next sprint

---

## Template: Feature Proposal

**Use this template when proposing new work:**

```
## Feature: [Name]

### Alignment Check
- [ ] Supports Sentinel-2 NDVI analysis
- [ ] Integrates with Turkish government data (TKGM/LPIS/TARBIL/MEGSİS)
- [ ] Improves farmer experience OR reduces cost/farmer OR enables scale
- [ ] Cloud-native, multi-region ready
- [ ] KVKK compliant

### Phase Fit
- Phase 1 (MVP) / Phase 2 (Scale) / Phase 3 (Gov Integration) / Phase 4 (Enterprise)?

### Reference Document
- Satellite integration report, Section X.Y
- Turkish government GIS report, Section A.B
- PROJECT_CHARTER.md Section C

### Risk Assessment
- Does this create vendor lock-in? No / Yes (escalate)
- Does this require government data locally? No / Yes (escalate)
- Does this block a future milestone? No / Yes (detail)

### Owner & Timeline
- Engineer lead:
- Product lead:
- ETA:
```

---

**Questions?** Reference `PROJECT_CHARTER.md` Section VIII for role-specific guidance.
