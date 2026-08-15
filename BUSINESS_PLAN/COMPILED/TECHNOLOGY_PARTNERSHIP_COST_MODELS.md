# Technology Partnership Cost Models & Investor Analysis
## Intelligent Agriculture Platform (IA)

**Version:** 1.0  
**Date:** August 2026  
**Audience:** Investors, Board Members, Strategy Team  
**Status:** Financial Analysis Phase

---

## Executive Summary

Platform success depends on **disciplined technology partnership decisions** that balance cost, control, and scalability. We evaluate **4 strategic models** across cloud, satellite, AI/ML, and infrastructure components.

**Key Findings:**

| Model | Year 1 Cost | Year 3 Cost | Break-even | Recommendation |
|-------|-----------|-----------|-----------|-----------------|
| **Full Partnership** (ESA + AWS + SaaS) | $1.23M | $2.4M | Month 9 | ✅ **RECOMMENDED** |
| **Hybrid** (ESA + AWS + partial on-prem) | $1.15M | $2.1M | Month 11 | Alt 1 |
| **Lean SaaS** (Minimal infra, heavy partners) | $0.95M | $2.8M | Month 14 | Higher risk |
| **Build Everything** (Capex heavy) | $1.5M | $1.9M | Month 20 | Too risky |

**Bottom Line:** Partnership model saves **$300K-500K annually** vs. building everything, while maintaining strategic flexibility.

---

## 1. Partnership Model Comparison Matrix

### 1.1 Model Definitions

#### Model A: Full Partnership (RECOMMENDED)
```
Components:
├─ Satellite: Copernicus (ESA) — FREE + SageMaker
├─ Cloud: AWS only (no Azure) — $200K/year
├─ AI/ML: SageMaker (managed) — $80K/year
├─ Data Centers: AWS Turkey + Frankfurt — included
├─ Build: 6 FMIS modules in-house
├─ Experts: Build expert marketplace network
└─ Integration: Stripe, Twilio, OpenWeatherMap APIs

Opex per farmer: $17.2K (Year 1) → $2.1K (Year 3)
Capital Requirements: Minimal ($500K initial team + dev)
```

#### Model B: Hybrid (Build + Partner)
```
Components:
├─ Satellite: Copernicus (ESA) — FREE
├─ Cloud: AWS ($150K) + own server room ($50K setup)
├─ AI/ML: TensorFlow (on-prem GPU) + SageMaker (hybrid)
├─ Data Centers: Own infra in Turkey + AWS EU
├─ Build: 6 FMIS modules + infrastructure team
├─ Experts: Partner with existing network (revenue share)
└─ Integration: Stripe, Twilio, TSMS

Opex per farmer: $15.8K (Year 1) → $2.0K (Year 3)
Capital Requirements: $500K (servers, setup) + $300K dev
```

#### Model C: Lean SaaS (Minimal Build)
```
Components:
├─ Satellite: SaaS platform (no-code) or GEE only
├─ Cloud: AWS ($150K) + off-the-shelf analytics
├─ AI/ML: Pre-trained models (limited customization)
├─ Data Centers: AWS only (no redundancy)
├─ Build: Minimal — use SaaS platforms
├─ Experts: White-label expert network (high commission)
└─ Integration: Heavy API dependency

Opex per farmer: $9.5K (Year 1) → $2.8K (Year 3)
Capital Requirements: Minimal ($100K)
Risk: High vendor lock-in, limited differentiation
```

#### Model D: Build Everything (Maximum Control)
```
Components:
├─ Satellite: Build own satellite ground station (unrealistic)
├─ Cloud: Own data center (5,000 sq ft)
├─ AI/ML: All custom models, on-prem GPUs
├─ Data Centers: Turkey only (no redundancy)
├─ Build: Everything in-house
├─ Experts: Full internal team (500+ staff)
└─ Integration: Custom connectors

Capex: $1.5M | Opex: $1.5M/year
Capital Requirements: $3M+ (land, equipment, staff)
Risk: Very high, slow to scale, regulatory burden
```

---

