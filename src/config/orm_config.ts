import { DataSource } from 'typeorm';
import { APP_CONFIG } from './app_config.ts';
import { LLMArticleEntity } from '../model/entity/llm_article_entity.ts';
import { LLMArticleAuditEntity } from '../model/entity/llm_article_audit_entity.ts';
import LOG from '../log/default_logger.ts';
import process from 'node:process';

const ORM_CONFIG = new DataSource({
	type: 'postgres',
	host: APP_CONFIG.database.host,
	port: APP_CONFIG.database.port,
	username: APP_CONFIG.database.user,
	password: APP_CONFIG.database.password,
	database: APP_CONFIG.database.database,
	logging: false,
	entities: [
		LLMArticleEntity,
		LLMArticleAuditEntity,
	],
	migrations: [], // not relevant for us, huh
	subscribers: [],
});

export async function initializeORM() {
	try {
		await ORM_CONFIG.initialize();
		LOG.info('Database connection established successfully');
	} catch (error) {
		LOG.error('Failed to establish database connection:', error);
		process.exit(1); // Exit process if the database connection fails
	}
	return ORM_CONFIG;
}
