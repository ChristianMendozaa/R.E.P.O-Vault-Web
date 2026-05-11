# R.E.P.O Vault Web

`R.E.P.O Vault Web` is a browser-based save editor for `R.E.P.O`.

**[https://r-e-p-o-vault-web.vercel.app/](https://r-e-p-o-vault-web.vercel.app/)**

It focuses on:
- no installation required — runs entirely in the browser
- fast editing of `.es3` saves via drag-and-drop upload
- a retro terminal-inspired dashboard UI
- player, item, and truck power management
- safe roundtrip save handling with in-browser decryption and re-encryption

## How to Use

1. Open the app in your browser.
2. Drag and drop your `.es3` save file onto the upload area, or click to browse.
3. Edit what you want across the Dashboard, Overview, Players, Items, and Truck views.
4. Press `Export Save` to download the modified `.es3` file.
5. Replace your original save file with the downloaded file.

## Which Save File to Edit

`R.E.P.O Vault Web` edits the real `.es3` save file inside your `saves` folder.

On Windows, the default save location is:

```text
C:\Users\YOUR_USERNAME\AppData\LocalLow\semiwork\Repo\saves
```

Quick way to open it:

1. Open File Explorer.
2. Click the address bar.
3. Paste `%USERPROFILE%\AppData\LocalLow\semiwork\Repo\saves`
4. Press `Enter`.

Inside `saves` there should be one or more folders with names like:

```text
REPO_SAVE_2026_05_01_23_46_39
```

Inside each save folder, the file you should edit is the `.es3` file with the exact same name as the folder.

Correct example:

```text
C:\Users\YOUR_USERNAME\AppData\LocalLow\semiwork\Repo\saves\REPO_SAVE_2026_05_01_23_46_39\REPO_SAVE_2026_05_01_23_46_39.es3
```

Do not edit backup files.

Wrong examples:

```text
REPO_SAVE_2026_05_01_23_46_39_BACKUP1.es3
REPO_SAVE_2026_05_01_23_46_39.backup.es3
```

Rule of thumb:
- edit the `.es3` file that matches the folder name exactly
- do not edit files with `BACKUP` in the name
- do not edit `.backup.es3` files

## If You Cannot See `AppData`

`AppData` is usually hidden on Windows.

On Windows 11:

1. Open File Explorer.
2. Click `View`.
3. Click `Show`.
4. Enable `Hidden items`.

On Windows 10:

1. Open File Explorer.
2. Open the `View` tab.
3. Enable `Hidden items`.

## Highlights

- Runs in the browser — no install, no executable
- Retro terminal inspired UI with a dashboard home and focused workspaces
- Decryption and re-encryption handled server-side via API routes
- Steam avatar support
- Item interactions: `+1`, `-1`, and `Have Everything`
- Save compatibility preserved with the existing `.es3` format

## Project Layout

```text
app/
  page.tsx                  Landing page with file upload
  layout.tsx                Root layout and global styles
  globals.css               Design tokens and shared CSS
  editor/
    page.tsx                Editor shell and view router
  api/
    decrypt/                Decrypt uploaded .es3 file
    encrypt/                Re-encrypt modified save data
    steam-avatar/           Steam avatar proxy with cache fallback
components/
  FileUpload.tsx            Drag-and-drop upload component
  EditorShell.tsx           Sidebar navigation and layout
  views/
    DashboardView.tsx       Save summary and run metrics
    OverviewView.tsx        High-level save state overview
    PlayersView.tsx         Per-player stat editing
    ItemsView.tsx           Inventory management
    TruckView.tsx           Truck upgrades and power crystals
lib/
  crypto.ts                 Save encryption/decryption engine
  inventory-logic.ts        Pure item/inventory mutation logic
  store.ts                  Zustand global editor state
  types.ts                  Shared TypeScript types
constants/
  items.ts                  Static item catalog
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- [Next.js 16](https://nextjs.org) with Turbopack
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand

## Safety Notes

- The `.es3` structure and encryption are fully preserved on export
- The original file on disk is never modified directly — you download the result and replace it manually
- No save data is stored or transmitted beyond your session
