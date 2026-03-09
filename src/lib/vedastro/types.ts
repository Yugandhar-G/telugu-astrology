export interface PanchangRequest {
  date: string; // YYYY-MM-DD
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface KundaliRequest {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface MatchmakingRequest {
  person1: KundaliRequest;
  person2: KundaliRequest;
}
