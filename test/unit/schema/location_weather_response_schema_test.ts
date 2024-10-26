import { assertEquals } from 'jsr:@std/assert';
import { LocationWeatherResponseSchema } from '../../../src/schema/location_weather_response_schema.ts';

const validLocationWeatherData = {
	Headline: {
		EffectiveDate: '2024-10-27T08:00:00+02:00',
		Severity: 4,
		Text: 'Mild Sunday',
		Category: 'mild',
	},
	DailyForecasts: [
		{
			Date: '2024-10-26T07:00:00+02:00',
			Temperature: {
				Minimum: { Value: 45, Unit: 'F' },
				Maximum: { Value: 58, Unit: 'F' },
			},
			RealFeelTemperature: {
				Minimum: { Value: 44, Unit: 'F', Phrase: 'Chilly' },
				Maximum: { Value: 59, Unit: 'F', Phrase: 'Cool' },
			},
			HoursOfSun: 6.0,
			AirAndPollen: [
				{
					Name: 'Pollen',
					Value: 3,
					Category: 'Low',
					CategoryValue: 1,
				},
			],
			Day: {
				IconPhrase: 'Cloudy',
				PrecipitationProbability: 80,
				RainProbability: 70,
				SnowProbability: 0,
				IceProbability: 0,
				Wind: {
					Speed: { Value: 15, Unit: 'mph' },
					Direction: { Degrees: 90, Localized: 'E', English: 'East' },
				},
				TotalLiquid: { Value: 0.2, Unit: 'in' },
				HoursOfRain: 2,
				HoursOfSnow: 0,
				HoursOfIce: 0,
				CloudCover: 80,
				RelativeHumidity: {
					Minimum: 60,
					Maximum: 85,
					Average: 72,
				},
			},
			Night: {
				IconPhrase: 'Clear',
				PrecipitationProbability: 20,
				RainProbability: 10,
				SnowProbability: 0,
				IceProbability: 0,
				Wind: {
					Speed: { Value: 5, Unit: 'mph' },
					Direction: { Degrees: 180, Localized: 'S', English: 'South' },
				},
				TotalLiquid: { Value: 0.0, Unit: 'in' },
				HoursOfRain: 0,
				HoursOfSnow: 0,
				HoursOfIce: 0,
				CloudCover: 10,
				RelativeHumidity: {
					Minimum: 65,
					Maximum: 90,
					Average: 75,
				},
			},
		},
	],
};

const invalidLocationWeatherData = {
	Headline: {
		EffectiveDate: '2024-10-27T08:00:00+02:00',
		Severity: 'high', // Should be a number
		Text: 'Mild Sunday',
		Category: 'mild',
	},
	DailyForecasts: [
		{
			Date: '2024-10-26T07:00:00+02:00',
			Temperature: {
				Minimum: { Value: '45', Unit: 'F' }, // should be a number
				Maximum: { Value: 58, Unit: 'F' },
			},
			RealFeelTemperature: {
				Minimum: { Value: 44, Unit: 'F', Phrase: 'Chilly' },
				Maximum: { Value: 59, Unit: 'F', Phrase: 'Cool' },
			},
			HoursOfSun: '6.0', // Should be a number
			AirAndPollen: [
				{
					Name: 'Pollen',
					Value: '3', // Should be a number
					Category: 'Low',
					CategoryValue: 1,
				},
			],
			Day: {
				IconPhrase: 'Cloudy',
				PrecipitationProbability: '80', // Should be a number
				RainProbability: 70,
				SnowProbability: 0,
				IceProbability: 0,
				Wind: {
					Speed: { Value: 15, Unit: 'mph' },
					Direction: { Degrees: 90, Localized: 'E', English: 'East' },
				},
				TotalLiquid: { Value: 0.2, Unit: 'in' },
				HoursOfRain: 2,
				HoursOfSnow: 0,
				HoursOfIce: 0,
				CloudCover: 80,
				RelativeHumidity: {
					Minimum: 60,
					Maximum: '85', // Should be a number
					Average: 72,
				},
			},
			Night: {
				IconPhrase: 'Clear',
				PrecipitationProbability: 20,
				RainProbability: 10,
				SnowProbability: 0,
				IceProbability: 0,
				Wind: {
					Speed: { Value: 5, Unit: 'mph' },
					Direction: { Degrees: 180, Localized: 'S', English: 'South' },
				},
				TotalLiquid: { Value: 0.0, Unit: 'in' },
				HoursOfRain: 0,
				HoursOfSnow: 0,
				HoursOfIce: 0,
				CloudCover: 10,
				RelativeHumidity: {
					Minimum: 65,
					Maximum: 90,
					Average: '75', // Should be a number
				},
			},
		},
	],
};

