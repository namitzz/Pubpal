# 🍻 PubPal - Pub Golf Crawl Manager

A simple, single-event pub golf crawl manager that helps you organize bar stops, create teams, and maintain a scoreboard - all stored locally in your browser!

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![LocalStorage](https://img.shields.io/badge/Storage-Browser-green)

## ✨ Features

- 🗺️ **Discover Nearby Pubs** - Find pubs and bars using geolocation & OpenStreetMap/Overpass API
- 🎉 **Create Event** - Simple event creation for your pub crawl
- 🍺 **Manage Bar Stops** - Add and organize pub stops with custom rules
- 👥 **Team Management** - Create multiple teams with unique join codes
- ⛳ **Score Tracking** - Track scores for each team at every stop
- 🏆 **Live Leaderboard** - See rankings updated as scores are entered
- 📱 **Mobile-First PWA** - Works perfectly on iPhone and Android, installable as PWA
- 🎨 **Gen-Z UI** - Bright gradients, glassmorphism, playful emojis, smooth animations
- 💾 **No Database Required** - Everything stored in browser localStorage

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS, Framer Motion
- **Maps:** Leaflet + React Leaflet for interactive maps
- **Storage:** Browser localStorage (no backend required)
- **Deploy:** Vercel or any static hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
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

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app! 🎉

**That's it!** No database setup, no environment variables - just install and run!

## 📊 How It Works

All data is stored in your browser's localStorage:

- **Event** - Single event details (name, date, location, organizer)
- **Stops** - List of pub/bar stops with custom rules
- **Teams** - Multiple teams with unique join codes
- **Members** - Team members
- **Scores** - Score tracking for each team at each stop

## 📱 Core Pages

- `/` - Home (Create Event, View Event, Discover Pubs)
- `/discover` - Interactive map of nearby pubs
- `/event/new` - Create a new pub crawl event
- `/event` - Event hub (stops, teams, leaderboard)
- `/stops` - Manage bar stops
- `/team/new` - Create a new team
- `/team/[teamCode]` - Team view with scorecard and member management

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
3. Deploy! ✨ (No environment variables needed)

### PWA Installation

Users can install PubPal as a Progressive Web App on their mobile devices for a native app experience.

## 💡 Usage Guide

### For Event Organizers

1. **Create Event** - Fill in your event details (name, date, city)
2. **Add Stops** - Add pub/bar stops with custom rules (e.g., "Order a pint, 5 strokes")
3. **Share Team Codes** - Create teams and share the join codes with participants
4. **View Leaderboard** - Watch the competition unfold in real-time

### For Participants

1. **Join a Team** - Get the team code from your organizer
2. **Track Scores** - Enter your scores at each stop
3. **Add Members** - Add your team members to the roster
4. **Check Leaderboard** - See how your team ranks

## 🔒 Data Privacy

All data is stored locally in your browser:
- No data is sent to external servers
- No account creation required
- Data persists until you clear browser storage
- Each user/browser has their own data

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