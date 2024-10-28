import { DataSource, Repository } from 'typeorm';
import { AuditEntity } from '../model/entity/audit_entity.ts';
import LOG from '../log/default_logger.ts';

export class LLMArticleAuditRepository {
	private repository: Repository<AuditEntity>;
	private static instance: LLMArticleAuditRepository;

	private constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(AuditEntity);
	}

	public static getInstance(dataSource: DataSource): LLMArticleAuditRepository {
		if (!LLMArticleAuditRepository.instance) {
			LLMArticleAuditRepository.instance = new LLMArticleAuditRepository(dataSource);
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
