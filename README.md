# SWABFLIX

A full-featured Netflix-style streaming app built with React, TypeScript, and the TMDB API. Browse movies and TV shows, watch trailers, stream content, manage your list, and track watch history — all in a sleek dark UI.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---
<img width="1470" height="834" alt="image" src="https://github.com/user-attachments/assets/63abfa55-f9f4-48fc-ae25-c4b88a74caf4" />


## Features

**Browse & Discover**
- Trending, popular, top-rated, and upcoming content
- Separate pages for Movies, TV Shows, and New & Popular
- Top 10 ranked row with numbered badges
- Genre-based category rows
- Multi-search across movies and TV shows

**TV Show Support**
- Full season and episode browser
- Episode thumbnails, descriptions, and runtimes
- Season selector dropdown
- Stream any episode directly

  <img width="1463" height="801" alt="image" src="https://github.com/user-attachments/assets/4760af9f-d4e8-41ea-bf5b-90bba5f0288c" />


**Streaming & Trailers**
- Stream movies and TV episodes via embedded player
- YouTube trailers auto-play in hero section and movie details
- Mute/unmute toggle for background trailers

**Personal Library**
- My List — save movies and shows (persisted in localStorage)
- Continue Watching — automatic watch history tracking
- Dedicated My List page with grid view

**UI/UX**
- Fully responsive (mobile, tablet, desktop)
- Mobile hamburger menu with slide-out drawer
- Skeleton loading placeholders
- Smooth page transitions (Framer Motion)
- Notification dropdown with new arrivals
- Profile dropdown menu
- Netflix-style hover cards and carousels

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| API | TMDB (The Movie Database) |
| Streaming | VidSrc embeds |

---

## Project Structure

```
src/
├── components/
│   ├── ContentGrid.tsx        # Grid layout for My List page
│   ├── HeroSection.tsx        # Featured movie/show banner with trailer
│   ├── MobileMenu.tsx         # Hamburger slide-out menu
│   ├── MovieCard.tsx          # Individual movie/show card
│   ├── MovieCarousel.tsx      # Horizontal scrollable row
│   ├── MovieModal.tsx         # Detail modal with episodes & trailers
│   ├── Navbar.tsx             # Top navigation bar
│   ├── NotificationDropdown.tsx
│   ├── ProfileDropdown.tsx
│   ├── SearchBar.tsx          # Multi-search (movies + TV)
│   ├── SkeletonLoader.tsx     # Loading placeholders
│   ├── TopTenCard.tsx         # Numbered ranking cards
│   └── VideoPlayer.tsx        # Full-screen streaming player
├── hooks/
│   ├── useMovies.ts           # Content fetching by page type
│   ├── useMyList.ts           # Saved list management
│   ├── useSearch.ts           # Search across movies & TV
│   └── useWatchHistory.ts     # Watch history tracking
├── services/
│   ├── api.ts                 # TMDB API client
│   ├── streaming.ts           # Streaming URL resolver
│   └── tmdb.ts                # TMDB endpoints & data mappers
├── types/
│   └── index.ts               # TypeScript interfaces
├── App.tsx                    # Root component & routing
├── index.css                  # Global styles
└── index.tsx                  # Entry point
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [TMDB API key](https://www.themoviedb.org/settings/api)

### Setup

```bash
# Clone the repo
git clone https://github.com/Swabir001/swabflix.git
cd swabflix

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your TMDB API keys

# Start dev server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_TMDB_API_KEY` | TMDB API v4 Bearer token |
| `VITE_TMDB_API_KEY_V3` | TMDB API v3 key |

### Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy this folder to any static host (Render, Vercel, Netlify, etc.).

---

## Deployment on Render

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Static Site**
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. Add environment variables (`VITE_TMDB_API_KEY`, `VITE_TMDB_API_KEY_V3`)
6. Deploy

---

## Pages

| Page | Description |
|------|-------------|
| **Home** | Trending content, Continue Watching, My List row, Top 10, genre rows |
| **TV Shows** | TV-only content — trending, popular, top-rated, by genre |
| **Movies** | Movie-only content — popular, top-rated, genre categories |
| **New & Popular** | Now playing, upcoming, airing today |
| **My List** | Full grid of saved movies and shows |

---

## License

This project is for personal/educational use. Movie and TV data provided by [TMDB](https://www.themoviedb.org/). TMDB is not affiliated with this project.

---

Built by **Swabir**
