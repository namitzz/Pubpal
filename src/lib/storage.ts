// Simple localStorage-based storage for a single event
// This replaces the Supabase database with browser storage

export interface EventData {
  name: string;
  city: string;
  date: string;
  start_time: string;
  owner: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
}

export interface Member {
  id: string;
  team_id: string;
  nickname: string;
  created_at: string;
}

export interface Stop {
  id: string;
  name: string;
  rule?: string;
  order_index: number;
  created_at: string;
}

export interface Score {
  id: string;
  team_id: string;
  stop_id: string;
  strokes: number;
  created_at: string;
}

export interface LeaderboardEntry {
  team_id: string;
  team_name: string;
  total_strokes: number;
  completed_stops: number;
}

const STORAGE_KEYS = {
  EVENT: 'pubpal_event',
  TEAMS: 'pubpal_teams',
  MEMBERS: 'pubpal_members',
  STOPS: 'pubpal_stops',
  SCORES: 'pubpal_scores',
};

// Helper to generate random IDs
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to generate random join codes
export function generateJoinCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Event functions
export function getEvent(): EventData | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.EVENT);
  return data ? JSON.parse(data) : null;
}

export function saveEvent(event: Omit<EventData, 'created_at'>): EventData {
  const eventData: EventData = {
    ...event,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.EVENT, JSON.stringify(eventData));
  return eventData;
}

export function clearEvent(): void {
  localStorage.removeItem(STORAGE_KEYS.EVENT);
}

// Team functions
export function getTeams(): Team[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
  return data ? JSON.parse(data) : [];
}

export function getTeamByCode(joinCode: string): Team | null {
  const teams = getTeams();
  return teams.find(t => t.join_code === joinCode) || null;
}

export function addTeam(name: string): Team {
  const teams = getTeams();
  const newTeam: Team = {
    id: generateId(),
    name,
    join_code: generateJoinCode(),
    created_at: new Date().toISOString(),
  };
  teams.push(newTeam);
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  return newTeam;
}

export function clearTeams(): void {
  localStorage.removeItem(STORAGE_KEYS.TEAMS);
}

// Member functions
export function getMembers(teamId?: string): Member[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
  const members: Member[] = data ? JSON.parse(data) : [];
  return teamId ? members.filter(m => m.team_id === teamId) : members;
}

export function addMember(teamId: string, nickname: string): Member {
  const members = getMembers();
  const newMember: Member = {
    id: generateId(),
    team_id: teamId,
    nickname,
    created_at: new Date().toISOString(),
  };
  members.push(newMember);
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  return newMember;
}

export function clearMembers(): void {
  localStorage.removeItem(STORAGE_KEYS.MEMBERS);
}

// Stop functions
export function getStops(): Stop[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.STOPS);
  const stops: Stop[] = data ? JSON.parse(data) : [];
  return stops.sort((a, b) => a.order_index - b.order_index);
}

export function addStop(name: string, rule?: string): Stop {
  const stops = getStops();
  const newStop: Stop = {
    id: generateId(),
    name,
    rule,
    order_index: stops.length,
    created_at: new Date().toISOString(),
  };
  stops.push(newStop);
  localStorage.setItem(STORAGE_KEYS.STOPS, JSON.stringify(stops));
  return newStop;
}

export function deleteStop(stopId: string): void {
  let stops = getStops();
  stops = stops.filter(s => s.id !== stopId);
  // Reorder remaining stops
  stops.forEach((stop, index) => {
    stop.order_index = index;
  });
  localStorage.setItem(STORAGE_KEYS.STOPS, JSON.stringify(stops));
  
  // Also remove scores for this stop
  const scores = getScores();
  const filteredScores = scores.filter(s => s.stop_id !== stopId);
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(filteredScores));
}

export function clearStops(): void {
  localStorage.removeItem(STORAGE_KEYS.STOPS);
}

// Score functions
export function getScores(teamId?: string): Score[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.SCORES);
  const scores: Score[] = data ? JSON.parse(data) : [];
  return teamId ? scores.filter(s => s.team_id === teamId) : scores;
}

export function updateScore(teamId: string, stopId: string, strokes: number): Score {
  const scores = getScores();
  const existingIndex = scores.findIndex(
    s => s.team_id === teamId && s.stop_id === stopId
  );

  if (existingIndex >= 0) {
    scores[existingIndex].strokes = strokes;
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  } else {
    const newScore: Score = {
      id: generateId(),
      team_id: teamId,
      stop_id: stopId,
      strokes,
      created_at: new Date().toISOString(),
    };
    scores.push(newScore);
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  }

  return scores.find(s => s.team_id === teamId && s.stop_id === stopId)!;
}

export function clearScores(): void {
  localStorage.removeItem(STORAGE_KEYS.SCORES);
}

// Leaderboard calculation
export function getLeaderboard(): LeaderboardEntry[] {
  const teams = getTeams();
  const scores = getScores();

  const leaderboardMap = new Map<string, LeaderboardEntry>();

  teams.forEach(team => {
    leaderboardMap.set(team.id, {
      team_id: team.id,
      team_name: team.name,
      total_strokes: 0,
      completed_stops: 0,
    });
  });

  scores.forEach(score => {
    const entry = leaderboardMap.get(score.team_id);
    if (entry && score.strokes > 0) {
      entry.total_strokes += score.strokes;
      entry.completed_stops += 1;
    }
  });

  return Array.from(leaderboardMap.values())
    .sort((a, b) => a.total_strokes - b.total_strokes);
}

// Clear all data
export function clearAllData(): void {
  clearEvent();
  clearTeams();
  clearMembers();
  clearStops();
  clearScores();
}
