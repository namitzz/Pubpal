# 🍻 PubPal - Pub Golf Crawl & Party Chat App

A full-stack web app that helps friends plan and play pub golf bar crawls with real-time chat, scoring, and nearby pub discovery.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Powered-3ecf8e)

## ✨ Features

- 🗺️ **Discover Nearby Pubs** - Find pubs and bars using geolocation & OpenStreetMap/Overpass API
- 🎉 **Create/Join Events** - Auto-generated join codes and shareable links
- 👥 **Team Management** - Create teams with unique join codes
- ⛳ **Pub Golf Rules** - Set custom rules for each stop (drink type, strokes, dares)
- 🏆 **Live Leaderboard** - Real-time scoring and rankings
- 💬 **Group Chat** - Real-time chat with image uploads and emoji reactions
- 📱 **Mobile-First PWA** - Works perfectly on iPhone and Android, installable as PWA
- 🎨 **Gen-Z UI** - Bright gradients, glassmorphism, playful emojis, smooth animations

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion
- **Maps:** Leaflet + React Leaflet for interactive maps
- **Backend/DB:** Supabase (Auth, Postgres, Realtime, Storage)
- **Realtime:** Supabase Realtime Channels for chat
- **Deploy:** Vercel (auto-deploy from GitHub)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/namitzz/Pubpal.git
cd Pubpal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to find your credentials
3. Go to SQL Editor and run the schema from `supabase-schema.sql`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

See `.env.example` for reference.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app! 🎉

## 📊 Database Schema

The app uses the following Supabase tables:

- **events** - Pub crawl events with join codes
- **teams** - Teams participating in events
- **members** - Team members
- **stops** - Pub stops in the crawl with custom rules
- **scores** - Team scores at each stop
- **chat_rooms** - Chat rooms for events/teams
- **chat_messages** - Real-time chat messages

See `supabase-schema.sql` for the complete schema with indexes and RLS policies.

## 📱 Core Pages

- `/` - Home (Create Event, Join Event, Discover Pubs)
- `/discover` - Interactive map of nearby pubs
- `/event/new` - Create a new pub crawl event
- `/e/[code]` - Event hub (stops, teams, leaderboard, chat)
- `/team/[teamCode]` - Team view with scorecard

## 🎨 Styling

The app features a vibrant Gen-Z aesthetic with:

- Purple-to-pink-to-blue gradients
- Glassmorphism effects (blurred backgrounds)
- Rounded corners (2xl)
- Smooth animations via Framer Motion
- Poppins font family
- Drink-themed emojis throughout

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repo on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy! ✨

The `vercel.json` file is pre-configured for Next.js deployment.

**Note:** This app uses Next.js dynamic routes and server-side features, so it requires a hosting platform that supports server-side rendering (like Vercel). Static hosting platforms (like GitHub Pages) are not compatible with this application.

### PWA Installation

Users can install PubPal as a Progressive Web App on their mobile devices for a native app experience.

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

### Run Tests

```bash
npm test
```

### Continuous Integration

The repository includes a GitHub Actions CI workflow that automatically:
- Runs linting checks
- Executes tests
- Builds the project

The CI workflow runs on pushes and pull requests to `main` and `develop` branches. Make sure to add your Supabase credentials as repository secrets (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) for the build step to work properly.

## 🗺️ API Integration

### Overpass API (Pub Discovery)

The app uses the Overpass API to fetch nearby pubs and bars based on the user's location. The integration is in `src/lib/overpass.ts`.

Query parameters:
- Searches for `amenity=pub` and `amenity=bar`
- Default radius: 2000 meters
- Returns name, coordinates, and address

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for your own pub crawls!

## 🎉 Have Fun!

May your pub golf scores be low and your drinks be plenty! 🍺⛳

---

Made with 💜 for legendary pub crawls