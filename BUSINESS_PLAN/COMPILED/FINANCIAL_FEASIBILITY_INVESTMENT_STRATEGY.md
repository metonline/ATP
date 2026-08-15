# Financial Feasibility & Investment Strategy
## Intelligent Agriculture (IA) Platform — Phase-by-Phase Financing & Operational Budget

**Version:** 1.0  
**Date:** August 2026  
**Document Focus:** Detailed investment requirements, funding strategy, and financial viability by implementation phase  
**Status:** Financial Planning Phase

---

## Executive Summary

**Platform viability depends on disciplined financial management across three implementation phases.** This document details:

1. **Phase-specific investment requirements** (not "big bang" capitalization)
2. **Make/Buy/Partner financial trade-offs** (cost vs. control vs. speed)
3. **Minimum team & operating budget** to reach milestones
4. **Go-to-market financing** (pilot, announcement, networking, customer acquisition)
5. **Technology scaling costs** (pay-as-you-go elasticity)
6. **Funding strategy & cash runway** (Series Seed sizing, burn rate, next round timing)
7. **Financial sensitivity analysis** (Best/Base/Worst scenarios)
8. **Break-even & profitability timeline** (by phase, by customer segment)

**Key Principle:** *Ship with minimum viable investment each phase, prove unit economics, then scale capital-efficiently.*

**Recommended Funding:** 
- **Series Seed (Phase 0-6):** 1.2-1.5M TL (MVP proof-of-concept)
- **Series A (Phase 6-18):** 2.5-3.5M TL (scale & market validation)
- **Total Year 1-2:** ~4.5M TL (equivalent to ~$1.5M USD)

---

## 1. Phase-by-Phase Investment Breakdown

### 1.1 MVP Phase (Months 0-6)

**Objective:** Prove concept with 20-50 farmers, validate core modules (Agro + Monitor + Market-Access), achieve initial break-even by Month 9.

#### Capex (Capital Expenditure - One-time)

| Category | Item | Cost | Purpose |
|----------|------|------|---------|
| **Development** | Platform architecture & MVP build | 400K TL | 4 FTE engineers, 6 months |
| | Mobile app (iOS/Android MVP) | 150K TL | React Native, offline sync, basic UI |
| | AI/ML pipeline (basic models) | 100K TL | Disease detection CNN, yield LSTM (simple v1) |
| | Database & data infrastructure | 80K TL | PostgreSQL, MongoDB, Redis, backups |
| **Infrastructure Setup** | AWS account provisioning | 30K TL | VPC, security, monitoring setup |
| | Satellite data integration (Sentinel Hub) | 25K TL | API integration, testing, proof-of-concept |
| | Office setup (shared space) | 40K TL | Desks, laptops, network, security |
| **Legal & Compliance** | Entity formation, tax setup | 25K TL | Company registration, KVKK audit prep |
| | Insurance & liability | 15K TL | Tech liability, D&O |
| **Pilot & Validation** | Dr. Koçak pilot program setup | 30K TL | Farmer recruitment, equipment, support |
| **Contingency** | Development buffer (15%) | 90K TL | Scope creep, unforeseen delays |
| | | | |
| **TOTAL CAPEX MVP** | | **985K TL** | **~$330K USD** |

#### Opex (Operating Expenditure - Recurring Monthly)

| Category | Role | Count | Monthly Cost | 6-Month Total |
|----------|------|-------|--------------|---------------|
| **Team Payroll** | Backend Engineer | 1 | 40K TL | 240K TL |
| | Frontend Engineer | 1 | 35K TL | 210K TL |
| | Mobile Developer | 1 | 35K TL | 210K TL |
| | ML/Data Scientist | 1 | 45K TL | 270K TL |
| | DevOps Engineer | 0.5 | 25K TL | 75K TL |
| | Product Manager | 0.5 | 20K TL | 60K TL |
| | Operations/Customer Support | 1 | 25K TL | 150K TL |
| | **Team Subtotal** | 5.5 | **225K TL** | **1.215M TL** |
| **Cloud Infrastructure** | AWS (EC2, RDS, Lambda, S3) | — | 30K TL | 180K TL |
| | CDN & data transfer | — | 5K TL | 30K TL |
| **AI/ML Compute** | SageMaker GPU instances (on-demand) | — | 15K TL | 90K TL |
| **Data Sources** | Satellite data (Copernicus/ESA - free tier) | — | 2K TL | 12K TL |
| | Weather data (TSMS, OpenWeatherMap) | — | 3K TL | 18K TL |
| **Third-party Services** | Payment processing (Stripe, local gateways) | — | 3K TL | 18K TL |
| | SMS/USSD (Twilio, local telcos) | — | 2K TL | 12K TL |
| | Monitoring & logging (DataDog) | — | 2K TL | 12K TL |
| **Office & Admin** | Shared office space, utilities | — | 10K TL | 60K TL |
| | Software licenses (GitHub, Slack, etc.) | — | 3K TL | 18K TL |
| | Legal & accounting | — | 5K TL | 30K TL |
| **Marketing & Pilot Support** | Announcement & PR | — | 10K TL | 60K TL |
| | Networking & business development | — | 5K TL | 30K TL |
| | Pilot farmer support & training | — | 8K TL | 48K TL |
| | | | | |
| **TOTAL OPEX (Monthly)** | | | **329K TL** | **1.974M TL** |

