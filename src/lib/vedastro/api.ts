import {
  PanchangRequest,
  KundaliRequest,
  MatchmakingRequest,
} from './types';
import {
  VedAstroPanchangResponse,
  VedAstroKundaliResponse,
  VedAstroMatchmakingResponse,
} from '@/types/api';
import { calculatePanchang, calculateKundali, calculateMatchmaking } from '../vedic-math';
import { resolveTimezoneOffset } from '../utils/timezone';

export async function fetchPanchang(
  request: PanchangRequest
): Promise<VedAstroPanchangResponse> {
  const dateParts = request.date.split('-').map(Number);
  const hour = 12;

  const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], hour, 0));
  const tzOffset = resolveTimezoneOffset(request.timezone || '+05:30');
  date.setMinutes(date.getMinutes() - (tzOffset * 60));

  const result = calculatePanchang(date, {
    latitude: request.latitude,
    longitude: request.longitude,
    timezone: request.timezone,
  });

  return {
    tithi: result.tithi,
    nakshatra: result.nakshatra,
    yoga: result.yoga,
    karana: result.karana,
    vara: result.vara,
    masa: result.masa,
    teluguMasa: result.teluguMasa,
    samvatsara: result.samvatsara,
    paksha: result.paksha,
    sunrise: result.sunrise,
    sunset: result.sunset,
    rahuKalam: result.rahuKalam,
    yamagandam: result.yamagandam,
    gulikaKalam: result.gulikaKalam,
    abhijitMuhurtham: result.abhijitMuhurtham,
  };
}

export async function fetchKundali(
  request: KundaliRequest
): Promise<VedAstroKundaliResponse> {
  const dateParts = request.birthDate.split('-').map(Number);
  const timeParts = request.birthTime.split(':').map(Number);

  const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]));
  const tzOffset = resolveTimezoneOffset(request.timezone || '+05:30');
  date.setMinutes(date.getMinutes() - (tzOffset * 60));

  const result = calculateKundali(date, {
    latitude: request.latitude,
    longitude: request.longitude,
    timezone: request.timezone,
  });

  return result;
}

export async function fetchMatchmaking(
  request: MatchmakingRequest
): Promise<VedAstroMatchmakingResponse> {
  const buildDate = (person: { birthDate: string; birthTime: string; timezone?: string }) => {
    const dp = person.birthDate.split('-').map(Number);
    const tp = person.birthTime.split(':').map(Number);
    const d = new Date(Date.UTC(dp[0], dp[1] - 1, dp[2], tp[0], tp[1]));
    const offset = resolveTimezoneOffset(person.timezone || '+05:30');
    d.setMinutes(d.getMinutes() - (offset * 60));
    return d;
  };

  const person1Date = buildDate(request.person1);
  const person2Date = buildDate(request.person2);

  const kundali1 = calculateKundali(person1Date, {
    latitude: request.person1.latitude,
    longitude: request.person1.longitude,
    timezone: request.person1.timezone,
  });

  const kundali2 = calculateKundali(person2Date, {
    latitude: request.person2.latitude,
    longitude: request.person2.longitude,
    timezone: request.person2.timezone,
  });

  const moon1 = kundali1.planets.find(p => p.name === 'Moon');
  const moon2 = kundali2.planets.find(p => p.name === 'Moon');

  if (!moon1 || !moon2) {
    throw new Error('Could not calculate Moon positions');
  }

  const matchResult = calculateMatchmaking(moon1.longitude, moon2.longitude);

  return {
    gunaScore: matchResult.totalScore,
    maxGunas: matchResult.maxScore,
    compatibility: matchResult.compatibility,
    manglik: {
      person1: kundali1.isManglik,
      person2: kundali2.isManglik,
      compatible: !(kundali1.isManglik !== kundali2.isManglik),
    },
    details: {
      varna: matchResult.varna.score,
      vashya: matchResult.vashya.score,
      tara: matchResult.tara.score,
      yoni: matchResult.yoni.score,
      grahaMaitri: matchResult.grahaMaitri.score,
      gana: matchResult.gana.score,
      bhakoot: matchResult.bhakoot.score,
      nadi: matchResult.nadi.score,
    },
    recommendation: matchResult.recommendation,
  };
}
