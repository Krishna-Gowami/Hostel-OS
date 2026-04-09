# HostelOS — Hostel Application System
## Task Tracker (Cross-Session Continuity File)

**Instructions for any AI continuing this work:**
1. Read REQUIREMENTS.md first — it has ALL locked specs
2. Check this file — find the first `[ ]` task and continue from there
3. Mark tasks `[/]` when starting, `[x]` when done
4. Do NOT re-do completed tasks

---

## NEW PHASE: Manual Allocation & Finalization Update

- [x] **1. Backend Models**
  - Update `HostelConfig` with `isFinalized`, `rejectionEmailTemplate`, `selectionEmailTemplate`. Remove old run timestamps.
- [x] **2. Backend Routes (`hostelApplicationR.js`)**
  - Modify `POST /submit` to never throw 400 on NCR check. Still run it, save as `eligible: false` and `status: 'rejected'` if failed.
  - Create `POST /:id/allocate` (Admin only)
  - Create `POST /:id/unallocate` (Admin only)
  - Create `POST /finalize` to lock changes (Admin only)
  - Create `POST /send-notifications` to send emails and create `User` records (Admin only)
- [x] **3. Email Service**
  - Adjust `sendHostelAllocationEmail` and `sendHostelRejectionEmail` to use custom strings passed from the route.
- [x] **4. Frontend Form**
  - Update `Step1Policy.jsx` copy to remove "NOT eligible" warning and soften wording to matching new intent (can apply, categorized internally).
- [x] **5. Admin UI (`HostelApplications.jsx`)**
  - Implement new tabs ("Waiting List", "Rejected", "Allocated", "Finalize & Notify").
  - Add manual 'Allocate' and 'Undo' buttons on Waiting List and Rejected tables.
  - Build Finalize tab with text areas for email templates and finalize/notify buttons.
- [ ] **6. Verification**
  - Create multiple applications (inside and outside NCR).
  - Verify they go to the respective waiting/rejected lists without blocking user.
  - Test admin manual allocation and un-allocation.
  - Verify finalization locks the UI.
  - Verify email notification triggers User object generation.
