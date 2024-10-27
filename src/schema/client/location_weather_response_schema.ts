import { z } from 'zod';

const DayInfoSchema = z.object({
	IconPhrase: z.string(),
	PrecipitationProbability: z.number(),
	RainProbability: z.number().nonnegative(),
	SnowProbability: z.number().nonnegative(),
	IceProbability: z.number().nonnegative(),
	Wind: z.object({
		Speed: z.object({
			Value: z.number(),
			Unit: z.string(),
		}),
		Direction: z.object({
			Degrees: z.number(),
			Localized: z.string(),
			English: z.string(),
		}),
	}),
	TotalLiquid: z.object({
		Value: z.number(),
		Unit: z.string(),
	}),
	HoursOfRain: z.number().nonnegative(),
	HoursOfSnow: z.number().nonnegative(),
	HoursOfIce: z.number().nonnegative(),
	CloudCover: z.number().nonnegative(),
	RelativeHumidity: z.object({
		Minimum: z.number(),
		Maximum: z.number(),
		Average: z.number(),
	}),
});

export const LocationWeatherResponseSchema = z.object({
	Headline: z.object({
		EffectiveDate: z.string(),
		Severity: z.number(),
		Text: z.string(),
		Category: z.string(),
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
			RealFeelTemperature: z.object({
				Minimum: z.object({
					Value: z.number(),
					Unit: z.string(),
					Phrase: z.string(),
				}),
				Maximum: z.object({
					Value: z.number(),
					Unit: z.string(),
					Phrase: z.string(),
				}),
			}),
			HoursOfSun: z.number(),
			AirAndPollen: z.array(
				z.object({
					Name: z.string(),
					Value: z.number(),
					Category: z.string(),
					CategoryValue: z.number(),
				}),
			),
			Day: DayInfoSchema,
			Night: DayInfoSchema,
		}),
	),
});
