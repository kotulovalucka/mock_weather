import { DataSource, Repository } from 'typeorm';
import { AuditEntity } from '../model/entity/audit_entity.ts';
import LOG from '../log/default_logger.ts';
import { WeatherServiceCommonError } from '../model/error/weather_service_common_error.ts';
import { StatusCodes } from 'http-status-codes';
import * as localizationUtil from '../util/localization.ts';

export class LLMArticleAuditRepository {
	private repository: Repository<AuditEntity>;
	private static instance: LLMArticleAuditRepository;

	private constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(AuditEntity);
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

	async getAuditRecords(limit: number, offset: number): Promise<AuditEntity[]> {
		try {
			const records = await this.repository.find({
				take: limit,
				skip: offset,
				order: { createdAt: 'DESC' },
			});
			LOG.info(`Fetched ${records.length} audit records with limit ${limit} and offset ${offset}`);
			return records;
		} catch (error) {
			LOG.error('Failed to fetch audit records:', error);
			throw error;
		}
	}
}
