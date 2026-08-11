# 09 — CMS, Categories & Locations

Build order: Step 5 (Categories/Locations first, other modules depend on them as dropdown data) then Step 13 (CMS).

## A. `/admin/categories` (Practice Areas)

**Table columns:** Name (EN/UR/SD), Slug, Parent (for subcategories), # Lawyers, # Cases, Active toggle, Actions.

**Buttons:** "Add Practice Area" (modal: name in 3 languages, slug auto-generated, parent category dropdown, icon picker), Edit, Deactivate (soft — hides from new selection, keeps historical data), Reorder (drag handle, sets `display_order`).

**Backend:** `GET/POST /api/v1/admin/categories`, `PATCH/DELETE /api/v1/admin/categories/:id`, `POST /api/v1/admin/categories/reorder`.

**DB:** `practice_areas` (id, name_en, name_ur, name_sd, slug, parent_id, icon, active, display_order).

## B. `/admin/locations`

**Tabs:** Cities, Districts, Courts.

**Table columns (each tab):** Name (3 languages), Parent (District→Province, Court→City), Active toggle, Actions.

**Buttons:** "Add City/District/Court", Edit, Deactivate.

**Backend:** `GET/POST /api/v1/admin/locations/cities|districts|courts`, `PATCH/DELETE .../:id`.

**DB:** `locations` (type enum City/District/Province), `courts` (name, city_id, court_level).

## C. `/admin/cms`

**Tabs:**
1. **Pages** — static site pages (Home hero text, About, How It Works, Contact info). Table: Page name, Last updated, Status (Published/Draft), Edit.
2. **FAQs** — question/answer pairs, grouped by category, drag-reorder, 3-language fields.
3. **Legal Resources** — articles/guides shown on public site (title, category, body — rich text editor, 3 languages, publish/unpublish toggle).

**Buttons:** "Add FAQ" / "Add Resource" (modal or dedicated editor page with rich text editor — use a simple WYSIWYG like Tiptap), Edit, Publish/Unpublish, Delete (soft).

**Backend:** `GET/POST /api/v1/admin/cms/pages|faqs|resources`, `PATCH/DELETE .../:id`, `POST .../:id/publish|unpublish`.

**DB:** `cms_pages`, `faqs`, `legal_resources` (title_en/ur/sd, body_en/ur/sd, category, status, published_at, author_admin_id).

**RBAC:** CONTENT_ADMIN owns CMS + Categories + Locations; VERIFICATION_ADMIN can also edit Categories/Locations (shared dependency); SUPER_ADMIN full access.

**End result:** Admin can add a new practice area and a new city, and both immediately appear as selectable options in Lawyer/Case filters elsewhere in the admin panel (proves the shared-dropdown-data dependency works). CMS FAQ/resource CRUD works with rich text saved and rendered back correctly.