#### MVP Phase Total Investment

```
Capex:                   985K TL
Opex (6 months):       1.974M TL
───────────────────────────────
TOTAL MVP (M0-6):      2.959M TL (~$990K USD)

Funded by:
- Series Seed:        1.2-1.5M TL
- Founder/Friends:      0.5M TL
- Revenue (pilot):      0.3M TL (50 farmers × 6K TL subscription)
- Contingency buffer:   0.5M TL (saved, not spent)
```

---

### 1.2 Phase 1 (Months 6-12)

**Objective:** Scale to 100-300 farmers, launch Expert Marketplace & Livestock module, achieve profitability by Month 9-10, prepare Series A.

#### Capex (Incremental)

| Category | Item | Cost | Notes |
|----------|------|------|-------|
| **Development** | Expert Marketplace build | 150K TL | Consultant matching, ratings, payment |
| | FMIS.Livestock module | 120K TL | Wearable integration, veterinary AI |
| | Advanced AI models (CNN v2, LSTM v2) | 80K TL | Improved disease detection, yield prediction |
| | Blockchain integration (traceability) | 100K TL | Smart contracts, farmer-to-consumer QR |
| | Multi-cloud setup (Azure pilot) | 60K TL | Redundancy architecture, failover testing |
| **Infrastructure** | EU data center replication (DR) | 80K TL | AWS Frankfurt region, live replication |
| | Multi-cloud networking & security | 40K TL | VPN, load balancing, disaster recovery |
| **Compliance** | KVKK audit & certification | 50K TL | ISO 27001 prep, security review |
| | GDPR readiness (EU expansion prep) | 30K TL | Data handling, consent management |
| **Scaling** | Engineering team expansion | 80K TL | Hiring costs, onboarding, training |
| **Contingency** | Buffer (10%) | 87K TL | |
| | | | |
| **TOTAL CAPEX PHASE 1** | | **737K TL** | |

#### Opex (Incremental - Monthly)

| Category | Change | Monthly | 6-Month Total |
|----------|--------|---------|---------------|
| **Team Payroll** | +Senior Backend Engineer | +40K | +240K |
| | +Frontend Lead | +35K | +210K |
| | +QA Engineer | +30K | +180K |
| | +DevOps (full-time, was 0.5) | +25K | +75K |
| | +Customer Success Manager | +25K | +150K |
| | +BD/Partnerships Manager | +30K | +180K |
| | Existing team (5.5) | 225K | 1.215M |
| | **Team Subtotal (11 FTE)** | **450K TL** | **2.25M TL** |
| **Cloud Infrastructure** | Scale to 300 farmers | +50K | +300K |
| | Multi-region replication | +20K | +120K |
| **AI/ML Compute** | Advanced models (Livestock CNN) | +20K | +120K |
| **Data Sources** | LPIS integration, TARSIM partnership | +5K | +30K |
| **Expert Marketplace Ops** | Support for 50+ consultants | +15K | +90K |
| **Marketing & Go-to-Market** | Series A preparation | +20K | +120K |
| | Customer acquisition (referral, paid) | +15K | +90K |
| **Other** | Insurance, legal, compliance | +10K | +60K |
| | | | |
| **TOTAL OPEX PHASE 1 (Monthly)** | | **605K TL** | **3.15M TL** |

#### Phase 1 Total Investment

```
Capex (incremental):      737K TL
Opex (6 months):        3.15M TL
─────────────────────────────────
TOTAL PHASE 1 (M6-12):  3.887M TL (~$1.3M USD)

Funded by:
- Series A:             2.5-3M TL
- Retained earnings:      0.5M TL
- Revenue (100-200 farmers): 1.5M TL
```

**Break-even Target:** Month 9-10 of Phase 1 (total platform operation, not just MVP)

---

### 1.3 Phase 2 (Months 12-18)

**Objective:** Complete 6-module platform, reach 500+ farmers, optimize profitability, plan national scale.

#### Capex (Incremental)

| Category | Item | Cost |
|----------|------|------|
| **Development** | FMIS.Equipment P2P marketplace | 100K TL |
| | Advanced features (disease detection v3, blockchain enterprise) | 80K TL |
| | B2C portal & consumer app | 70K TL |
| **Infrastructure** | Middle East data center (optional regional) | 100K TL |
| | Security hardening & penetration testing | 60K TL |
| **Scaling** | Engineering & ops team expansion | 120K TL |
| **Contingency** | Buffer (10%) | 53K TL |
| | | |
| **TOTAL CAPEX PHASE 2** | | **583K TL** |

#### Opex (Incremental - Monthly)

| Category | Monthly | 6-Month Total |
|----------|---------|---------------|
| **Team (from 11 → 15 FTE)** | +120K | +720K |
| **Cloud Infrastructure** | +40K (500 farmers) | +240K |
| **AI/ML Compute** | +15K | +90K |
| **B2B/B2C Operations** | +25K | +150K |
| **Marketing & Growth** | +20K | +120K |
| **Other** | +10K | +60K |
| | | |
| **Incremental Opex** | **230K TL** | **1.38M TL** |
| **Total Opex (15 FTE)** | **835K TL** | **5.01M TL** |