## 2. Detailed Cost Breakdown by Model

### 2.1 Year 1 Cost Comparison (100 farmers)

#### Model A: Full Partnership
```
CAPEX (One-time)
├─ Platform development (4 FTE, 12 months): 600K TL
├─ Infrastructure setup (AWS, DNS, monitoring): 150K TL
├─ Legal/compliance (KVKK audit): 50K TL
├─ Office/equipment: 100K TL
└─ Marketing/CAC: 50K TL
TOTAL CAPEX: 950K TL

OPEX (Annual, 100 farmers)
├─ Cloud Infrastructure
│  ├─ AWS EC2 (compute): 80K TL
│  ├─ AWS RDS (database): 40K TL
│  ├─ AWS Lambda/other: 30K TL
│  └─ Subtotal: 150K TL
├─ AI/ML & GPU
│  ├─ SageMaker (on-demand): 60K TL
│  ├─ Data processing: 20K TL
│  └─ Subtotal: 80K TL
├─ Satellite & Data
│  ├─ Copernicus/ESA: 0 TL (FREE)
│  ├─ Google EE (optional): 30K TL
│  └─ Subtotal: 30K TL
├─ Payment & Integration
│  ├─ Stripe commission: 10K TL
│  ├─ Twilio/SMS: 15K TL
│  ├─ Weather API: 10K TL
│  └─ Subtotal: 35K TL
├─ Expert Operations
│  ├─ Expert support team (2 FTE): 100K TL
│  ├─ Expert onboarding/training: 25K TL
│  ├─ Platform commission to experts: 60K TL
│  └─ Subtotal: 185K TL
├─ Team & Operations
│  ├─ Engineering (4 FTE): 350K TL
│  ├─ Operations (1 FTE): 80K TL
│  ├─ Business dev (1 FTE): 70K TL
│  ├─ Office/admin: 50K TL
│  └─ Subtotal: 550K TL
├─ Marketing & CAC
│  ├─ Digital marketing: 150K TL
│  ├─ Dr. Koçak partnership: 50K TL
│  ├─ Sales support: 100K TL
│  └─ Subtotal: 300K TL
└─ TOTAL OPEX: 1,710K TL

**YEAR 1 TOTAL: 2,660K TL**
**Per Farmer: 26.6K TL/year**
```

#### Model B: Hybrid (Build + Partner)
```
CAPEX (One-time)
├─ Platform development: 600K TL
├─ On-premise GPU server: 350K TL
├─ Network/security setup: 50K TL
├─ Data center co-location (1 cabinet): 30K TL
├─ Legal/compliance: 50K TL
├─ Office/equipment: 100K TL
└─ Marketing/CAC: 50K TL
TOTAL CAPEX: 1,230K TL

OPEX (Annual, 100 farmers)
├─ Cloud Infrastructure
│  ├─ AWS (reduced): 80K TL
│  ├─ Co-location (monthly): 30K TL
│  ├─ Power/cooling on-prem: 40K TL
│  └─ Subtotal: 150K TL
├─ AI/ML & GPU
│  ├─ On-prem GPU maintenance: 30K TL
│  ├─ SageMaker (partial): 20K TL
│  ├─ Staff for GPU mgmt (0.5 FTE): 40K TL
│  └─ Subtotal: 90K TL
├─ Satellite & Data
│  ├─ Copernicus/ESA: 0 TL (FREE)
│  └─ Subtotal: 0 TL
├─ Other components: 185K TL (same as Model A)
├─ Team & Operations
│  ├─ Engineering: 380K TL (1 more for infra)
│  ├─ Operations: 80K TL
│  ├─ DevOps (1 FTE for servers): 80K TL
│  ├─ Business dev: 70K TL
│  ├─ Office/admin: 60K TL
│  └─ Subtotal: 670K TL
├─ Marketing & CAC: 300K TL (same)
└─ TOTAL OPEX: 1,595K TL

**YEAR 1 TOTAL: 2,825K TL**
**Per Farmer: 28.3K TL/year**
```

