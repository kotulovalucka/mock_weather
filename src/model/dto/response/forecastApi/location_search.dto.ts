import type { LocationSearchResponseSchema } from '../../../../schema/location_search_response_schema.ts';
import { z } from 'zod';

export type LocationSearchResponseDto = z.infer<typeof LocationSearchResponseSchema>;