#### Phase 2 Total Investment

```
Capex (incremental):      583K TL
Opex (6 months):        1.38M TL
─────────────────────────────────
TOTAL PHASE 2 (M12-18): 1.963M TL (~$655K USD)

Funded by:
- Retained earnings:      1.5M TL
- Revenue (400+ farmers): 3.5M TL
- Operating margin becoming positive
```

---

### 1.4 Cumulative Investment Summary (M0-18)

```
                    MVP Phase 1  Phase 1         Phase 2         TOTAL
                    (M0-6)       (M6-12)         (M12-18)        (M0-18)
─────────────────────────────────────────────────────────────────────────
Capex               985K         737K            583K            2.305M
Opex (6 months)     1.974M       3.15M           1.38M           6.504M
─────────────────────────────────────────────────────────────────────────
TOTAL               2.959M       3.887M          1.963M          8.809M TL
                    (~$990K)     (~$1.3M)        (~$655K)        (~$2.94M USD)

Cumulative:
After MVP:          2.959M (funded: Seed)
After Phase 1:      6.846M (funded: Seed + Series A + revenue)
After Phase 2:      8.809M (funded: Series A + retained earnings)
```

---

## 2. Make vs. Buy vs. Partner: Financial Impact

### 2.1 Core Decision Matrix

| Component | Make | Buy/SaaS | Partner | **Recommendation** | **Cost Impact** |
|-----------|------|----------|---------|-------------------|-----------------|
| **Farmer Portal** | ✓ | AWS Amplify | — | **Make** | In-house = 150K capex + 40K/mo opex |
| **6 FMIS Modules** | ✓ | Salesforce Agri | — | **Make** | In-house differentiator, 300K capex |
| **AI Models** | ✓ | Google Cloud AI | SageMaker | **Make + SageMaker** | Custom training = 100K capex, 15-20K/mo compute |
| **Satellite Data** | ✗ | Google Earth Engine | **ESA Copernicus** | **Partner (ESA)** | FREE (vs. $200K/yr GEE) = **$200K/yr savings** |
| **Weather API** | ✗ | OpenWeatherMap | **TSMS + Universities** | **Partner (TSMS)** | $3K/mo (vs. $10K OpenWeatherMap) = **$84K/yr savings** |
| **Cloud Infrastructure** | ✗ | **AWS + Azure** | — | **Buy (AWS+Azure)** | $30-50K/mo (multi-cloud redundancy) |
| **Payment Processing** | ✗ | **Stripe + local** | — | **Buy (Stripe)** | 2.9% transaction fee (~18K/yr initial) |
| **IoT Sensor Integration** | ✓ | Pre-built platforms | — | **Make** | Middleware = 50K capex (hardware agnostic) |
| **Expert Marketplace** | ✓ | Third-party platform | — | **Make** | Strategic moat = 150K capex |
| **Blockchain Traceability** | ✗ | Hyperledger / Ethereum | — | **Buy** | Integration only = 100K capex, 5K/mo maintenance |

### 2.2 Financial Scenarios: Make vs. Buy

**Scenario A: Copernicus-First (RECOMMENDED)**

```
Year 1 Satellite Cost:
├─ Sentinel Hub API (free tier):     $0 (1M requests/month)
├─ ESA partnership overhead:         $0 (collaborative)
└─ Total:                            $0

vs. Google Earth Engine Only:
├─ GEE revenue share (0.3% of 2.4M revenue): $7.2K
├─ Premium indices add-on:                    $0 (included)
└─ Total:                                     $7.2K (Year 1)

Year 2+ Satellite Cost (500 farmers):
├─ Sentinel Hub (free, 1M requests):  $0
├─ Google EE optional premium:        $19.2K (0.3% of 6.4M)
└─ Total:                             $19.2K/year

SAVINGS: $100K+ over 3 years by prioritizing free Copernicus + optional GEE
```

**Scenario B: Cloud Infrastructure**

```
Make (In-house servers, Turkey data center):
├─ Capex:        $50K (servers, cooling, security)
├─ Opex Year 1:  $24K (maintenance, power, staff)
├─ Opex Year 2:  $30K (increased capacity)
└─ 5-year TCO:   $200K+ (plus management overhead)

Buy (AWS + Azure multi-cloud):
├─ Capex:        $0 (on-demand)
├─ Opex Year 1:  $150K (30K/mo EC2 + storage + bandwidth)
├─ Opex Year 2:  $240K (scale to 500 farmers)
├─ Multi-cloud overhead: +15% (redundancy, complexity)
└─ 5-year TCO:   $1.2M (but includes 99.9% SLA, auto-scaling, DR)

RECOMMENDATION: Buy (AWS+Azure)
- Rationale: Speed to market, scalability, no fixed asset risk
- Trade-off: Higher opex, but lower management complexity
- Risk mitigation: Multi-cloud = vendor independence
```

**Scenario C: Expert Marketplace**