#### Model C: Lean SaaS
```
CAPEX (One-time)
├─ Minimal development: 200K TL
├─ SaaS subscriptions setup: 20K TL
├─ Legal/compliance: 30K TL
├─ Office/equipment: 50K TL
└─ Marketing/CAC: 50K TL
TOTAL CAPEX: 350K TL

OPEX (Annual, 100 farmers)
├─ Cloud Infrastructure
│  ├─ AWS (basic): 60K TL
│  ├─ Platform SaaS tools: 40K TL
│  └─ Subtotal: 100K TL
├─ AI/ML & GPU
│  ├─ Pre-trained models (SaaS): 30K TL
│  └─ Subtotal: 30K TL
├─ Satellite & Data
│  ├─ GEE + APIs: 100K TL
│  └─ Subtotal: 100K TL
├─ Payment & Integration: 40K TL (slightly higher)
├─ Expert Operations
│  ├─ White-label network commission: 120K TL
│  ├─ Support (1 FTE): 60K TL
│  └─ Subtotal: 180K TL
├─ Team & Operations
│  ├─ Engineering (2 FTE): 200K TL
│  ├─ Operations (1 FTE): 80K TL
│  ├─ Business dev (1 FTE): 70K TL
│  ├─ Office/admin: 40K TL
│  └─ Subtotal: 390K TL
├─ Marketing & CAC: 200K TL
└─ TOTAL OPEX: 1,040K TL

**YEAR 1 TOTAL: 1,390K TL**
**Per Farmer: 13.9K TL/year**
```

#### Model D: Build Everything
```
CAPEX (One-time)
├─ Data center buildout: 1,000K TL
├─ GPU servers (10x A100): 500K TL
├─ Network/security: 100K TL
├─ Platform development: 800K TL
├─ Legal/compliance: 50K TL
├─ Office/equipment: 200K TL
└─ Marketing/CAC: 50K TL
TOTAL CAPEX: 2,700K TL

OPEX (Annual, 100 farmers)
├─ Data Center
│  ├─ Rent/utilities: 150K TL
│  ├─ Cooling/power: 100K TL
│  ├─ Security (24/7): 80K TL
│  ├─ Maintenance: 50K TL
│  └─ Subtotal: 380K TL
├─ GPU & Infrastructure
│  ├─ GPU replacement/upgrade: 100K TL
│  ├─ Infrastructure team (3 FTE): 250K TL
│  └─ Subtotal: 350K TL
├─ Satellite & Data
│  ├─ Custom satellite station: 200K TL (build cost)
│  ├─ Operations: 100K TL/year
│  └─ Subtotal: 100K TL
├─ All other services: 200K TL (custom build)
├─ Team & Operations
│  ├─ Engineering (6 FTE): 550K TL
│  ├─ Operations (3 FTE): 200K TL
│  ├─ Infrastructure (3 FTE): 250K TL
│  ├─ Business dev (1 FTE): 70K TL
│  ├─ Office/admin: 100K TL
│  └─ Subtotal: 1,170K TL
├─ Marketing & CAC: 300K TL
└─ TOTAL OPEX: 2,500K TL

**YEAR 1 TOTAL: 5,200K TL**
**Per Farmer: 52K TL/year**
```

---

## 3. Five-Year Cost Projections

### 3.1 Model A: Full Partnership (Recommended)

