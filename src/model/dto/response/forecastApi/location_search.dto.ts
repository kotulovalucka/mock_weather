import type {
	LocationSearchObjectResponseSchema,
	LocationSearchResponseSchema,
} from '../../../../schema/client/location_search_response_schema.ts';
import { z } from 'zod';

export type LocationSearchResponseDto = z.infer<typeof LocationSearchResponseSchema>;

export type SingleLocationSearchResponseDto = z.infer<typeof LocationSearchObjectResponseSchema>;