```
Make (In-house platform):
├─ Capex:        $150K (15% commission logic, ratings, payments)
├─ Opex Year 1:  $15K (moderation, support)
├─ 50 experts × 10 consultations/month × 500 TL × 15%: $37.5K/month revenue
└─ Breakeven:    Month 5 (capex + opex covered)

Buy (Third-party like Upwork):
├─ Capex:        $0 (integration only, 20K)
├─ Platform fee:  30% commission (vs. 15% in-house)
├─ Same 50 experts: Only keep 70% of revenue (fee structure)
├─ Revenue impact: $37.5K → $26.25K (11K month difference)
└─ TCO Year 1:   $50K capex + $48K lower revenue = $98K opportunity loss

RECOMMENDATION: Make (In-house)
- Rationale: Strategic moat, defensible unit economics
- Network effects = competitive advantage
```

---

## 3. Minimum Team & Operating Budget

### 3.1 MVP Phase (M0-6) - Minimum Viable Team

**Objective:** Build, launch, validate with 20-50 farmers.

| Role | Count | Salary | Rationale |
|------|-------|--------|-----------|
| **Backend Engineer** | 1 | 40K TL/mo | Core APIs, data pipeline, integrations |
| **Frontend Engineer** | 1 | 35K TL/mo | Farmer portal (web) |
| **Mobile Developer** | 1 | 35K TL/mo | React Native iOS/Android |
| **ML/Data Scientist** | 1 | 45K TL/mo | Satellite processing, CNN/LSTM models |
| **DevOps/Infra** | 0.5 | 25K TL/mo | AWS setup, CI/CD, security (part-time or contractor) |
| **Product/Operations** | 0.5 | 20K TL/mo | Roadmap, customer support, metrics (founder+split) |
| | | | |
| **TOTAL** | **5 FTE** | **225K TL/mo** | **$75K/mo (~$900K/6mo)** |

**Note:** Founder (CEO) covers strategy, fundraising, partnerships (not counted as salary cost).

### 3.2 Phase 1 (M6-12) - Scale Team

**Objective:** Scale to 100-300 farmers, launch marketplace + Livestock.

| Role | Count | Notes |
|------|-------|-------|
| **Engineering** | +1.5 | Senior Backend (architect) + Frontend Lead + QA |
| **ML/Data** | +0.5 | Advanced models, livestock CNN training |
| **DevOps** | +0.5 | Full-time (from 0.5), multi-cloud management |
| **Customer Success** | +1 | Pilot farmer support, onboarding, retention |
| **Business Development** | +1 | Partnerships, B2B relationships, Series A prep |
| | | |
| **New Total** | **11 FTE** | **450K TL/mo** |

### 3.3 Phase 2 (M12-18) - Full Platform

| Role | Count | Notes |
|------|-------|-------|
| **Engineering** | +1.5 | Equipment marketplace, B2C portal, security hardening |
| **Ops/Admin** | +1 | Finance, HR, compliance, accounting |
| **Marketing** | +1 | Growth, customer education, brand |
| | | |
| **New Total** | **15 FTE** | **835K TL/mo** |

### 3.4 Year 1 Operating Budget Detail (M0-12)

```
TEAM PAYROLL:
MVP (M0-6):         1.215M TL
Phase 1 (M6-12):    2.25M TL
Subtotal:           3.465M TL (average 5.5→11 FTE)

INFRASTRUCTURE & OPERATIONS:
Cloud (AWS):        510K TL (85K × 6 months)
AI/ML Compute:      210K TL (35K × 6 months)
Data sources:       60K TL
Third-party SaaS:   120K TL

PILOT & GO-TO-MARKET:
Announcement/PR:    90K TL
Networking & BD:    60K TL
Pilot support:      96K TL
Customer acquisition: 50K TL

ADMIN & OVERHEAD:
Office/utilities:   120K TL
Legal/accounting:   90K TL
Insurance:          45K TL
Software licenses:  54K TL

───────────────────────────────
TOTAL YEAR 1 OPEX:  4.944M TL (~$1.65M USD)
TOTAL CAPEX:        985K TL
TOTAL YEAR 1:       5.929M TL (~$2M USD)

Funded by Series Seed (1.2-1.5M) + Series A (2.5-3M) + early revenue (0.5M)
```

---

## 4. Go-to-Market & Customer Acquisition Financing

### 4.1 Customer Acquisition Strategy & Budget

| Channel | Phase | Target Farmers | CAC | Total Cost | Rationale |
|---------|-------|-----------------|-----|-----------|-----------|
| **Direct (Dr. Koçak referral)** | MVP | 20 | 500 TL | 10K TL | Pilot credibility, no marketing spend |
| **Expert referral network** | Phase 1 | 50 | 1K TL | 50K TL | 300+ consultants, word-of-mouth |
| **B2B partnerships** | Phase 1 | 30 | 2K TL | 60K TL | Food companies, cooperative marketing |
| **Paid channels (Facebook/Google)** | Phase 1-2 | 50 | 3K TL | 150K TL | Targeted ads to progressive farmers |
| **Events & farmer associations** | Phase 1-2 | 40 | 2.5K TL | 100K TL | Agricultural conferences, trade shows |
| | | | | |
| **TOTAL Year 1-2** | — | **190** | **Blended 1.5K** | **370K TL** |

### 4.2 Announcement & Market Positioning (M0-3)