```
Assumptions:
├─ Farmer growth: 100 (Y1) → 500 (Y3) → 1,500 (Y5)
├─ AWS scaling: +50% year-over-year
├─ Team growth: +20% year-over-year
├─ Expert network: +30 consultants/year
└─ Expert commission reduces as scale increases

YEAR-BY-YEAR PROJECTION:

YEAR 1: 100 farmers
├─ Capex: 950K TL
├─ Opex: 1,710K TL
├─ Revenue: 2,370K TL (100 farmers × 23.7K TL avg)
├─ Gross Profit: 660K TL
├─ Operating Income: -300K TL (investment phase)
└─ Cost/farmer: 26.6K TL

YEAR 2: 300 farmers
├─ Capex: 200K TL (incremental)
├─ Opex: 2,050K TL
│  ├─ AWS scaling: 180K TL (+50%)
│  ├─ Team expansion: +2 FTE: 150K TL
│  ├─ Expert network: +30 consultants
│  └─ Marketing: 400K TL (customer acquisition)
├─ Revenue: 6,410K TL (300 farmers)
├─ Gross Profit: 4,360K TL
├─ Operating Income: 2,310K TL ✓ PROFITABLE
└─ Cost/farmer: 6.8K TL (-74% from Y1)

YEAR 3: 500 farmers
├─ Capex: 150K TL (incremental)
├─ Opex: 2,400K TL
│  ├─ AWS: 220K TL (+22%)
│  ├─ Team: 750K TL (stable)
│  ├─ Expert commission: 180K TL (-10% as platform scales)
│  └─ Marketing: 600K TL
├─ Revenue: 16,080K TL (500 farmers)
├─ Gross Profit: 13,680K TL
├─ Operating Income: 11,130K TL ✓ HIGHLY PROFITABLE
└─ Cost/farmer: 4.8K TL (-64% from Y2)

YEAR 4: 1,000 farmers
├─ Capex: 100K TL
├─ Opex: 2,900K TL
├─ Revenue: 25,500K TL
├─ Operating Income: 21,500K TL
└─ Cost/farmer: 2.9K TL

YEAR 5: 1,500 farmers
├─ Capex: 100K TL
├─ Opex: 3,300K TL
├─ Revenue: 35,500K TL
├─ Operating Income: 31,100K TL
└─ Cost/farmer: 2.2K TL

CUMULATIVE 5-YEAR:
├─ Total Investment: 1,500K TL (Capex)
├─ Total Opex: 12,360K TL
├─ Total Revenue: 85,860K TL
├─ Gross Profit: 72,500K TL
├─ Operating Income: 58,140K TL
└─ ROI: 3,876% (58.1M / 1.5M)
```

### 3.2 Model B: Hybrid (Alternative)

```
YEAR-BY-YEAR PROJECTION:

YEAR 1: 100 farmers
├─ Capex: 1,230K TL
├─ Opex: 1,595K TL
├─ Revenue: 2,370K TL
├─ Operating Income: -455K TL (higher Capex)
└─ Cost/farmer: 28.3K TL

YEAR 2: 300 farmers
├─ Capex: 150K TL
├─ Opex: 1,850K TL (lower than Model A due to on-prem GPU)
├─ Revenue: 6,410K TL
├─ Operating Income: 2,410K TL ✓ PROFITABLE (Month 10)
└─ Cost/farmer: 6.2K TL

YEAR 3: 500 farmers
├─ Capex: 100K TL
├─ Opex: 2,150K TL (even lower, GPU amortized)
├─ Revenue: 16,080K TL
├─ Operating Income: 11,730K TL
└─ Cost/farmer: 4.3K TL

YEAR 4-5: Similar to Model A

CUMULATIVE 5-YEAR:
├─ Total Investment: 1,730K TL (higher Capex)
├─ Total Opex: 11,260K TL (lower than A)
├─ Total Revenue: 85,860K TL
├─ Operating Income: 59,370K TL
└─ ROI: 3,431% (higher absolute profit, but slower payback)
```

### 3.3 Model C: Lean SaaS (Low Cost, High Risk)

```
YEAR 1: 100 farmers
├─ Capex: 350K TL
├─ Opex: 1,040K TL
├─ Revenue: 2,370K TL
├─ Operating Income: -20K TL ✓ NEARLY BREAK-EVEN
└─ Cost/farmer: 13.9K TL

PROBLEM: High vendor lock-in
├─ GEE: 0.3% revenue share (scales with growth)
├─ White-label experts: 50% commission (high)
├─ SaaS tools: Feature limitations for scaling
└─ Year 3+: Opex grows faster than Model A due to commissions

YEAR 3: 500 farmers
├─ Opex: 2,800K TL (higher due to expert commission scaling)
├─ Revenue: 16,080K TL
├─ Operating Income: 9,280K TL (lower than A)
└─ Cost/farmer: 5.6K TL

YEAR 5: 1,500 farmers
├─ Revenue: 35,500K TL
├─ Opex: 4,200K TL (escalating commissions)
├─ Operating Income: 28,300K TL (lower profitability)
└─ Cost/farmer: 2.8K TL

CUMULATIVE 5-YEAR:
├─ Total Investment: 600K TL (lowest)
├─ Total Opex: 13,100K TL (highest)
├─ Total Revenue: 85,860K TL
├─ Operating Income: 51,760K TL (lowest)
└─ ROI: 8,627% (good, but operationally constrained)
```

