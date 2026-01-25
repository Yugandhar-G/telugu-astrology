// Transform VedAstro API responses to our internal format

import {
  VedAstroPanchangResponse,
  VedAstroKundaliResponse,
  VedAstroMatchmakingResponse,
} from '@/types/api';
import {
  PanchangData,
  KundaliData,
  MatchmakingData,
  PlanetPosition,
  HouseData,
} from '@/types/astrology';

export function transformPanchangResponse(
  response: VedAstroPanchangResponse,
  date: string,
  latitude: number,
  longitude: number
): PanchangData {
  return {
    date,
    tithi: response.tithi || '',
    nakshatra: response.nakshatra || '',
    yoga: response.yoga || '',
    karana: response.karana || '',
    masa: response.masa || '',
    paksha: response.paksha || '',
    rahuKalam: {
      start: response.rahuKalam?.start || '',
      end: response.rahuKalam?.end || '',
    },
    yamagandam: {
      start: response.yamagandam?.start || '',
      end: response.yamagandam?.end || '',
    },
    gulikaKalam: {
      start: response.gulikaKalam?.start || '',
      end: response.gulikaKalam?.end || '',
    },
    abhijitMuhurtham: {
      start: response.abhijitMuhurtham?.start || '',
      end: response.abhijitMuhurtham?.end || '',
    },
    sunrise: response.sunrise || '',
    sunset: response.sunset || '',
  };
}

export function transformKundaliResponse(
  response: VedAstroKundaliResponse,
  personName: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string,
  latitude: number,
  longitude: number,
  timezone: string
): KundaliData {
  const planets: PlanetPosition[] = (response.planets || []).map((p: any) => ({
    name: p.name || '',
    longitude: p.longitude || 0,
    latitude: p.latitude || 0,
    sign: p.sign || '',
    house: p.house || 0,
    nakshatra: typeof p.nakshatra === 'object' ? p.nakshatra : { name: p.nakshatra || '', lord: '', padam: 0 },
    nakshatraLord: typeof p.nakshatra === 'object' ? p.nakshatra.lord : (p.nakshatraLord || ''),
    dignity: p.dignity || '',
  }));

  const houses: HouseData[] = (response.houses || []).map((h: any) => ({
    number: h.number || 0,
    sign: h.sign || '',
    lord: h.lord || '',
    planets: h.planets || [],
  }));

  return {
    personName,
    birthDate,
    birthTime,
    birthPlace,
    latitude,
    longitude,
    timezone,
    planets,
    houses,
    lagna: response.lagna || '',
    lagnaLord: response.lagnaLord || '',
    moonSign: response.moonSign || '',
    sunSign: response.sunSign || '',
  };
}

export function transformMatchmakingResponse(
  response: VedAstroMatchmakingResponse,
  person1Chart: KundaliData,
  person2Chart: KundaliData
): MatchmakingData {
  const gunaScore = response.gunaScore || 0;
  const maxGunas = response.maxGunas || 36;
  const compatibilityPercentage = response.compatibility || 0;

  return {
    person1Chart,
    person2Chart,
    gunaScore,
    maxGunas,
    compatibilityPercentage,
    manglikStatus: {
      person1: response.manglik?.person1 || false,
      person2: response.manglik?.person2 || false,
      compatible: response.manglik?.compatible || false,
    },
    details: {
      varna: response.details?.varna || 0,
      vashya: response.details?.vashya || 0,
      tara: response.details?.tara || 0,
      yoni: response.details?.yoni || 0,
      grahaMaitri: response.details?.grahaMaitri || 0,
      gana: response.details?.gana || 0,
      bhakoot: response.details?.bhakoot || 0,
      nadi: response.details?.nadi || 0,
    },
    recommendation: getRecommendation(gunaScore, maxGunas),
  };
}

function getRecommendation(gunaScore: number, maxGunas: number): string {
  const percentage = (gunaScore / maxGunas) * 100;

  if (percentage >= 75) {
    return 'అత్యుత్తమ అనుకూలత - వివాహం కోసం అనుకూలం';
  } else if (percentage >= 50) {
    return 'మంచి అనుకూలత - వివాహం కోసం అనుకూలం';
  } else if (percentage >= 30) {
    return 'మధ్యస్థ అనుకూలత - జాగ్రత్తగా పరిగణించండి';
  } else {
    return 'తక్కువ అనుకూలత - వివాహం కోసం అననుకూలం';
  }
}
