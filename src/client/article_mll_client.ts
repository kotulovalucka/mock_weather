import { APP_CONFIG } from '../config.ts';
import LOG from '../log/default_logger.ts';
import type { SingleLocationSearchResponseDto } from '../model/dto/response/forecastApi/location_search.dto.ts';
import type { LocationWeatherResponseDto } from '../model/dto/response/forecastApi/location_weather.dto.ts';
import { ArticleType } from '../model/enum/article_type.ts';
import type { Language } from '../model/enum/language.ts';

import type { LLMClientMockConfig } from '../model/types/llm_client_mock_config.ts';
import { CohereClientV2 } from 'cohere-ai';

export class LLMClient {
	private static instance: LLMClient | undefined;
	private apiUrl: string;
	private apiKey: string;
	private cohere: CohereClientV2 | undefined = undefined;

	private constructor(mockConfig: LLMClientMockConfig = null) {
		if (mockConfig) {
			this.apiUrl = mockConfig.forecastApi.url;
			this.apiKey = mockConfig.forecastApi.apiKey;
		} else {
			this.apiUrl = APP_CONFIG.llm.url;
			this.apiKey = APP_CONFIG.llm.apiKey;
		}
		this.cohere = new CohereClientV2({
			token: this.apiKey,
		});

		LOG.info(`Weather client initialized`, { apiUrl: this.apiUrl });
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
	): Promise<unknown> {
		try {
			const prompt = this.generatePrompt(weatherInfo, locationInfo, style, language);
			LOG.debug(`Generating article with prompt: ${prompt}`);
			const response = await this.cohere?.chat({
				model: 'command-r-plus-08-2024',
				messages: [{ 'role': 'user', 'content': prompt }],
			});
			if (!response) {
				throw new Error('Failed to generate article from LLM');
			}

			return response;
		} catch (error) {
			console.error('Error generating article:', error);
			throw new Error('Failed to generate article from LLM');
		}
	}

	private generatePrompt(
		weatherInfo: LocationWeatherResponseDto,
		locationInfo: SingleLocationSearchResponseDto,
		style: string,
		language: Language,
	): string {
		const prompt = `
		Write and concise weather forecast article for the following location and date.
		Location Information:
		${JSON.stringify(locationInfo)}

		Weather Forecast:
		${JSON.stringify(weatherInfo)}

		The article should include:
		- A headline summarizing the weather.
		- A brief opening sentence that introduces the forecast.
		- Key weather details such as temperature, precipitation, and wind conditions.
		- Should be localized in ${language === 'sk' ? 'slovak' : 'english'}.
		- There are multiple styles article can be writen  (${
			Object.values(ArticleType)
		}). Given article style must be '${style}'.
		Make the language professional and direct, as if for a general news report.
		- Make sure article will contain name and country of the location.
		`;

		return prompt;
	}
}
