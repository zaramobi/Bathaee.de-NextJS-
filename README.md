# Studio — Freelance Team Portfolio

A lean, production-ready team portfolio for a small group of freelance developers.
Presents the team, their profiles, and invites project inquiries.

```
studio/
├── data/
│   └── profiles.json        # Single source of truth — all team members
├── frontend/                # Next.js 15 + TailwindCSS
├── import_profile.py        # CLI tool to add new team members
├── docker-compose.yml       # Base stack definition
├── docker-compose.override.yml  # Dev overrides (hot-reload)
├── docker-compose.prod.yml  # Production overrides
└── Makefile
```

---

## Pages

| Route              | Description                              |
|--------------------|------------------------------------------|
| `/`                | Homepage — hero + team cards + contact   |
| `/team/[id]`       | Full profile — experience, skills, bio   |
| `/team/[id]/cv`    | Printable / ATS-friendly CV              |

---

## Development (hot-reload)

```bash
# First time
docker compose up --build

# Subsequent runs
docker compose up
```

Changes in `frontend/src/` or `data/profiles.json` reload instantly.

---

## Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

| Service | URL                   |
|---------|-----------------------|
| Site    | http://localhost:3000 |

---

## Local development (no Docker)

```bash
cd frontend
npm install
npm run dev
```

Profile data is loaded from `../data/profiles.json` relative to the `frontend/` directory.
To override the path: `PROFILES_JSON_PATH=/path/to/profiles.json npm run dev`

---

## Adding a team member

```bash
# Parse a CV PDF and append to profiles.json
python import_profile.py --cv /path/to/cv.pdf --linkedin https://linkedin.com/in/someone

# Preview without writing
python import_profile.py --cv /path/to/cv.pdf --dry-run

# Interactive guided entry
python import_profile.py --interactive
```

The script:
1. Extracts name, title, email, phone, summary, experience, skills from the PDF
2. Generates a unique kebab-case `id` (e.g. `jane-smith`)
3. Appends to `data/profiles.json`
4. Prints the avatar path to copy your photo to

---

## Data structure (`data/profiles.json`)

```jsonc
{
  "profiles": [
    {
      "id": "jane-smith",           // kebab-case, URL-safe
      "cardId": "<uuid>",           // for visit cards (future use)
      "personal": { "name": "...", "title": "...", "email": "...", ... },
      "summary": "...",
      "experience": [ { "id": "...", "company": "...", "bullets": [...], ... } ],
      "skills": { "backend": ["TypeScript", ...], "cloud": ["AWS", ...] },
      "education": [ ... ],
      "certifications": [ ... ],
      "awards": [ ... ],
      "languages": [ { "language": "English", "level": "Fluent" } ]
    }
  ]
}
```

---

## Environment variables

| Variable             | Default                              | Description                     |
|----------------------|--------------------------------------|---------------------------------|
| `PROFILES_JSON_PATH` | `../data/profiles.json` (from cwd)   | Path to the profiles JSON file  |

In Docker, `PROFILES_JSON_PATH=/data/profiles.json` is set automatically and the `data/` directory is mounted as a read-only volume.

---

## Tech stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Next.js 15, React 19, TailwindCSS |
| Data     | `data/profiles.json`              |
| Container| Docker, Docker Compose            |
