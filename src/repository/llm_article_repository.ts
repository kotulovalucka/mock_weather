import { DataSource, Repository } from 'typeorm';
import { LLMArticleEntity } from '../model/entity/llm_article_entity.ts';
import LOG from '../log/default_logger.ts';

export class LLMArticleRepository {
	private repository: Repository<LLMArticleEntity>;

	constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(LLMArticleEntity);
	}

	async insertArticle(articleData: Partial<LLMArticleEntity>): Promise<LLMArticleEntity> {
		try {
			const article = this.repository.create(articleData);
			const savedArticle = await this.repository.save(article);
			LOG.info(`Article with locationKey ${articleData.locationKey} inserted successfully`);
			return savedArticle;
		} catch (error) {
			LOG.error('Failed to insert article:', error);
			throw error;
		}
	}

	async updateArticle(
		id: number,
		updateData: Partial<LLMArticleEntity>,
	): Promise<LLMArticleEntity | null> {
		try {
			const article = await this.repository.findOne({ where: { id } });
			if (!article) {
				LOG.warn(`Article with ID ${id} not found`);
				return null;
			}
			const updatedArticle = await this.repository.save({ ...article, ...updateData });
			LOG.info('Article updated successfully');
			return updatedArticle;
		} catch (error) {
			LOG.error('Failed to update article:', error);
			throw error;
		}
	}
}