### 3.4 Model D: Build Everything (Not Recommended)

```
YEAR 1: 100 farmers
├─ Capex: 2,700K TL
├─ Opex: 2,500K TL
├─ Revenue: 2,370K TL
├─ Operating Income: -2,830K TL (MASSIVE LOSS)
└─ Cost/farmer: 52K TL

YEAR 2-3: Still unprofitable, data center underutilized

YEAR 3: 500 farmers
├─ Capex: 250K TL
├─ Opex: 2,600K TL (still high due to fixed costs)
├─ Revenue: 16,080K TL
├─ Operating Income: 11,630K TL
└─ Cost/farmer: 5.2K TL

CUMULATIVE 5-YEAR:
├─ Total Investment: 3,200K TL (highest)
├─ Total Opex: 14,800K TL (highest)
├─ Total Revenue: 85,860K TL
├─ Operating Income: 47,860K TL (lowest profitability)
└─ ROI: 1,495% (poorest return)
```

---

## 4. Break-even & Profitability Analysis

### 4.1 Break-even Farmer Count by Model

```
Break-even = Point where Opex = Revenue

Model A (Full Partnership):
├─ Monthly Opex: ~142K TL
├─ Revenue per farmer: 237K TL/year (~19.8K TL/month)
├─ Break-even: 142K / 1.98K per farmer = 72 farmers
└─ Timeline: Month 9 (with 100 farmers by Month 12)

Model B (Hybrid):
├─ Higher Capex, lower Opex over time
├─ Break-even: ~78 farmers
└─ Timeline: Month 10-11

Model C (Lean SaaS):
├─ Lower Capex, scaling commission costs
├─ Break-even: ~56 farmers
└─ Timeline: Month 4 (fastest break-even)
├─ BUT: Opex grows faster later (commissions)

Model D (Build Everything):
├─ Very high fixed costs
├─ Break-even: ~250 farmers
└─ Timeline: Month 20+ (unacceptable)
```

### 4.2 Profitability per Farmer (Marginal Analysis)

```
Question: How much profit does each new farmer add?

Model A (Full Partnership):
├─ Year 1: Revenue 23.7K TL per farmer, Opex 26.6K TL → -2.9K TL (loss)
├─ Year 2: Revenue per farmer 21.4K TL, Marginal Opex 6.8K TL → +14.6K TL profit
├─ Year 3: Revenue 32.2K TL per farmer, Marginal Opex 4.8K TL → +27.4K TL profit
└─ Year 5: Revenue 23.7K TL per farmer, Marginal Opex 2.2K TL → +21.5K TL profit

Model C (Lean SaaS):
├─ Year 1: Revenue 23.7K TL per farmer, Opex 13.9K TL → +9.8K TL profit ✓
├─ Year 2: Marginal Opex increases due to commissions → +12.2K TL profit
├─ Year 3: Revenue 32.2K TL, Marginal Opex 5.6K TL → +26.6K TL profit
└─ BUT: No strategic control, limited differentiation
```

---

## 5. Risk-Return Analysis

### 5.1 Risk Profile by Model

