

export interface MoodOption {
  emoji: string;
  label: string;
  value: number;
  color: string;
}

export interface MoodEntry {
  date: string;
  mood: number;
  notes: string;
  tags: string[];
  timestamp?: string;
}

export interface ChartDataPoint {
  date: string;
  mood: number;
  fullDate: string;
}

export interface MoodGraphEntry {
  _id: string;
  date: string;       // "2025-09-01"
  mood: number;       // 1–5
  notes?: string;     // optional
  tags: string[];
  timestamp: string;  // ISO string
  __v?: number;
}

export interface MoodGraphApiResponse {
  data: MoodGraphEntry[];
}
