import { StatusCodes } from 'http-status-codes';
import { APP_CONFIG } from '../config.ts';
import LOG from '../log/default_logger.ts';
import type { SingleLocationSearchResponseDto } from '../model/dto/response/forecastApi/location_search.dto.ts';
import type { LocationWeatherResponseDto } from '../model/dto/response/forecastApi/location_weather.dto.ts';
import { ArticleType } from '../model/enum/article_type.ts';
import type { Language } from '../model/enum/language.ts';
import { HttpError } from '../model/error/HttpError.ts';

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
				throw new HttpError(
					StatusCodes.INTERNAL_SERVER_ERROR,
					localizationUtil.getTranslation('errorMessages.LLMClient.fetch', language),
				);
			}

			const responseBody: unknown = await response.json();
			LOG.debug(`LLM response: ${JSON.stringify(responseBody)}`);

			const parsedResult = LLMArticleResponseSchema.safeParse(responseBody);

			if (!parsedResult.success) {
				LOG.error(`Failed to parse LLM response: `, parsedResult.error.errors);
				throw new HttpError(
					StatusCodes.INTERNAL_SERVER_ERROR,
					localizationUtil.getTranslation('errorMessages.LLMClient.parse', language),
				);
			}

			const data = parsedResult.data;

			const LMMOutput = JSON.parse(data.message.content[0].text);
			const LLMParsedResult = LLMTextOutputSchema.safeParse(LMMOutput);

			if (!LLMParsedResult.success) {
				LOG.error(`Failed to parse LLM response: `, LLMParsedResult.error.errors);
				throw new HttpError(
					StatusCodes.INTERNAL_SERVER_ERROR,
					localizationUtil.getTranslation('errorMessages.LLMClient.parse', language),
				);
			}

			return LLMParsedResult.data;
		} catch (error) {
			LOG.error(`Failed to generate article from LLM: `, error);
			if (error instanceof HttpError) {
				throw error;
			}
			throw new HttpError(
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
		const prompt = `
		Write and concise weather forecast article for the following location and date in JSON format.
		Location Information:
		${JSON.stringify(locationInfo)}

		Weather Forecast:
		${JSON.stringify(weatherInfo)}

		The article should include:
		- A headline summarizing the weather (JSON key 'headline').
		- A brief opening sentence that introduces the forecast (JSON key 'perex').
		- Key weather details such as temperature, precipitation, and wind conditions (JSON key 'description').
		- Should be localized in ${language === 'sk' ? 'slovak' : 'english'}.
		- There are multiple styles article can be writen  (${
			Object.values(ArticleType)
		}). Given article style must be '${style}'.
		Make the language professional and direct, as if for a general news report.
		- Make sure article will contain name and country of the location (JSON key 'location').

		Example of such output: 
		{
			"headline": "Weather forecast for Bratislava",
			"perex": "Weather forecast for Bratislava on 2021-09-01",
			"description": "Temperature: 25°C, Precipitation: 0mm, Wind: 5km/h ...",
			"location": "Bratislava, Slovakia"
		}
		`;

		return prompt;
	}
}
