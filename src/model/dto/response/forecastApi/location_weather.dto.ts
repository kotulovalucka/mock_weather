export interface LocationWeatherResponseDto {
	Headline: {
		EffectiveDate: string;
		Severity: number;
		Text: string;
		Category: string;
		MobileLink: string;
		Link: string;
	};
	DailyForecasts: Array<{
		Date: string;
		Temperature: {
			Minimum: {
				Value: number;
				Unit: string;
			};
			Maximum: {
				Value: number;
				Unit: string;
			};
		};
		Day: {
			IconPhrase: string;
			PrecipitationProbability: number;
		};
		Night: {
			IconPhrase: string;
			PrecipitationProbability: number;
		};
	}>;
}
