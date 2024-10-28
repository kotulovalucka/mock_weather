import { LLMClient } from '../client/article_mll_client.ts';
import { WeatherClient } from '../client/weather_client.ts';
import { APP_CONFIG } from '../config.ts';
import LOG from '../log/default_logger.ts';
import type { WeatherArticleRequestDto } from '../model/dto/request/weather_article_request.dto.ts';
import type { WeatherArticleResponseDto } from '../model/dto/response/weather_article_response.dto.ts';
import { Language } from '../model/enum/language.ts';
import NodeCache from 'npm:node-cache';

export class WeatherArticleService {
	private static instance: WeatherArticleService | undefined;
	private weatherClientInstance = WeatherClient.getInstance();
	private LLMClientInstance = LLMClient.getInstance();

	private serviceCache = new NodeCache({
		stdTTL: APP_CONFIG.cache.article.ttl,
		maxKeys: APP_CONFIG.cache.article.maxItems,
	});

	private constructor() {
	}

	public static getInstance(): WeatherArticleService {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new WeatherArticleService();
		return this.instance;
	}

	/**
	 * It gets the weather article for the given location just by the name of the location.
	 * @param weatherArticleRequest
	 * @param language
	 * @returns
	 */
	public async getWeatherArticle(
		weatherArticleRequest: WeatherArticleRequestDto,
		language: Language = Language.EN,
	): Promise<WeatherArticleResponseDto> {
		const searchLocationResponse = await this.weatherClientInstance.searchLocationByName(
			weatherArticleRequest.location,
			language,
		);

		const locationInfo = searchLocationResponse[0];
		const cachedArticle = this.getCachedArticle<WeatherArticleResponseDto>(
			locationInfo.Key,
			weatherArticleRequest,
			language,
		);
		if (cachedArticle) {
			return cachedArticle;
		}

		const weatherInfo = await this.weatherClientInstance.getForecastByLocationID(
			locationInfo.Key,
			language,
		);
		const article = await this.LLMClientInstance.generateWeatherArticle(
			weatherInfo,
			locationInfo,
			weatherArticleRequest.article.type,
			language,
		);

		this.cacheArticle(locationInfo.Key, weatherArticleRequest, language, article);

		return article;
	}

	public async getWeatherArticleCollection(
		_weatherArticleRequest: WeatherArticleRequestDto,
	): Promise<string[]> {
		return await Promise.resolve(['Weather article 1', 'Weather article 2']);
	}

	private getCachedArticle<T>(
		locationKey: string,
		requestInfo: WeatherArticleRequestDto,
		language: Language,
	): T | undefined {
		const keyToSearchFor = `${locationKey}-${requestInfo.article.type}-${language}`;

		return this.serviceCache.get<T>(keyToSearchFor);
	}

	private cacheArticle<T>(
		locationKey: string,
		requestInfo: WeatherArticleRequestDto,
		language: Language,
		article: WeatherArticleResponseDto,
	): void {
		const keyToCache = `${locationKey}-${requestInfo.article.type}-${language}`;

		try {
			this.serviceCache.set(keyToCache, article);
		} catch (e) {
			LOG.error(`Failed to cache article for location: ${locationKey}`, e);
		}
	}
}
