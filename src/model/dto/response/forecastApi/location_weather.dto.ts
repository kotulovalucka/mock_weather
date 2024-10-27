import type { LocationWeatherResponseSchema } from '../../../../schema/client/location_weather_response_schema.ts';
import { z } from 'zod';

export type LocationWeatherResponseDto = z.infer<typeof LocationWeatherResponseSchema>;
