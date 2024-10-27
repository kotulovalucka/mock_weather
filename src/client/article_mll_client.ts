import { StatusCodes } from 'http-status-codes';
import { APP_CONFIG } from '../config.ts';
import LOG from '../log/default_logger.ts';
import type { SingleLocationSearchResponseDto } from '../model/dto/response/forecastApi/location_search.dto.ts';
import type { LocationWeatherResponseDto } from '../model/dto/response/forecastApi/location_weather.dto.ts';
import type { Language } from '../model/enum/language.ts';
import { WeatherServiceCommonError } from '../model/error/weather_service_common_error.ts';

import type { LLMClientMockConfig } from '../model/types/llm_client_mock_config.ts';
import { LLMArticleResponseSchema } from '../schema/client/llm_article_response_schema.ts';
import * as localizationUtil from '../util/localization.ts';

import { LLMTextOutputSchema } from '../schema/client/llm_article_response_schema.ts';
import type { WeatherArticleResponseDto } from '../model/dto/response/weather_article_response.dto.ts';

export class LLMClient {
	private static instance: LLMClient | undefined;
	private apiUrl: string;
	private apiKey: string;

	private constructor(mockConfig: LLMClientMockConfig = null) {
		if (mockConfig) {
			this.apiUrl = mockConfig.forecastApi.url;
			this.apiKey = mockConfig.forecastApi.apiKey;
		} else {
			this.apiUrl = APP_CONFIG.llm.url;
			this.apiKey = APP_CONFIG.llm.apiKey;
		}
		LOG.info(`LLM client initialized`, { apiUrl: this.apiUrl });
	}

	public static getInstance(config: LLMClientMockConfig = null): LLMClient {
		if (!this.instance) {
			this.instance = new LLMClient(config);
		}
		return this.instance;
	}

	public async generateWeatherArticle(
		weatherInfo: LocationWeatherResponseDto,
		locationInfo: SingleLocationSearchResponseDto,
		style: string,
		language: Language,
	): Promise<WeatherArticleResponseDto> {
		try {
			const prompt = this.generatePrompt(weatherInfo, locationInfo, style, language);
			LOG.debug(`Generating article with prompt: ${prompt}`);

			const response = await fetch(`${this.apiUrl}/v2/chat`, {
				method: 'POST',
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					'Authorization': `bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					model: 'command-r-plus-08-2024',
					messages: [{ role: 'user', content: prompt }],
				}),
			});

			if (!response.ok) {
				LOG.error(`Failed to generate article from LLM`);
				throw new WeatherServiceCommonError(
					StatusCodes.INTERNAL_SERVER_ERROR,
					localizationUtil.getTranslation('errorMessages.LLMClient.fetch', language),
				);
			}

			const responseBody: unknown = await response.json();
			LOG.debug(`LLM response: ${JSON.stringify(responseBody)}`);

			const parsedResult = LLMArticleResponseSchema.safeParse(responseBody);

			if (!parsedResult.success) {
				LOG.error(`Failed to parse LLM response: `, parsedResult.error.errors);
				throw new WeatherServiceCommonError(
					StatusCodes.INTERNAL_SERVER_ERROR,
					localizationUtil.getTranslation('errorMessages.LLMClient.parse', language),
				);
			}

			const data = parsedResult.data;
			let LMMOutput = '';
			try {
				LMMOutput = JSON.parse(data.message.content[0].text);
			} catch {
				LOG.error(`Failed to parse LLM response: `, data.message.content[0].text);
				throw new WeatherServiceCommonError(
					StatusCodes.INTERNAL_SERVER_ERROR,
					localizationUtil.getTranslation('errorMessages.LLMClient.parse', language),
				);
			}
			const LLMParsedResult = LLMTextOutputSchema.safeParse(LMMOutput);

			if (!LLMParsedResult.success) {
				LOG.error(`Failed to parse LLM response: `, LLMParsedResult.error.errors);
				throw new WeatherServiceCommonError(
					StatusCodes.INTERNAL_SERVER_ERROR,
					localizationUtil.getTranslation('errorMessages.LLMClient.parse', language),
				);
			}

			return LLMParsedResult.data;
		} catch (error) {
			LOG.error(`Failed to generate article from LLM: `, error);
			if (error instanceof WeatherServiceCommonError) {
				throw error;
			}
			throw new WeatherServiceCommonError(
				StatusCodes.INTERNAL_SERVER_ERROR,
				localizationUtil.getTranslation('errorMessages.LLMClient.fetch', language),
			);
		}
	}

	private generatePrompt(
		weatherInfo: LocationWeatherResponseDto,
		locationInfo: SingleLocationSearchResponseDto,
		style: string,
		language: Language,
	): string {
		const currentDateTime = new Date().toISOString();

		const prompt = `
			Write a detailed and structured weather forecast article in JSON format for the following location, using ${currentDateTime} as the current date and time. The article should focus only on future weather conditions starting from this point, based on information provided in the "DailyForecasts[0]" object. The output must be localized in ${
			language === 'sk' ? 'Slovak' : 'English'
		} and follow the given style: '${style}'. Each field should adhere to the specified format and include essential weather details. Parse separate data for day and night as described below.
	
			Current Date and Time: ${currentDateTime}
			Location Information:
			${JSON.stringify(locationInfo)}
	
			Weather Forecast Information:
			${JSON.stringify(weatherInfo)}
	
			The article should be output in the following JSON structure:
			- "headline": A short, engaging headline summarizing the overall forecast (max 80 characters).
			- "perex": A brief introductory sentence about the forecast, including date and general weather outlook (1-2 sentences).
			- "description": A detailed section that includes:
				* Temperature range (minimum and maximum, with real-feel temperatures if provided).
				* Chance of rain, snow, or other precipitation events.
				* Expected hours of sun during the day.
				* Wind speed, direction, and other notable conditions (e.g., cloud cover, humidity levels) for both day and night.
				* Information about air quality or pollen levels if available.
			- "location": The name and country of the location.
	
			The "description" should detail the forecast, breaking down day and night separately, including:
			* "Day": Conditions like temperature, precipitation probability, wind speed, cloud cover, and humidity.
			* "Night": Conditions like temperature, precipitation probability, wind speed, cloud cover, and humidity.
	
			Ensure the description is comprehensive, formatted in complete sentences, and captures all critical weather conditions for readers. The temperature should include both the actual temperature and the real-feel temperature.
	
			Example JSON Output:
			{
				"headline": "Warm weather expected from Monday to Tuesday in Podbrezova, Slovakia",
				"perex": "The forecast for Podbrezova on Monday and Tuesday suggests mild temperatures with a chance of rain.",
				"description": "In Podbrezova, Slovakia, expect daytime temperatures reaching up to 18.5°C with a minimum of 6.4°C at night. Real-feel temperatures range from a cool 5.8°C at night to a pleasant 18.2°C during the day. Monday will be partly cloudy with a 40% chance of rain, while winds from the southwest will reach speeds of up to 14.8 km/h, slowing to 9.3 km/h by evening. Relative humidity will range from 63% to 75%. Sun hours are expected to be 6 hours during the day. The night will see cloudy skies, but rain is unlikely.",
				"location": "Podbrezova, Slovakia"
			}
	
			Important Instructions:
			- Always extract and display the forecast from this starting date point: (${currentDateTime})".
			- Refer to temperature and real-feel temperatures in the description.
			- Include precipitation probabilities (if above 0%) and hours of sun.
			- Describe conditions separately for day and night, as provided in "Day" and "Night" fields of the weather forecast.
			- Keep the language professional and direct, as if writing for a general news report audience.
			`;

		return prompt;
	}
}
