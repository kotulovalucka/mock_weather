import { Column, Entity } from 'typeorm';
import { BaseEntity } from './default_entity.ts';

@Entity({ name: 'LLMArticle' })
export class LLMArticleEntity extends BaseEntity {
	@Column({ unique: true, length: 256, type: 'varchar' })
	location_key: string;

	@Column({ length: 256, type: 'varchar' })
	title: string;

	@Column({ length: 256, type: 'varchar' })
	perex: string;

	@Column({ length: 2560, type: 'varchar' })
	description: string;
}
