// App configuration constants

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Srimaan Bhaskara Bharadwaja Astrology',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com',
  vedAstroApiUrl: process.env.NEXT_PUBLIC_VEDASTRO_API_URL || 'http://localhost:8000/api',
  vedAstroApiKey: process.env.VEDASTRO_API_KEY || process.env.NEXT_PUBLIC_VEDASTRO_API_KEY || '',
} as const;

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';
export const DEFAULT_LATITUDE = 17.3850; // Hyderabad
export const DEFAULT_LONGITUDE = 78.4867; // Hyderabad
