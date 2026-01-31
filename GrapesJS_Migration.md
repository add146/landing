# GrapesJS Integration Walkthrough

We have successfully replaced the custom page editor with GrapesJS, providing a more robust and feature-rich editing experience.

## Changes Verified

### 1. Frontend Integration
- **New Editor Component**: Created `GrapesEditor.tsx` using `@grapesjs/react` and `grapesjs-preset-webpage`.
- **Page Editor Update**: Updated `PageEditor.tsx` to load the GrapesJS editor instead of the legacy custom editor.
- **Dependencies**: Added `grapesjs`, `@grapesjs/react`, and `grapesjs-preset-webpage`.

### 2. Backend Updates
- **Schema Changes**: Added `content_json` and `content_html` columns to the `pages` table to store GrapesJS project data and the generated HTML.
- **API Updates**: Updated `GET /api/pages/:id` to return the new content fields.
- **API Updates**: Updated `PATCH /api/pages/:id` to allow saving the new content fields.
- **Validation**: Updated `createPageSchema` and `updatePageSchema` to include the new fields.

## Migration Required

To enable the new storage fields, you must run the database migration.

**If using Cloudflare D1 with Wrangler:**

Run the following command in your terminal (adjust `landing-db` if your database name is different):

```bash
npx wrangler d1 execute landing-db --file=backend/db-batch-5-grapes.sql
```

or if running locally:

```bash
npx wrangler d1 execute landing-db --local --file=backend/db-batch-5-grapes.sql
```

The migration file is located at: `backend/db-batch-5-grapes.sql`

## How to Test
1. **Navigate to Dashboard**: Go to the pages dashboard.
2. **Edit a Page**: Click to edit an existing page or create a new one.
3. **GrapesJS Editor**: You should see the GrapesJS interface.
4. **Make Changes**: Drag blocks, edit text, or change styles.
5. **Save**: Click the "Save" icon (floppy disk) in the top-left toolbar or panel.
6. **Verify**: Refresh the page to ensure changes are persisted.

> **Note**: The previous "Sections" and "Elements" data are still preserved in the database but are not loaded by the GrapesJS editor, as it uses its own storage format (`content_json`).
