import tzlookup from 'tz-lookup';

/**
 * Resolves IANA timezone name from latitude/longitude.
 * Falls back to 'Asia/Kolkata' on invalid input.
 */
export function getTimezoneFromCoords(latitude: number, longitude: number): string {
    try {
        return tzlookup(latitude, longitude);
    } catch {
        return 'Asia/Kolkata';
    }
}

/**
 * Resolves any timezone identifier to a numeric UTC offset in hours.
 * Supports IANA names (e.g. 'America/New_York'), ±HH:MM strings, and abbreviations.
 * Uses the Intl API for full IANA coverage rather than a hardcoded map.
 */
export function resolveTimezoneOffset(tz: string | undefined, referenceDate?: Date): number {
    if (!tz) return 5.5; // Default IST

    // Handle ±HH:MM format directly
    const match = tz.match(/^([+-])(\d{1,2}):(\d{2})$/);
    if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        return sign * (parseInt(match[2], 10) + parseInt(match[3], 10) / 60);
    }

    // Handle numeric strings
    const num = parseFloat(tz);
    if (!isNaN(num) && tz.match(/^-?\d+(\.\d+)?$/)) {
        return num;
    }

    // Handle common abbreviations not recognized by Intl
    const abbreviations: Record<string, number> = {
        'IST': 5.5,
        'UTC': 0,
        'GMT': 0,
        'EST': -5,
        'EDT': -4,
        'CST': -6,
        'CDT': -5,
        'MST': -7,
        'MDT': -6,
        'PST': -8,
        'PDT': -7,
        'GST': 4, // Gulf Standard Time
        'AEDT': 11,
        'AEST': 10,
    };

    if (abbreviations[tz] !== undefined) {
        return abbreviations[tz];
    }

    // Use Intl API for full IANA timezone resolution
    try {
        const ref = referenceDate || new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'longOffset',
        });

        const parts = formatter.formatToParts(ref);
        const tzPart = parts.find(p => p.type === 'timeZoneName');

        if (tzPart) {
            // Format is "GMT+HH:MM" or "GMT-HH:MM" or "GMT"
            const offsetStr = tzPart.value;
            if (offsetStr === 'GMT') return 0;
            const offsetMatch = offsetStr.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
            if (offsetMatch) {
                const sign = offsetMatch[1] === '-' ? -1 : 1;
                const hours = parseInt(offsetMatch[2], 10);
                const minutes = parseInt(offsetMatch[3] || '0', 10);
                return sign * (hours + minutes / 60);
            }
        }
    } catch {
        // Invalid IANA name, fall through to default
    }

    return 5.5; // Fallback to IST
}
