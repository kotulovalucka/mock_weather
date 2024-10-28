import type { DataSource } from 'typeorm';
import { LLMArticleAuditRepository } from '../repository/llm_article_audit_repository.ts';
import { LLMArticleRepository } from '../repository/llm_article_repository.ts';
import LOG from '../log/default_logger.ts';

export function initializeRepositories(dataSource: DataSource): void {
	LLMArticleAuditRepository.getInstance(dataSource);
	LLMArticleRepository.getInstance(dataSource);
	LOG.info('All Repositories initialized successfully');
}
