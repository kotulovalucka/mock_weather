import { DataSource, Repository } from 'typeorm';
import { LLMArticleEntity } from '../model/entity/llm_article_entity.ts';
import LOG from '../log/default_logger.ts';

export class LLMArticleRepository {
	private repository: Repository<LLMArticleEntity>;
	private static instance: LLMArticleRepository;

	private constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(LLMArticleEntity);
	}

	public static getInstance(dataSource: DataSource | null = null): LLMArticleRepository {
		if (!LLMArticleRepository.instance && dataSource) {
			LLMArticleRepository.instance = new LLMArticleRepository(dataSource);
		} else if (!LLMArticleRepository.instance && !dataSource) {
			throw new Error('Data source is not defined');
		}
		return LLMArticleRepository.instance;
	}
	/**
	 * If the article already exists it updates the data otherwise inserts a new article.
	 * @param articleData
	 * @returns
	 */
	public async upsertArticle(articleData: Partial<LLMArticleEntity>): Promise<LLMArticleEntity> {
		try {
			const result = await this.repository.createQueryBuilder()
				.insert()
				.into(LLMArticleEntity)
				.values({
					...articleData,
					modifiedAt: new Date(),
					createdAt: new Date(),
				})
				.orUpdate(
					[
						'title',
						'perex',
						'description',
						'modified_at',
					],
					['location_key', 'language', 'article_type'],
				)
				.returning('*')
				.execute();

			const savedArticle = result.generatedMaps[0] as LLMArticleEntity;
			LOG.info(`Article with locationKey ${articleData.locationKey} upserted successfully`);
			return savedArticle;
		} catch (error) {
			LOG.error('Failed to upsert article:', error);
			throw error;
		}
	}
}
