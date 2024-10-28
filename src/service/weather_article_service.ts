import { LLMClient } from '../client/article_mll_client.ts';
import { WeatherClient } from '../client/weather_client.ts';
import { APP_CONFIG } from '../config/app_config.ts';
import LOG from '../log/default_logger.ts';
import type { WeatherArticleRequestDto } from '../model/dto/request/weather_article_request.dto.ts';
import type { WeatherArticleResponseDto } from '../model/dto/response/weather_article_response.dto.ts';
import { Language } from '../model/enum/language.ts';
import NodeCache from 'npm:node-cache';
import { LLMArticleAuditRepository } from '../repository/llm_article_audit_repository.ts';
import { mapToLLMArticleEntity } from '../mapper/to_llm_article_entity.ts';
import { LLMArticleRepository } from '../repository/llm_article_repository.ts';
import type {
	WeatherArticleCollectionRequestQueryMappedDto,
} from '../model/dto/request/weather_article_collection_request_query.dto.ts';
import type { AuditEntity } from '../model/entity/audit_entity.ts';

export class WeatherArticleService {
	private static instance: WeatherArticleService | undefined;
	private weatherClientInstance = WeatherClient.getInstance();
	private LLMClientInstance = LLMClient.getInstance();
	private llmArticleRepository = LLMArticleRepository.getInstance();
	private llmArticleAuditRepository = LLMArticleAuditRepository.getInstance();

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
		this.upsertArticle(weatherArticleRequest, language, article, locationInfo.Key);

		return article;
	}

	public async getWeatherArticleCollection(
		reqQuery: WeatherArticleCollectionRequestQueryMappedDto,
		language: Language = Language.EN,
	): Promise<AuditEntity[]> {
		const searchLocationResponse = await this.weatherClientInstance.searchLocationByName(
			reqQuery.locationName,
			language,
		);

		const locationInfo = searchLocationResponse[0];

		const audits = await this.llmArticleAuditRepository.getArticles(
			reqQuery.limit,
			reqQuery.offset,
			locationInfo.Key,
			language,
			reqQuery.articleType,
			reqQuery.dateFrom,
			reqQuery.dateTo,
		);

		return audits;
	}

	private async upsertArticle(
		weatherArticleRequest: WeatherArticleRequestDto,
		language: Language,
		article: WeatherArticleResponseDto,
		locationKey: string,
	): Promise<void> {
		try {
			const entity = mapToLLMArticleEntity(weatherArticleRequest, language, article, locationKey);
			const _result = await this.llmArticleRepository.upsertArticle(entity);
		} catch (e) {
			LOG.error(`Failed to upsert article for location: ${locationKey}`, e);
		}
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
