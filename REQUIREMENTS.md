# HostelOS — New Hostel Application System
## Requirements Specification (Locked)

---

## 1. Landing Page Redesign

### Visual Style
- White, minimal, scrollable design — matching the reference screenshot style
- Use isometric room/hostel illustrations (SVG or image assets)
- Typography: clean sans-serif (existing font system)
- Keep HostelOS branding; update all copy to be hostel-management specific
- Scrollable page with multiple sections

### Hero Section Content
- Headline: "Apply for Hostel Accommodation"
- Sub: "A fair, merit-based room allocation system for students"
- Two CTA buttons:
  - **"Apply for Hostel"** → `/apply` (new public multi-step form — no login required)
  - **"Sign Up"** → `/register` (existing student auth flow for already-enrolled students)
- Isometric hero illustration (hostel room graphic)

### Additional Sections (scrollable)
- Feature highlights (Policy, Fair Ranking, Merit-based allocation)
- How it works (3 steps: Apply → Verification → Allocation)
- Footer (same as existing)

---

## 2. Application Flow (Public — No Login Required)

### Route: `/apply`
Multi-step form with progress preserved across all steps (React state / sessionStorage).

---

### Step 1: Policy & Awareness Page
- Display ALL hostel rules clearly
- Explicitly show:
  - **50% seats reserved for JEE applicants**
  - **50% seats reserved for College Entrance Exam applicants**
  - Students providing both scores compete in BOTH categories independently
  - **Students from NCR or within 25 km radius are NOT eligible** (verified via API, not self-declaration)
  - Other standard hostel rules (no guests after hours, etc.)
- Mandatory checkbox: "I have read and agree to all policies"
- **Next button disabled until checkbox is checked**

---

### Step 2: Personal Details
Fields:
- Full Name (required)
- Email (required, will receive notifications)
- Phone Number (required, 10-digit)
- Date of Birth (required)
- Gender (required: Male / Female / Other)
- Category (General / OBC / SC / ST)

---

### Step 3: Permanent Address (used for NCR API validation)
Fields:
- Address Line 1 (required)
- Address Line 2 (optional)
- City (required)
- State (required)
- PIN Code (required)
- Country (default: India)

**Important**: This address is geocoded on the backend. No self-declaration accepted.

---

### Step 4: Academic Details
Fields:
- JEE Percentile (text input, enter "NA" if not applicable)
- College/University Entrance Exam Marks (text input, enter "NA" if not applicable)
- Class 10 Percentage
- Class 12 Percentage
- College/University Name
- Course/Branch
- Year of Study

**Validation Rule**: At least one of JEE Percentile or Entrance Marks must be a valid numeric value (not "NA"). If both are "NA", block submission.

---

### Step 5: Other Details
Fields:
- Blood Group
- Medical Conditions (textarea, optional)
- Parent/Guardian Name (required)
- Parent/Guardian Phone (required)
- Parent/Guardian Email (optional)
- Emergency Contact Relationship

---

### Step 6: Review & Submit
- Show full application summary (all steps)
- "Edit" link per section to go back
- Final submit button
- On submit: backend validates → stores or rejects

---

## 3. Backend Application Processing

### NCR Validation (API-Based)
1. Take permanent address from Step 3
2. Geocode using **Nominatim** (primary): `https://nominatim.openstreetmap.org/search`
3. **Fallback**: OpenCage API (if Nominatim fails or returns no result)
4. Check if coordinates fall within NCR bounds OR within 25 km of NCR center
   - NCR Center approx: `28.6139° N, 77.2090° E` (New Delhi)
   - 25 km radius check using Haversine formula
5. If inside NCR / within 25km → **REJECT immediately**
   - Send rejection email to applicant
   - Application is **NOT stored in database**
6. If outside → store application as `eligible: true`

---

### Application Storage
Store in new `HostelApplication` collection:
```
{
  name, email, phone, dob, gender, category,
  address: { line1, line2, city, state, pin, country },
  jeePercentile: Number | null,      // null means "NA"
  entranceMarks: Number | null,       // null means "NA"
  hasJEE: Boolean,
  hasEntrance: Boolean,
  class10Percent, class12Percent,
  collegeName, course, yearOfStudy,
  bloodGroup, medicalConditions,
  parentName, parentPhone, parentEmail,
  eligible: Boolean,                  // true = passed NCR check
  status: "pending" | "ranked" | "allocated" | "rejected",
  allocationCategory: "jee" | "entrance" | null,
  allocatedRoom: ObjectId | null,
  applicationYear: Number,            // e.g., 2025
  submittedAt: Date
}
```

