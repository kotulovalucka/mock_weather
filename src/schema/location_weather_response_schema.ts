import { z } from 'zod';

export const LocationWeatherResponseSchema = z.object({
	Headline: z.object({
		EffectiveDate: z.string(),
		Severity: z.number(),
		Text: z.string(),
		Category: z.string(),
		MobileLink: z.string(),
		Link: z.string(),
	}),
	DailyForecasts: z.array(
		z.object({
			Date: z.string(),
			Temperature: z.object({
				Minimum: z.object({
					Value: z.number(),
					Unit: z.string(),
				}),
				Maximum: z.object({
					Value: z.number(),
					Unit: z.string(),
				}),
			}),
			Day: z.object({
				IconPhrase: z.string(),
				PrecipitationProbability: z.number(),
			}),
			Night: z.object({
				IconPhrase: z.string(),
				PrecipitationProbability: z.number(),
			}),
		}),
	),
});