| Activity | Cost | Timeline | Purpose |
|----------|------|----------|---------|
| **PR & Press Release** | 20K TL | M1 | National media coverage, credibility |
| **Launch event (Istanbul)** | 30K TL | M1 | Investor relations, media, experts |
| **Website & marketing collateral** | 25K TL | M0-1 | Professional online presence |
| **Pitch deck & investor docs** | 10K TL | M0 | Series Seed preparation |
| **LinkedIn/Social strategy** | 5K TL | Ongoing | Organic reach, thought leadership |
| **Expert network recruitment** | 20K TL | M2-6 | Partnerships, network building |
| | | | |
| **TOTAL Announcement Phase** | **110K TL** | — | — |

### 4.3 Pilot Program Support (M0-6)

| Item | Cost | Notes |
|------|------|-------|
| **Farmer recruitment & training** | 30K TL | 20-50 farmers, onboarding, support calls |
| **Incentives (first 3 months free)** | 50K TL | Revenue impact, but locks in early adopters |
| **Field visits & support trips** | 15K TL | Dr. Koçak + team, 1x/month to regions |
| **Feedback collection & iteration** | 10K TL | Surveys, focus groups, product refinement |
| | | |
| **TOTAL Pilot Support** | **105K TL** | — |

---

## 5. Technology Scaling: Pay-as-You-Go Cost Curves

### 5.1 Cloud Infrastructure Elasticity

```
Farmer Count    Monthly AWS Cost    Per-Farmer Cost    Notes
─────────────────────────────────────────────────────────────
10              10K TL              1,000 TL           MVP minimum
50              25K TL              500 TL             Pre-pilot
100             40K TL              400 TL             Break-even target
300             90K TL              300 TL             Phase 1 target
500             130K TL             260 TL             Full platform
1000            200K TL             200 TL             National scale (Year 3)
```

**Key:** Cloud costs scale sublinearly (fixed overhead amortized)

### 5.2 AI/ML Compute on Demand

```
Model Type              Monthly Cost     Usage Pattern
────────────────────────────────────────────────────────
Basic NDVI (SageMaker)  5K TL           Weekly processing
Disease CNN inference   8K TL           On-demand when farmer uploads
Yield prediction LSTM   5K TL           Monthly forecasting
Batch training (v2)     10K TL          Monthly model improvement
────────────────────────────────────────────────────────
Total Phase 1 (100 farmers): 15-20K TL/month (spot instances = -70% discount)
Total Phase 2 (500 farmers): 25-30K TL/month (still elastic, no fixed cost)
```

### 5.3 SaaS vs. In-House Cost Curve

```
Years    In-House Server    AWS SaaS       Break-Even
──────────────────────────────────────────────────────
Y1       50K capex + 24K    0 capex + 150K  AWS (more capex flexibility)
Y2       0 capex + 30K      0 capex + 200K  AWS (scales automatically)
Y3       0 capex + 40K      0 capex + 280K  AWS (but proven SLA)
Y5       0 capex + 50K      0 capex + 400K  In-house (if 1000+ users, consider own infra)

RECOMMENDATION YEAR 1-3: AWS SaaS
- Rationale: No fixed capex, scales elastically, 99.9% SLA included
- Risk: Monthly bills grow with users (but revenue grows faster)
- Mitigation: Reserved instances after Phase 1 (20% discount)
```

---

## 6. Funding Strategy & Cash Runway

### 6.1 Series Seed (M0-6): Proof-of-Concept

**Ask:** 1.2-1.5M TL (~$400-500K USD)

**Use of Funds:**
```
Platform development (MVP):     400K TL  (34%)
Team payroll (5 FTE × 6mo):   1.215M TL (Paid from opex budget)
Infrastructure & operations:     330K TL  (27%)
Pilot & go-to-market:            100K TL  (8%)
Contingency reserve:             200K TL  (17%)
─────────────────────────────────────────
TOTAL:                         1.245M TL
```