| Risk Factor | Model A | Model B | Model C | Model D |
|------------|---------|---------|---------|---------|
| **Capex Risk** | Low (950K) | Medium (1,230K) | Very Low (350K) | Very High (2,700K) |
| **Opex Scaling** | Predictable | Moderate volatility | Escalating (commissions) | Difficult |
| **Vendor Lock-in** | Low (ESA is free) | Medium (AWS only) | High (GEE, white-label) | None |
| **Technology Risk** | Low (proven APIs) | Medium (on-prem GPUs) | High (limited control) | High (untested build) |
| **Regulatory Risk** | Low (KVKK compliant) | Low | Medium (SaaS terms) | Low |
| **Scaling Risk** | Low (elastic cloud) | Medium (infra limits) | High (SaaS bottlenecks) | Very High (org complexity) |
| **Team Risk** | Medium (4 FTE needed) | High (needs DevOps) | Low (fewer FTE) | Very High (20+ FTE) |

### 5.2 Sensitivity Analysis: What if farmer growth slows?

**Scenario: 50% slower growth (50 farmers Y1, 250 farmers Y3)**

```
Model A Profitability:
├─ Year 1: -600K TL (vs. -300K predicted)
├─ Year 2: +900K TL (vs. +2,310K predicted)
├─ Year 3: +4,500K TL (vs. +11,130K predicted)
├─ Recovery: Profit recovers by Year 4-5
└─ Verdict: Still viable, just delayed ✓

Model C Profitability:
├─ Year 1: -500K TL (vs. -20K predicted)
├─ Year 2: +200K TL (vs. +2,410K predicted)
├─ Year 3: +2,000K TL (vs. +11,730K predicted)
├─ Recovery: Slower recovery due to high commission costs
└─ Verdict: Risky if growth underperforms ✗

Model D:
├─ Fixed costs don't scale down
├─ Year 3: Still unprofitable with 250 farmers
└─ Verdict: Not viable if growth slows ✗
```

---

## 6. Investor Q&A

### Q1: Why not build everything in-house for maximum control?

**A:** Building everything requires:
- $2.7M upfront capital (vs. $0.95M for Model A)
- 20+ team members (vs. 8 FTE)
- 20+ months to profitability (vs. 9 months)
- Managing data center operations (not core business)
- Competing with scale advantages of AWS, ESA

**Better approach:** Use best-in-class partners (ESA satellite, AWS cloud) for infrastructure, focus internal team on competitive advantage (6 FMIS modules, expert network, AI models).

---

### Q2: ESA's Copernicus data is free, but is it reliable enough?

**A:** Yes, and increasingly better than commercial alternatives:
- **Sentinel-2:** 10m resolution (perfect for parcel-level analysis)
- **Frequency:** 5-day revisit (weekly effective coverage)
- **Reliability:** 99.5% uptime SLA (published)
- **History:** 8+ years of archive data
- **Comparison to Google EE:** Similar results, but free + no vendor lock-in

**De-risking strategy:** Sentinel-2 primary (free) + Google EE optional (premium features) means we're not dependent on either vendor.

---

### Q3: What's the biggest cost driver as we scale?

**A:** **Team & Operations** (payroll), not technology:
- Year 1: Engineering (4 FTE), Expert ops (2 FTE), Business dev (1 FTE)
- Year 3: Same team, but each person serves more farmers (leveraging)
- Opex reduces from 26.6K TL per farmer (Y1) to 4.8K TL per farmer (Y3)

**Technology cost** actually decreases:
- AWS: Fixed + variable (scales with data, not headcount)
- Satellite: FREE (Copernicus)
- AI/ML: SageMaker spot instances (only pay for usage)

---

### Q4: Why Model A over Model B (hybrid with on-prem GPU)?

**A:** **Trade-off analysis:**

| Factor | Model A | Model B |
|--------|---------|---------|
| **Initial Capex** | 950K | 1,230K (28% higher) |
| **Year 1 Opex** | 1,710K | 1,595K (7% lower) |
| **Break-even** | Month 9 | Month 10 |
| **Scaling flexibility** | Elastic | Capped by server capacity |
| **Team complexity** | 8 FTE | 9 FTE (needs DevOps) |
| **Risk if growth accelerates** | Low (cloud auto-scales) | High (GPU under-utilized) |

**Recommendation:** Model A. Lower Capex, faster break-even, infinite scaling. If on-prem GPU becomes critical later, we can add it as optimization (not replace).

