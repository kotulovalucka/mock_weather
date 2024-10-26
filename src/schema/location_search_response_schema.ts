import { z } from 'zod';

export const LocationSearchObjectResponseSchema = z.object({
	Key: z.string(),
	LocalizedName: z.string(),
	Country: z.object({
		ID: z.string(),
		LocalizedName: z.string(),
	}),
});

export const LocationSearchResponseSchema = z.array(
	LocationSearchObjectResponseSchema,
);
