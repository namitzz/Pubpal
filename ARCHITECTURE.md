# PubPal Architecture

## Overview

PubPal is a full-stack Progressive Web App (PWA) built with modern web technologies for managing pub golf crawls and party coordination.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Leaflet** - Interactive maps
- **React Leaflet** - React components for Leaflet

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (ready for implementation)
  - Storage (for future image uploads)

### External APIs
- **Overpass API** - OpenStreetMap data for pub discovery

### Development & Testing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting

### Deployment
- **Vercel** - Hosting and deployment
- **GitHub Actions** - CI/CD pipeline

## Project Structure

```
Pubpal/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── discover/          # Pub discovery page
│   │   ├── event/new/         # Create event page
│   │   ├── e/[code]/          # Event hub pages
│   │   │   ├── page.tsx       # Event details
│   │   │   ├── chat/          # Event chat
│   │   │   ├── stops/         # Manage stops
│   │   │   └── team/new/      # Create team
│   │   └── team/[teamCode]/   # Team page with scorecard
│   ├── components/            # Reusable React components
│   │   ├── Map.tsx           # Leaflet map component
│   │   ├── EmojiPicker.tsx   # Emoji selection
│   │   ├── Confetti.tsx      # Celebration animation
│   │   ├── Loading.tsx       # Loading state
│   │   ├── ErrorPage.tsx     # Error display
│   │   └── PWARegister.tsx   # Service worker registration
│   ├── lib/                   # Utility functions
│   │   ├── supabase.ts       # Supabase client
│   │   └── overpass.ts       # Overpass API integration
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # Shared types
│   └── test/                  # Test files
│       ├── setup.ts          # Test setup
│       └── supabase.test.ts  # Unit tests
├── public/                    # Static assets
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   └── robots.txt            # SEO robots file
├── .github/workflows/        # GitHub Actions
│   └── ci.yml               # CI pipeline
└── config files              # Various config files
```

## Database Schema

### Tables

1. **events** - Pub crawl events
   - id (UUID, PK)
   - owner, name, city, date, start_time
   - join_code (unique)

2. **teams** - Teams within events
   - id (UUID, PK)
   - event_id (FK to events)
   - name, join_code (unique)

3. **members** - Team members
   - id (UUID, PK)
   - team_id (FK to teams)
   - nickname, user_id

4. **stops** - Pub stops in crawl
   - id (UUID, PK)
   - event_id (FK to events)
   - order_index, name, lat, lon, rule

5. **scores** - Team scores per stop
   - id (UUID, PK)
   - event_id, team_id, stop_id (FKs)
   - strokes, note
   - Unique constraint: (team_id, stop_id)

6. **chat_rooms** - Chat rooms for events/teams
   - id (UUID, PK)
   - event_id or team_id (FK, mutually exclusive)
   - name

7. **chat_messages** - Chat messages
   - id (UUID, PK)
   - room_id (FK to chat_rooms)
   - nickname, body, attachment_url
   - reactions (JSONB)

## Key Features

### 1. Real-time Updates
- Supabase Realtime for instant chat messages
- Leaderboard updates when scores change
- All clients receive updates simultaneously

### 2. Progressive Web App
- Service worker for offline capability
- Installable on mobile devices
- App-like experience

### 3. Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interfaces

### 4. Join Code System
- 6-character alphanumeric codes
- Unique codes for events and teams
- Easy sharing via URL

### 5. Pub Discovery
- Geolocation-based search
- Overpass API integration
- Interactive map display

## Data Flow

### Creating an Event
1. User fills form → Client validation
2. Generate unique join code
3. Insert to Supabase `events` table
4. Create default chat room
5. Redirect to event page

### Real-time Chat
1. User sends message
2. Insert to `chat_messages` table
3. Supabase broadcasts to subscribed clients
4. All users see message instantly

### Scoring & Leaderboard
1. Team updates score for a stop
2. Upsert to `scores` table
3. Leaderboard re-calculates totals
4. Sorted by lowest strokes (golf rules)

## Performance Optimizations

- Static page generation where possible
- Dynamic imports for map components
- Image optimization through Next.js
- Efficient database indexes
- Caching via service worker

## Security Considerations

- Row Level Security (RLS) policies in Supabase
- Environment variables for sensitive data
- Client-side validation
- Server-side data sanitization ready

## Future Enhancements

1. **User Authentication**
   - Supabase Auth integration
   - User profiles
   - Event ownership

2. **Image Uploads**
   - Photo sharing in chat
   - Supabase Storage integration
   - Automatic image optimization

3. **Advanced Features**
   - Push notifications
   - QR code scanning for join codes
   - Route optimization for stops
   - Weather integration
   - Social media sharing

4. **Analytics**
   - Event statistics
   - Popular pubs
   - User engagement metrics

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Testing**
   ```bash
   npm test
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Deploy**
   - Push to GitHub
   - Automatic Vercel deployment
   - CI/CD via GitHub Actions

## Monitoring & Maintenance

- GitHub Actions for CI
- Vercel deployment logs
- Supabase dashboard for database monitoring
- Error tracking via console logs (can add Sentry)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - See [LICENSE](LICENSE) for details.