**Success Metrics (M6 Gate):**
- ✓ MVP platform live (3 modules stable)
- ✓ 20-50 farmers using platform, >70% monthly active
- ✓ Initial revenue: 300K TL (50 farmers × 6K annual subscription, 50% adoption)
- ✓ Unit economics validated: CAC 1.5K TL, LTV 50K+ TL (proof of concept)
- ✓ Pilot cohort net positive sentiment (>4/5 rating from Dr. Koçak's network)

**Next Round:** Series A if metrics hit; otherwise raise bridge ($200-300K) to extend runway.

---

### 6.2 Series A (M6-18): Market Validation & Scale

**Ask:** 2.5-3.5M TL (~$850K-1.2M USD)

**Use of Funds:**
```
Product expansion (Phase 1+2 modules): 1.2M TL  (35%)
Team scaling (5→15 FTE):               1.8M TL  (51%)
Marketing & customer acquisition:      0.3M TL  (8%)
Infrastructure & operations scaling:   0.2M TL  (6%)
─────────────────────────────────────────────────
TOTAL:                                 3.5M TL
```

**Success Metrics (M18 Gate):**
- ✓ 500+ farmers paying (LTV validated across segments)
- ✓ Platform profitability achieved (Opex covered by revenue by Month 15-16)
- ✓ Expert Marketplace scaled (50+ consultants, 100+ reviews, organic referrals)
- ✓ B2B partnerships signed (2-3 food companies)
- ✓ Series A return potential visible (path to 50M+ TL valuation by Year 5)

**Next Round:** Series B ($1-2M) if reaching 1000+ farmers by Year 3.

---

### 6.3 Burn Rate & Cash Runway

```
YEAR 1 (Months 0-12)
─────────────────────
Monthly avg expenses:     ~410K TL  (MVP 330K + Phase 1 ramp 500K, averaged)
Monthly avg revenue:      ~200K TL  (pilot 50K + Phase 1 growth 200K+)
Monthly burn:              -210K TL  (deficit, funded by Series A)

Cash runway from funding:
├─ Series Seed (1.2M):     5.7 months (at MVP burn rate)
├─ Series A (3M):          14 months  (at Phase 1 burn rate)
├─ Retained earnings:      +0.5M by M12
└─ Total runway:           ~18 months (sufficient for full 18-month plan)

YEAR 2 (Months 13-24)
──────────────────────
Monthly avg expenses:      ~650K TL  (Phase 1-2 ramp)
Monthly avg revenue:       ~1.2M TL  (100-500 farmers × 6K, diversified)
Monthly profit:            +550K TL  (CASH FLOW POSITIVE)

Cumulative position:
├─ After Series A:         -0.5M (net spent)
├─ Year 1 end:             0.2M (break-even + small buffer)
├─ Year 2 (12 months):     +6.6M (profit accumulation)
└─ Cumulative Year 2 end:  +6.8M (self-sustaining, no Series C needed)
```

---

## 7. Financial Sensitivity Analysis

### 7.1 Best Case Scenario

**Assumptions:**
- CAC drops to 1K TL (strong word-of-mouth, referral dominance)
- Churn 2%/month (farmers sticky, high satisfaction)
- Adoption 5% accelerated (farming community embrace)
- Enterprise B2B adds 0.5M revenue/year by Month 12

**Impact:**

```
                    Base Case    Best Case    Difference
─────────────────────────────────────────────────────────
Break-even month:   Month 9      Month 7      -2 months
Year 2 revenue:     6.4M         8.5M         +2.1M
Year 2 profit:      2.3M         4.2M         +1.9M
Series A need:      3M           1.5M         -1.5M (50% less capital)

Implication: With strong product-market fit, can fund later growth from cash flow
```

### 7.2 Base Case Scenario (Plan)

```
Assumptions embedded in plan:
- CAC: Blended 1.5K TL (referral + paid channels)
- Churn: 3% monthly (acceptable, industry avg 2-5%)
- Adoption: Realistic 3% Year 1, 12% cumulative by Year 3
- Unit economics validated in pilot

Results:
- Break-even: Month 9 (as projected)
- Series A funding: 3M TL (as requested)
- Year 2 profitability: +2.3M TL (sustainable)
- Runway: 18 months (covers full implementation)
```

### 7.3 Worst Case Scenario

**Assumptions:**
- CAC inflates to 2.5K TL (expensive paid channels, low referral)
- Churn 5%/month (product-market fit issues)
- Adoption 1% Year 1 (slow, skeptical market)
- Dr. Koçak partnership delays 6 months

**Impact:**

```
                    Base Case    Worst Case   Difference
──────────────────────────────────────────────────────────
Break-even month:   Month 9      Month 14     +5 months
Year 1 loss:        -300K        -800K        -500K worse
Series A need:      3M           4.5M         +1.5M (50% more capital)
Series A burn rate: 14 months    10 months    -30% runway shorter

Mitigation:
├─ CAC reduction: Shift to organic/referral channels (lower cost)
├─ Product pivots: Focus on high-retention segments
├─ Extended pilot: Test-and-learn before Series A
└─ Contingency reserve: 15% of seed kept for extension
```

---

## 8. Break-Even & ROI Timeline

### 8.1 Break-Even Analysis (Unit & Platform Level)

#### Unit Economics (Per Farmer, Year 1)

```
Annual Revenue per Farmer:        21.9K TL
├─ Premium subscription (6K × 12):  6K TL
├─ Expert referral (avg 1.5K):      1.5K TL
├─ B2B commission (avg 14.4K):     14.4K TL
└─ Other (B2C, equipment):            0 (minimal Year 1)

Annual COGS per Farmer:             1.938K TL
├─ Hosting & cloud:                 0.5K TL
├─ Support staff:                   1K TL
└─ Payment processing:              0.438K TL

Gross Profit per Farmer:           19.962K TL (91% margin)

CAC (Customer Acquisition):        1.5K TL (blended)
CAC Payback Period:                1-1.5 months (19.962K annual ÷ 12 ÷ 1.5K CAC)

LTV (Lifetime Value, 3-year):      ~60K TL (assuming <10% annual churn)
LTV/CAC Ratio:                     40:1 (excellent; benchmark >3:1)

Unit Breakeven:                    Month 1-2 per farmer (each farmer is profitable immediately)
```

#### Platform Break-Even (Total Operation, M0-18)

```
                    MVP (M0-6)    Phase 1 (M6-12)    Phase 2 (M12-18)
─────────────────────────────────────────────────────────────────────
Farmers             50            200                500
Revenue             300K          2.2M               3M (partial)
Opex (6mo)          1.974M        3.15M              1.38M
Cumulative loss:    -1.674M       -2.624M            -1.004M
Cumulative revenue: 300K           2.5M              5.5M
Cash flow status:   NEGATIVE       NEGATIVE          APPROACHING POSITIVE

Platform breakeven: Month 15-16 (by end of Phase 1, cumulative revenue covers cumulative opex + capex)

Year 2 onward: 
├─ Revenue 6.4M (growing 500→1500 farmers)
├─ Opex 3M (scaled infrastructure)
├─ Profit: +3.4M TL
└─ Operating margin: 53% (SaaS-like scale)
```

### 8.2 ROI & Investor Return Scenarios

**Assumption:** Series Seed: 1.2M TL; Series A: 3M TL; Total: 4.2M TL

```
Exit Scenario                      Year 5 Valuation    Multiple    Investor Return
───────────────────────────────────────────────────────────────────────────────────
Acquired by agroinput company      50M TL              3x revenue  1000x on seed
IPO (unlikely but possible)        100M+ TL            6x revenue  2000x+ on seed
Stable cash-flowing business       80M TL valuation    4.5x revenue 1500x on seed
Conservative exit (lower growth)   30M TL              2x revenue  600x on seed

Base case assumption: 80-100M TL exit (Yıl 5-7), implying:
├─ 1500-2000 farmers
├─ 30-50M TL annual revenue (by Year 5)
├─ 15-20M TL EBITDA (40-50% margin at scale)
└─ Return to Series A: ~10-15x; to Series Seed: ~50-80x
```

---

## 9. Risk Scenarios & Contingency Planning

### 9.1 Partnership Delays (ESA, LPIS, TARSIM)

**Risk:** Government approvals, data access delays could push satellite integration back 3-6 months.

**Financial Impact:**

```
Risk Scenario:       Satellite data integration delays 4 months (impacts Phase 1)
Cost Impact:         +200K TL (extended team costs for alternative development)
Timeline Impact:     Break-even pushed from M9 to M12 (3-month delay)
Contingency plan:    
├─ Use commercial satellite (Planet) interim (-100K margin Year 1, +budget)
├─ Extended seed round bridge: +300K TL
└─ Series A timing pushed Q2 2025 → Q3 2025
```

### 9.2 CAC Inflation (Paid Channels Underperform)

**Risk:** Farmer acquisition via paid channels (Facebook, Google) costs more than 3K TL per farmer.

**Financial Impact:**

```
Risk Scenario:       CAC blended 2.5K TL (vs. 1.5K target)
Cost Impact:         +250K annually on acquisition (1000 extra farmers by Year 2)
Break-even impact:   Month 9 → Month 11 (2-month delay)
Contingency:
├─ Shift budget to referral programs (lower CAC, but slower)
├─ Increase expert partnerships (organic, low-cost channels)
├─ Negotiate B2B partnership co-marketing (shared acquisition cost)
└─ Reserve extra 300K from seed for extended customer acquisition
```

### 9.3 Churn Increase (Product-Market Fit Issues)

**Risk:** Farmer retention drops below 95% (implies >5% monthly churn).

**Financial Impact:**

```
Risk Scenario:       5% monthly churn (vs. 3% target)
Implication:         LTV drops 40% (from 60K → 36K), LTV/CAC ratio 24:1 (still healthy)
Revenue impact:      Year 2 revenue -1.2M TL (fewer retained farmers)
Contingency:
├─ Product pivot: Focus on highest-retention segments (dairy farmers, high-value crops)
├─ Increase expert support (personalized onboarding, reduce time-to-value)
├─ Create stickiness features (e.g., AI recommendation accuracy improves over 3 months)
└─ Extend Series A: Request +1M TL buffer if churn >4%
```

---

## 10. Detailed Investment Recommendations

### 10.1 Series Seed Investment Structure

**Requested Amount:** 1.2-1.5M TL  
**Suggested Use of Funds:**

| Category | Amount | % | Deployment |
|----------|--------|---|------------|
| Development & Product | 400K | 32% | MVP build (Months 0-4) |
| Team & Payroll | 400K | 32% | 5 FTE × 6 months (contingency on core hires) |
| Infrastructure & Tech | 200K | 16% | Cloud, data, security, integrations |
| Go-to-Market & Pilot | 100K | 8% | Announcement, pilot support, initial CAC |
| Contingency Buffer | 150K | 12% | Schedule overruns, scope creep, scaling |
| **TOTAL** | **1.25M** | **100%** | — |

**Investment Terms (Typical for AgTech Pre-Seed):**
- **Instrument:** SAFE or convertible note (easier than full equity for seed)
- **Valuation cap:** 8-12M TL (implies 10-15% dilution)
- **Conversion:** On Series A at 20% discount
- **Board seat:** Optional (depends on investor size)
- **Milestones for follow-on:** Series A contingent on M6 gate metrics

---

### 10.2 Series A Investment Structure

**Requested Amount:** 2.5-3.5M TL  
**Gate for Investment:** Must hit M6 MVP metrics (see Section 6.1)

**Suggested Use of Funds:**

| Category | Amount | Deployment |
|----------|--------|------------|
| Product (Phase 1+2 modules) | 1.2M | Marketplace, Livestock, Blockchain (M6-18) |
| Team expansion (5→15 FTE) | 1.8M | Senior engineers, customer success, BD |
| Go-to-Market (Series A phase) | 0.3M | B2B partnerships, events, content marketing |
| Infrastructure & scaling | 0.2M | Multi-cloud, compliance, security hardening |
| **TOTAL** | **3.5M** | — |

**Series A Terms (Standard for validated AgTech):**
- **Instrument:** Preferred equity (Series A priced round)
- **Valuation:** 18-25M TL (post-money; implies 15-18% Series A dilution)
- **Board representation:** 1 investor seat
- **Pro-rata rights:** Follow-on funding in Series B
- **Anti-dilution:** Weighted average (standard)
- **Liquidation preference:** 1x non-participating preferred

---

## 11. Operational Metrics & Monitoring

### 11.1 Key Financial Metrics (Monthly Dashboard)

| Metric | Target (MVP) | Target (Phase 1) | Threshold |
|--------|--------------|------------------|-----------|
| **Revenue** | Ramp 50→300K | Ramp 300K→1.2M | < 10K/mo = red flag |
| **CAC** | 1.5K TL | 1.2K TL | > 2.5K = review channels |
| **LTV/CAC** | > 35x | > 40x | < 20x = sustainability risk |
| **Monthly churn** | < 3% | < 3% | > 5% = pause growth |
| **Gross Margin** | > 85% | > 88% | < 80% = cost issue |
| **Opex/Revenue** | 5-6x (burn) | 2-3x | > 8x = unsustainable |
| **Cash runway** | > 3 months | > 6 months | < 2 months = raise signal |
| **Team utilization** | > 80% | > 85% | < 70% = overhiring |

### 11.2 Quarterly Review Checkpoints

**M3 Review:** 
- Platform stability (99%+ uptime?)
- Pilot farmer satisfaction (>4/5?)
- CAC realization (tracking to 1.5K?)
- Run rate revenue ($50K/month?)
- **Gate decision:** Continue MVP or pivot?

**M6 Review (Series A Gate):**
- 50 farmers, >70% active, >4/5 satisfaction
- Initial LTV validation (CAC payback <2 months)
- Revenue $300K+ run rate
- Unit economics profitability evident
- **Gate decision:** Proceed to Series A or extend seed?

**M12 Review (Phase 1 Midpoint):**
- 200+ farmers, 50%+ retention (from M6 cohort)
- Revenue $1M+ run rate
- Expert Marketplace live with 30+ consultants
- Approaching break-even (burn < revenue)
- **Gate decision:** Green for Phase 2, or adjust pricing/retention?

**M18 Review (Series A Completion):**
- 500+ farmers, 60%+ retention
- Revenue $1.5M+ run rate (implies profitability by M20)
- All 6 modules live
- 2-3 B2B partnerships active
- **Gate decision:** Proceed to Series B or operate profitably without?

---

## 12. Conclusion & Investment Recommendation

### 12.1 Feasibility Assessment

**Financial viability: CONFIRMED**

✓ Unit economics validate (91% gross margin, 40:1 LTV/CAC)  
✓ Break-even achievable within 18 months (Month 9-10 with phased approach)  
✓ Market size sufficient (TAM 4.5-5.75B TL, SAM 1-1.35B TL)  
✓ Scaling path clear (MVP → Phase 1 → Phase 2, each self-funding from cashflow by Year 2)  
✓ Risk scenarios manageable (Series A contingency covers Best/Base/Worst cases)

### 12.2 Investment Strategy

**Phased funding recommended over big-bang:**

```
Series Seed (M0):       1.2-1.5M TL   → MVP proof (M0-6)
Series A (M6):          2.5-3.5M TL   → Market validation (M6-18)
Self-funded (M18+):     Retained earnings → National scale (Year 2+)
```

**Why phased is better:**
- Reduces risk (prove concept before scaling capital)
- Aligns investor incentives (milestone-based follow-on)
- Preserves founder equity (later rounds dilute less if revenue validates)
- De-risks Series A (M6 gate ensures strong metrics, justifies valuation)

### 12.3 Key Success Factors (Financial)

1. **Hit M6 metrics:** 50 farmers, 300K revenue, validated LTV/CAC = Series A qualified
2. **Control CAC:** Keep blended CAC ≤ 1.5K TL through referral + partnership channels
3. **Maintain gross margin:** Monitor opex/farmer ratio, target <6K TL per farmer annual cost
4. **Achieve profitability:** Month 9-10 platform-level (not just unit), then retain earnings for scale
5. **De-risk partnerships:** Secure ESA/TSMS/B2B commitments by M3 (reduce Series A risk)

### 12.4 Final Investment Recommendation

**PROCEED with Series Seed fundraising**

- **Target:** 1.2-1.5M TL
- **Timeline:** Close by Month 1-2 (September 2024 equivalent)
- **Use:** MVP delivery, team hiring, pilot support, contingency
- **Success probability:** 70-80% (given product-market validation from pilot, Dr. Koçak support, clear financial model)

**Series A assumption** (M6): Given M6 gate metrics, Series A should be attainable at 18-25M TL post-money valuation.

---

**Document prepared by:** Financial Strategy & Feasibility Team  
**Review cycle:** Quarterly (Q1, Q2, Q3, Q4) with monthly monitoring  
**Next update:** After Series Seed close (M1-2)