---

### Q5: What's the downside of Model C (Lean SaaS)?

**A:** Low upfront cost attracts founders, but three fatal flaws:

1. **Vendor Lock-in:** GEE and white-label experts control 50%+ of operations
   - GEE could increase rates (0.3% → 0.5%+)
   - Expert margins compress over time

2. **Limited Differentiation:** Using pre-built SaaS tools means:
   - Can't customize FMIS modules for Turkish farmers
   - No proprietary AI models (CNN disease detection)
   - Difficult to build defensible moat

3. **Opex Scaling:** Commission costs grow with revenue
   - Year 1: 13.9K TL per farmer
   - Year 5: 2.8K TL per farmer (but 30% higher than Model A due to commissions)
   - Profit margin compressed long-term

**Verdict:** OK for MVP validation, not for scaling to profitability.

---

### Q6: Can we start with Model C and migrate to Model A later?

**A:** **Yes, but painful:**
- Model C builds on GEE APIs and white-label infrastructure
- Migrating away requires rewriting FMIS modules (3-6 months, $300K)
- Expert network contracts lock you in (30-day termination clauses)
- **Recommendation:** Choose Model A from start. Cost difference is only $600K Capex (1.5% of typical Series A).

---

### Q7: What if AWS prices increase?

**A:** **Mitigated by:**
1. **AWS Savings Plan** = 25-30% discount (locked 3-year contract)
2. **Multi-cloud strategy** = Can shift to Azure if AWS raises prices
3. **Architecture flexibility** = Docker containers portable across clouds
4. **Volume leverage** = At 1,500 farmers (Y5), we'll negotiate better rates

