import { DataSource, Repository } from 'typeorm';
import { AuditEntity } from '../model/entity/audit_entity.ts';
import LOG from '../log/default_logger.ts';
import { WeatherServiceCommonError } from '../model/error/weather_service_common_error.ts';
import { StatusCodes } from 'http-status-codes';
import * as localizationUtil from '../util/localization.ts';
import { LLMArticleAuditEntity } from '../model/entity/llm_article_audit_entity.ts';
import type { Language } from '../model/enum/language.ts';
import type { ArticleType } from '../model/enum/article_type.ts';

export class LLMArticleAuditRepository {
	private repository: Repository<LLMArticleAuditEntity>;
	private static instance: LLMArticleAuditRepository;

	private constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(LLMArticleAuditEntity);
	}

	public static getInstance(dataSource: DataSource | null = null): LLMArticleAuditRepository {
		if (!LLMArticleAuditRepository.instance && dataSource) {
			LLMArticleAuditRepository.instance = new LLMArticleAuditRepository(dataSource);
		} else if (!LLMArticleAuditRepository.instance && !dataSource) {
			throw new WeatherServiceCommonError(
				StatusCodes.INTERNAL_SERVER_ERROR,
				localizationUtil.getTranslation(
					'weatherServiceGeneralMessages.unknownErrorDuringIntialization',
				),
			);
		}
		return LLMArticleAuditRepository.instance;
	}

	async getArticles(
		limit: number,
		offset: number,
		locationKey?: string,
		language?: Language,
		articleType?: ArticleType,
		dateFrom?: number,
		dateTo?: number,
	): Promise<AuditEntity[]> {
		try {
			const query = this.repository.createQueryBuilder()
				.take(limit)
				.skip(offset)
				.orderBy('rev_timestamp', 'DESC');

			if (locationKey) {
				query.andWhere('location_key = :locationKey', { locationKey });
			}
			if (dateFrom) {
				query.andWhere('rev_timestamp >= :dateFrom', { dateFrom: new Date(dateFrom) });
			}
			if (dateTo) {
				query.andWhere('rev_timestamp <= :dateTo', { dateTo: new Date(dateTo) });
			}
			if (language) {
				query.andWhere('language = :language', { language });
			}

			if (articleType) {
				query.andWhere('article_type = :articleType', { articleType });
			}

			const records = await query.getMany();
			LOG.info(`Fetched ${records.length} audit records with limit ${limit} and offset ${offset}`);
			return records;
		} catch (error) {
			LOG.error('Failed to fetch audit records:', error);
			throw error;
		}
	}
}
