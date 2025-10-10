export interface Event {
  id: string;
  owner: string;
  name: string;
  city: string;
  date: string;
  start_time: string;
  join_code: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  event_id: string;
  name: string;
  join_code: string;
  created_at: string;
}

export interface Member {
  id: string;
  team_id: string;
  nickname: string;
  user_id?: string;
  created_at: string;
}

export interface Stop {
  id: string;
  event_id: string;
  order_index: number;
  name: string;
  lat?: number;
  lon?: number;
  rule?: string;
  created_at: string;
}

export interface Score {
  id: string;
  event_id: string;
  team_id: string;
  stop_id: string;
  strokes: number;
  note?: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  event_id?: string;
  team_id?: string;
  name: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  nickname: string;
  body?: string;
  attachment_url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactions: any[];
  created_at: string;
}

export interface Pub {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
}

export interface LeaderboardEntry {
  team_id: string;
  team_name: string;
  total_strokes: number;
  completed_stops: number;
}
