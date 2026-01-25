# VedAstro API Integration Guide

## API Endpoints

Based on the VedAstro API Builder documentation, here are the main endpoints:

### 1. Horoscope Predictions
- **Endpoint**: `/api/Horoscope/Predictions`
- **Method**: POST
- **Description**: Given a birth time, calculate all matching horoscope predictions
- **Parameters**:
  - Birth date/time
  - Location (latitude/longitude)
  - Chart type (BhavaChalit, RasiD1, HoraD2, etc.)

### 2. Indian Chart (SVG)
- **Endpoint**: `/api/Chart/Indian`
- **Method**: GET/POST
- **Description**: Generate a South or North Indian D-chart as an SVG image file
- **Parameters**:
  - Birth details
  - Chart type (South/North Indian)
  - Format (SVG)

### 3. Match Checker (Kuta)
- **Endpoint**: `/api/Match/Kuta`
- **Method**: POST
- **Description**: Get full kuta match data for two horoscopes
- **Parameters**:
  - Person 1 birth details
  - Person 2 birth details

## API Configuration

### Base URL
- Default: `https://api.vedastro.org` or `https://vedastro.org/api`
- Check VedAstro documentation for the exact base URL

### Authentication
- API Key required for authenticated requests
- Pass API key as query parameter or header
- Format: `?api_key=YOUR_API_KEY` or `Authorization: Bearer YOUR_API_KEY`

### Rate Limits
- Free tier: Limited requests per day
- Pay-per-use: $0.01 per call for unlimited speed
- Check your subscription plan for exact limits

## Request Format Examples

### Panchang Request
```json
{
  "date": "2026-01-12",
  "latitude": 17.3850,
  "longitude": 78.4867,
  "timezone": "Asia/Kolkata"
}
```

### Kundali/Horoscope Request
```json
{
  "name": "John Doe",
  "birthDate": "1990-01-15",
  "birthTime": "10:30",
  "latitude": 17.3850,
  "longitude": 78.4867,
  "timezone": "Asia/Kolkata",
  "chartType": "RasiD1"
}
```

### Matchmaking Request
```json
{
  "person1": {
    "birthDate": "1990-01-15",
    "birthTime": "10:30",
    "latitude": 17.3850,
    "longitude": 78.4867
  },
  "person2": {
    "birthDate": "1992-05-20",
    "birthTime": "14:45",
    "latitude": 17.3850,
    "longitude": 78.4867
  }
}
```

## Response Format

### Panchang Response
```json
{
  "tithi": "Chaturthi",
  "nakshatra": "Ashwini",
  "yoga": "Vajra",
  "karana": "Bava",
  "masa": "Pausha",
  "paksha": "Shukla",
  "rahuKalam": {
    "start": "10:30",
    "end": "12:00"
  },
  "sunrise": "06:30",
  "sunset": "18:00"
}
```

### Kundali Response
```json
{
  "planets": [
    {
      "name": "Sun",
      "longitude": 285.5,
      "sign": "Capricorn",
      "house": 10,
      "nakshatra": "Uttara Ashadha"
    }
  ],
  "houses": [
    {
      "number": 1,
      "sign": "Aries",
      "lord": "Mars"
    }
  ],
  "lagna": "Aries",
  "lagnaLord": "Mars"
}
```

### Matchmaking Response
```json
{
  "gunaScore": 20,
  "maxGunas": 36,
  "compatibility": 55.5,
  "manglik": {
    "person1": false,
    "person2": true,
    "compatible": true
  },
  "details": {
    "varna": 1,
    "vashya": 2,
    "tara": 3,
    "yoni": 2,
    "grahaMaitri": 4,
    "gana": 3,
    "bhakoot": 2,
    "nadi": 3
  }
}
```

## Error Handling

### Common Error Codes
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Invalid or missing API key
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - API server error

### Error Response Format
```json
{
  "error": true,
  "message": "Error description",
  "code": 400
}
```

## Implementation Notes

1. **Date Format**: Use ISO 8601 format (YYYY-MM-DD) for dates
2. **Time Format**: Use 24-hour format (HH:mm) for times
3. **Coordinates**: Decimal degrees (e.g., 17.3850, 78.4867)
4. **Timezone**: IANA timezone format (e.g., "Asia/Kolkata")
5. **Chart Types**: 
   - `BhavaChalit` - Bhava Chalit chart
   - `RasiD1` - Rasi chart (D1)
   - `HoraD2` - Hora chart (D2)
   - `DrekkanaD3` - Drekkana chart (D3)
   - And more...

## Testing

Use tools like Postman or curl to test API endpoints:

```bash
curl -X POST "https://api.vedastro.org/api/Horoscope/Predictions?api_key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1990-01-15",
    "birthTime": "10:30",
    "latitude": 17.3850,
    "longitude": 78.4867
  }'
```

## Support

For API issues or questions:
- Check VedAstro API documentation
- Contact VedAstro support
- Review API status page
