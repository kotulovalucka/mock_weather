import { assertEquals } from 'jsr:@std/assert';
import { LocationWeatherResponseSchema } from '../../../src/schema/location_weather_response_schema.ts';

const validLocationWeatherData = {
	Headline: {
		EffectiveDate: '2024-10-27T08:00:00+02:00',
		Severity: 4,
		Text: 'Mild Sunday',
		Category: 'mild',
		MobileLink: 'http://example.com',
		Link: 'http://example.com',
	},
	DailyForecasts: [
		{
			Date: '2024-10-26T07:00:00+02:00',
			Temperature: {
				Minimum: { Value: 45, Unit: 'F' },
				Maximum: { Value: 58, Unit: 'F' },
			},
			Day: {
				IconPhrase: 'Cloudy',
				PrecipitationProbability: 80,
			},
			Night: {
				IconPhrase: 'Clear',
				PrecipitationProbability: 20,
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
		MobileLink: 'http://example.com',
		Link: 'http://example.com',
	},
	DailyForecasts: [
		{
			Date: '2024-10-26T07:00:00+02:00',
			Temperature: {
				Minimum: { Value: '45', Unit: 'F' }, // Value should be a number
				Maximum: { Value: 58, Unit: 'F' },
			},
			Day: {
				IconPhrase: 'Cloudy',
				PrecipitationProbability: '80', // Should be a number
			},
			Night: {
				IconPhrase: 'Clear',
				PrecipitationProbability: 20,
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
		MobileLink: 'http://example.com',
	},
	DailyForecasts: [
		{
			Date: '2024-10-26T07:00:00+02:00',
			Temperature: {
				Minimum: { Value: 45, Unit: 'F' },
				Maximum: { Value: 58, Unit: 'F' },
			},
			Day: {
				IconPhrase: 'Cloudy',
			},
			// Missing Night object
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
			MobileLink: 'http://example.com',
			Link: 'http://example.com',
		},
		DailyForecasts: [
			{
				Date: '2024-10-26T07:00:00+02:00',
				Temperature: {
					Minimum: { Value: 45, Unit: 'F' },
					Maximum: { Value: 58, Unit: 'F' },
				},
				Day: {
					IconPhrase: 'Cloudy',
					PrecipitationProbability: 80,
				},
				Night: {
					IconPhrase: 'Clear',
					PrecipitationProbability: 20,
				},
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
