# PubPal Setup Guide

Complete guide to getting PubPal up and running.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git

## Step-by-Step Setup

### 1. Clone and Install

```bash
git clone https://github.com/namitzz/Pubpal.git
cd Pubpal
npm install --legacy-peer-deps
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (2-3 minutes)
3. Go to Project Settings > API
   - Copy your `Project URL`
   - Copy your `anon/public` key

### 3. Database Schema

1. In Supabase Dashboard, go to SQL Editor
2. Create a new query
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and run the query
5. Verify all tables were created successfully

### 4. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Testing

Run the test suite:
```bash
npm test
```

Build for production:
```bash
npm run build
```

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Manual Deploy

```bash
npm install -g vercel
vercel
```

## Supabase Storage Setup (Optional)

For image uploads in chat:

1. Go to Supabase Dashboard > Storage
2. Create a new bucket called `chat-images`
3. Set it to public access
4. Update policies as needed

## Troubleshooting

### Build Errors

If you encounter dependency issues:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Supabase Connection Issues

- Verify your API keys are correct
- Check if Supabase project is active
- Ensure RLS policies are enabled

### Map Not Loading

- Ensure you have an internet connection
- Overpass API might be rate-limited, try again later
- Check browser console for errors

## Features Overview

### Creating an Event
1. Click "Create Event" on home page
2. Fill in event details (name, city, date, time)
3. Share the generated join code with friends

### Managing Stops
1. Open your event
2. Click "Add Stop"
3. Add pub names and custom rules
4. Stops appear in order for all teams

### Team Scoring
1. Create or join a team
2. Navigate to team page
3. Enter scores for each stop
4. Watch the leaderboard update in real-time

### Group Chat
1. Open event chat
2. Set your nickname
3. Send messages and emojis
4. Messages update in real-time for all participants

## Need Help?

- Check the [README.md](README.md) for more information
- Open an issue on GitHub
- Review the [CONTRIBUTING.md](CONTRIBUTING.md) guide

Happy pub crawling! 🍻