---

## 4. Admin Panel — "This Year Applications"

### Route: `/admin/hostel-applications`
New dedicated section added to admin sidebar.

### Sub-sections / Tabs:

#### Tab 1: All Applications
- Table view of all applications for current year
- Filters: eligible / rejected / pending / allocated
- Search by name/email
- Click to view full application detail

#### Tab 2: Ranking Configuration
- Set/Update:
  - **Total Seats** (e.g., 100)
  - **Application Window Deadline** (date picker — admin sets, once passed, ranking can be triggered)
  - **Gender Ratio** (e.g., Male: 60%, Female: 40%) — configurable, not hardcoded
- Save config button

#### Tab 3: Run Ranking / Allocation
- Visible/active only after deadline has passed
- Button: **"Run Ranking Process"**
  - Filters all ineligible applications first
  - Creates JEE ranking list (sorted by jeePercentile DESC)
  - Creates Entrance ranking list (sorted by entranceMarks DESC)
  - Applies gender ratio to each list independently
  - Allocates top N seats from JEE list, top N from Entrance list
  - If student appears in both and qualifies in both → allocate from JEE list → remove from Entrance list (hidden, not shown)
  - Sends allocation emails to selected students

#### Tab 4: Ranked Lists (View Only)
- JEE Ranked List table
- Entrance Ranked List table
- Allocated Students list

#### Tab 5: Rejected Applications
- All NCR-rejected or status=rejected
- View details

---

## 5. Dual Ranking & Allocation Logic (Detailed)

```
STEP 1: Filter eligible applications (eligible: true, current year)

STEP 2: Split into two pools:
  - JEE Pool: applications where hasJEE = true (sorted by jeePercentile DESC)
  - Entrance Pool: applications where hasEntrance = true (sorted by entranceMarks DESC)

STEP 3: Read config: totalSeats, genderRatio
  - jeeSeats = Math.floor(totalSeats * 0.5)
  - entranceSeats = totalSeats - jeeSeats

STEP 4: Apply gender ratio within each pool:
  - For JEE pool (jeeSeats total):
    - maleJeeSeats = Math.round(jeeSeats * genderRatio.male)
    - femaleJeeSeats = jeeSeats - maleJeeSeats
    - Allocate top maleJeeSeats males from JEE pool
    - Allocate top femaleJeeSeats females from JEE pool

STEP 5: Same logic for Entrance pool

STEP 6: Deduplication:
  - Collect all allocated student emails from JEE allocation
  - When processing Entrance list, if student is already allocated → skip (hidden from list)

STEP 7: Mark status='allocated' on chosen records
         Send allocation email with details
```

---

## 6. Email Notifications

### Rejection Email (immediate, sent at submission time)
- Trigger: NCR validation fails
- Content: Name, reason (NCR/proximity), encouragement to check eligibility again

### Allocation Email (sent when admin runs allocation)
- Trigger: Admin triggers ranking process
- Content: Name, Allocated Room details, Reporting date (if admin sets), next steps

### Email Provider
- **Nodemailer + Gmail** (already configured in codebase)
- Use existing `emailService.js` pattern

---

## 7. Environment Variables Required (New)

```env
OPENCAGE_API_KEY=<your_key_here>           # Fallback geocoding
NCR_CENTER_LAT=28.6139
NCR_CENTER_LNG=77.2090
NCR_RADIUS_KM=25
APPLICATION_YEAR=2025                       # Current application year
```

---

## 8. Deployment Constraints

- Frontend: Vercel (existing)
- Backend: Render (existing)
- No mock data anywhere in this feature
- All env vars used for API keys
- Nominatim requires a User-Agent header (set to `HostelOS/1.0`)
- Nominatim rate limit: 1 req/sec — add 1 second delay between requests if batch processing

---

## 9. What is NOT in scope

- Payment for hostel application (handled separately after allocation)
- HostelOS student login for the application (public form only)
- Automatic allocation on window close (admin manually triggers)
- Mobile app
