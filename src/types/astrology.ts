// Astrology-related type definitions

export interface PanchangData {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  masa: string;
  paksha: string;
  rahuKalam: {
    start: string;
    end: string;
  };
  yamagandam: {
    start: string;
    end: string;
  };
  gulikaKalam: {
    start: string;
    end: string;
  };
  abhijitMuhurtham: {
    start: string;
    end: string;
  };
  sunrise: string;
  sunset: string;
}

export interface PlanetPosition {
  name: string;
  longitude: number;
  latitude: number;
  sign: string;
  house: number;
  nakshatra: {
    name: string;
    lord: string;
    padam: number;
  };
  nakshatraLord: string; // Keep for backward compatibility or derivation
  dignity: string;
}

export interface HouseData {
  number: number;
  sign: string;
  lord: string;
  planets: string[];
}

export interface KundaliData {
  personName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  planets: PlanetPosition[];
  houses: HouseData[];
  lagna: string;
  lagnaLord: string;
  moonSign: string;
  sunSign: string;
  isManglik?: boolean;
  nodeType?: string;
  dashas?: DashaData[];
  sankalpam?: string;
}

export interface DashaData {
  type: string;
  planet: string;
  startDate: string;
  endDate: string;
}

export interface MatchmakingData {
  person1Chart: KundaliData;
  person2Chart: KundaliData;
  gunaScore: number;
  maxGunas: number;
  compatibilityPercentage: number;
  manglikStatus: {
    person1: boolean;
    person2: boolean;
    compatible: boolean;
  };
  details: {
    varna: number;
    vashya: number;
    tara: number;
    yoni: number;
    grahaMaitri: number;
    gana: number;
    bhakoot: number;
    nadi: number;
  };
  recommendation: string;
}
