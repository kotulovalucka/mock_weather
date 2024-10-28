import { Column, Entity } from 'typeorm';
import { AuditEntity } from './audit_entity.ts';
import { ArticleType } from '../enum/article_type.ts';
import { Language } from '../enum/language.ts';

@Entity({ name: 'LLMArticleAudit' })
export class LLMArticleAuditEntity extends AuditEntity {
	@Column({ type: 'int' })
	id: number;

	@Column({ name: 'location_key', unique: true, length: 256, type: 'varchar' })
	locationKey: string;

	@Column({ name: 'language', enum: Language, type: 'enum', nullable: false })
	language: Language;

	@Column({ name: 'article_type', enum: ArticleType, type: 'enum', nullable: false })
	articleType: ArticleType;

	@Column({ length: 256, type: 'varchar' })
	title: string;

	@Column({ length: 256, type: 'varchar' })
	perex: string;

	@Column({ length: 2560, type: 'varchar' })
	description: string;
}
