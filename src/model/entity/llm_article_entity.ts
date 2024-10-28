import { Column, Entity } from 'typeorm';
import { BaseEntity } from './default_entity.ts';
import { Language } from '../enum/language.ts';
import { ArticleType } from '../enum/article_type.ts';

@Entity({ name: 'LLMArticle' })
export class LLMArticleEntity extends BaseEntity {
	@Column({ name: 'location_key', unique: true, length: 256, type: 'varchar', nullable: false })
	locationKey: string;

	@Column({ length: 256, type: 'varchar', nullable: false })
	title: string;

	@Column({ name: 'language', enum: Language, type: 'enum', nullable: false })
	language: Language;

	@Column({ name: 'article_type', enum: ArticleType, type: 'enum', nullable: false })
	articleType: ArticleType;

	@Column({ length: 256, type: 'varchar', nullable: false })
	perex: string;

	@Column({ length: 2560, type: 'varchar', nullable: false })
	description: string;
}