const missingKeyLocationWeatherData = {
	Headline: {
		EffectiveDate: '2024-10-27T08:00:00+02:00',
		Severity: 4,
		Text: 'Mild Sunday',
		Category: 'mild',
	},
	DailyForecasts: [
		{
			Date: '2024-10-26T07:00:00+02:00',
			Temperature: {
				Minimum: { Value: 45, Unit: 'F' },
				Maximum: { Value: 58, Unit: 'F' },
			},
			RealFeelTemperature: {
				Minimum: { Value: 44, Unit: 'F', Phrase: 'Chilly' },
				Maximum: { Value: 59, Unit: 'F', Phrase: 'Cool' },
			},
			HoursOfSun: 6.0,
			AirAndPollen: [
				{
					Name: 'Pollen',
					Value: 3,
					Category: 'Low',
					CategoryValue: 1,
				},
			],
			Day: {
				IconPhrase: 'Cloudy',
				PrecipitationProbability: 80,
				RainProbability: 70,
				SnowProbability: 0,
				IceProbability: 0,
				Wind: {
					Speed: { Value: 15, Unit: 'mph' },
					Direction: { Degrees: 90, Localized: 'E', English: 'East' },
				},
				TotalLiquid: { Value: 0.2, Unit: 'in' },
				HoursOfRain: 2,
				HoursOfSnow: 0,
				HoursOfIce: 0,
				CloudCover: 80,
				RelativeHumidity: {
					Minimum: 60,
					Maximum: 85,
					Average: 72,
				},
			},
			// Missing 'Night' field here
		},
	],
};

const notObjectLocationWeatherData = [
	{
		Headline: {
			EffectiveDate: '2024-10-27T08:00:00+02:00',
			Severity: 4,
			Text: 'Mild Sunday',
			Category: 'mild',
		},
		DailyForecasts: [
			{
				Date: '2024-10-26T07:00:00+02:00',
				Temperature: {
					Minimum: { Value: 45, Unit: 'F' },
					Maximum: { Value: 58, Unit: 'F' },
				},
				RealFeelTemperature: {
					Minimum: { Value: 44, Unit: 'F', Phrase: 'Chilly' },
					Maximum: { Value: 59, Unit: 'F', Phrase: 'Cool' },
				},
				HoursOfSun: 6.0,
				AirAndPollen: [
					{
						Name: 'Pollen',
						Value: 3,
						Category: 'Low',
						CategoryValue: 1,
						// Additional fields in 'Day' and 'Night' omitted for brevity
					},
				],
			},
		],
	},
];

Deno.test('LocationWeatherResponseSchema - Valid data', () => {
	const result = LocationWeatherResponseSchema.safeParse(validLocationWeatherData);
	assertEquals(result.success, true);
});

Deno.test('LocationWeatherResponseSchema - Invalid data types', () => {
	const result = LocationWeatherResponseSchema.safeParse(invalidLocationWeatherData);
	assertEquals(result.success, false);
});

Deno.test('LocationWeatherResponseSchema - Missing keys', () => {
	const result = LocationWeatherResponseSchema.safeParse(missingKeyLocationWeatherData);
	assertEquals(result.success, false);
});

Deno.test('LocationWeatherResponseSchema - Not an object', () => {
	const result = LocationWeatherResponseSchema.safeParse(notObjectLocationWeatherData);
	assertEquals(result.success, false);
});

Deno.test('LocationWeatherResponseSchema - Missing whole object', () => {
	const result = LocationWeatherResponseSchema.safeParse({});
	assertEquals(result.success, false);
});