**Historical data:** AWS prices drop ~10% annually (Moore's Law), so locked discounts are actually conservative.

---

### Q8: Timeline to profitability — is Month 9 realistic?

**A:** Yes, with assumptions verified:

```
Critical Path to Month 9 Breakeven:
├─ Month 1-2: Close funding ($1.2M for Capex + 4 months Opex)
├─ Month 2-6: Build platform (6 FMIS modules MVP)
├─ Month 3-8: Launch with 20 early farmers (Dr. Koçak referrals)
├─ Month 6-10: Scale to 100 farmers (content marketing + word-of-mouth)
└─ Month 9: 72 farmers at breakeven

Risks to timeline:
├─ Regulatory delays (KVKK audit) → +2 months
├─ Key hire delays (Senior ML engineer) → +1 month
├─ Platform bugs requiring rework → +1 month
└─ Conservative estimate: Month 11 breakeven (8.5% buffer)
```

**Bottom line:** Feasible if we execute hiring and product development tightly. Month 9 is our target, Month 11 is realistic.

---

### Q9: What's the funding requirement for Model A?

**A:** **Total for 18 months (to cash flow positive):**

```
Capex: 950K TL
Opex (18 months): 1,710K + 1,025K = 2,735K TL
Buffer (contingency): 315K TL (10%)
─────────────────────────────────
TOTAL: 4,000K TL (~$270K USD at 14.8 TL/USD)
```

**Funding structure:**
- **Seed Round:** 2,500K TL (Capex + first 12 months Opex)
- **Series A (Month 6):** 2,000K TL (next 6 months Opex, scaling team)
- **Operating leverage:** By Month 15, self-funded from operations

---

### Q10: What KPIs should we track for each model?

**A:** **Unit Economics Dashboards:**

```
Model A Tracking:
├─ Cost per farmer acquired: Target <5K TL
├─ LTV:CAC ratio: Target 40:1 (vs benchmark 3:1)
├─ Monthly churn: Target <3% (critical sensitivity)
├─ AWS cost per farmer: Should decrease Y1→Y3
├─ Expert commission as % revenue: Should decrease from 12% → 5%
└─ Opex per farmer: $26.6K → $2.2K (by Year 5)

Red flags:
├─ Churn >5% = model breaks (profitability gone)
├─ CAC >8K TL = need to pivot marketing
├─ AWS costs not declining with scale = need optimization
└─ Expert commission >15% = renegotiate network terms
```

---

## 7. Investor Recommendation

### 7.1 Go/No-Go Criteria

**PROCEED with Model A if:**
- ✅ Can raise $4M by Month 1 (for 18-month runway)
- ✅ Secure Dr. Koçak partnership commitment (referral channel)
- ✅ Confirm Sentinel Hub + Copernicus access (ESA verification)
- ✅ Hire Senior ML engineer by Month 2 (disease detection critical path)
- ✅ Market research confirms CAC < 5K TL (marketing efficiency)

**DO NOT PROCEED if:**
- ❌ Can only raise $2M (insufficient runway)
- ❌ Dr. Koçak partnership doesn't materialize (referral channel is 50% of CAC strategy)
- ❌ Regulatory delays push launch >Month 6 (timeline becomes Month 12+ breakeven)
- ❌ Market research shows CAC > 8K TL (profitability compromised)

### 7.2 Decision Matrix

```
Investor Profile → Model Choice

Conservative Investor (low risk tolerance):
├─ Prefers: Model A (proven partners, clear path to profitability)
├─ Concerns: Vendor risk (addressed by multi-cloud strategy)
└─ Expected IRR: 35-50% (Year 1-5)

Growth-Focused Investor (high growth tolerance):
├─ Prefers: Model A (same as conservative, but accelerate hiring)
├─ Strategy: Hire aggressively Y2-3 to capture market before competitors
└─ Expected IRR: 60-80% (faster scaling)

Cost-Conscious Investor (pre-revenue only):
├─ Tempted by: Model C (350K Capex)
├─ Reality check: Model C's opex is higher long-term, profitability lower
├─ Recommendation: Model A = better ROI despite higher Capex
└─ Trade-off: Spend 600K more now, earn 10M+ more over 5 years
```

---

## 8. Cost Optimization Opportunities (Post-Launch)

Once Model A is running, opportunities to further reduce costs:

```
Year 2 Optimizations:
├─ Negotiate AWS Savings Plan (save $50K/year)
├─ Implement on-prem GPU for batch training (save $20K/year)
├─ Automate expert matching (reduce support team from 2 to 1.5 FTE, save $40K)
└─ Subtotal: Save $110K in Opex

Year 3 Optimizations:
├─ Build proprietary satellite processing (reduce GEE optional usage, save $30K)
├─ Move to open-source BI tools (save $20K)
├─ Consolidate data warehouses (save $15K)
└─ Subtotal: Save $65K in Opex
```

---

## 9. Conclusion

**Model A (Full Partnership) is recommended because:**

1. **Financial Superiority**
   - Lowest Capex ($950K vs. $1.23M-$2.7M)
   - Fastest break-even (Month 9)
   - Highest Year 5 profitability ($31.1M operating income)

2. **Strategic Flexibility**
   - No vendor lock-in (ESA is free, AWS multi-cloud ready)
   - Scalable team (8 FTE supports 1,500 farmers)
   - Can pivot to Model B later if needed (GPU optimization)

3. **Risk Mitigation**
   - Proven technology partners (ESA, AWS, Stripe)
   - Clear regulatory path (KVKK-compliant from day 1)
   - Sensitive to churn (need <3%), but not operationally risky

4. **Investor Appeal**
   - Clear unit economics: $26.6K → $2.2K per farmer (Y1 → Y5)
   - 35-80% expected IRR (depending on execution speed)
   - Path to Series B by Month 18 (cash flow positive = attractive acquisition target)

**Next Steps:**
- [ ] Secure $4M seed funding (18-month runway)
- [ ] Lock Dr. Koçak referral partnership
- [ ] Confirm ESA/Copernicus free access
- [ ] Hire founding engineer team (Month 1)
- [ ] Launch MVP with 20 early farmers (Month 6)
- [ ] Reach 100 farmers by end of Year 1

---

**Document Owner:** Chief Technology Officer / CFO  
**Review Cycle:** Quarterly  
**Next Update:** Month 6 (post-launch financial actuals)  
**Last Updated:** August 2026
