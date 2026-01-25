// API response type definitions

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface VedAstroPanchangResponse {
  tithi?: string;
  nakshatra?: string;
  yoga?: string;
  karana?: string;
  masa?: string;
  paksha?: string;
  rahuKalam?: {
    start?: string;
    end?: string;
  };
  sunrise?: string;
  sunset?: string;
  [key: string]: any;
}

export interface VedAstroKundaliResponse {
  planets?: Array<{
    name?: string;
    longitude?: number;
    latitude?: number;
    sign?: string;
    house?: number;
    nakshatra?: string | { name: string; lord: string; padam: number };
    [key: string]: any;
  }>;
  houses?: Array<{
    number?: number;
    sign?: string;
    lord?: string;
    [key: string]: any;
  }>;
  lagna?: string;
  lagnaLord?: string;
  [key: string]: any;
}

export interface VedAstroMatchmakingResponse {
  gunaScore?: number;
  maxGunas?: number;
  compatibility?: number;
  manglik?: {
    person1?: boolean;
    person2?: boolean;
    compatible?: boolean;
  };
  details?: {
    varna?: number;
    vashya?: number;
    tara?: number;
    yoni?: number;
    grahaMaitri?: number;
    gana?: number;
    bhakoot?: number;
    nadi?: number;
  };
  [key: string]: any;
}
