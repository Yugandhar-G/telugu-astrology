// Date, time, and data formatting utilities

import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return '';
  }
}

export function formatTime(time: string, timezone: string = 'Asia/Kolkata'): string {
  try {
    const today = new Date();
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(today);
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    
    return formatInTimeZone(dateTime, timezone, 'HH:mm');
  } catch {
    return time;
  }
}

export function formatDateTime(
  dateTime: string | Date,
  formatStr: string = 'yyyy-MM-dd HH:mm',
  timezone: string = 'Asia/Kolkata'
): string {
  try {
    const dateObj = typeof dateTime === 'string' ? parseISO(dateTime) : dateTime;
    return formatInTimeZone(dateObj, timezone, formatStr);
  } catch {
    return '';
  }
}

export function formatTeluguDate(date: string | Date): string {
  const months = [
    'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్',
    'మే', 'జూన్', 'జూలై', 'ఆగస్టు',
    'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'
  ];
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return '';
  }
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
}
