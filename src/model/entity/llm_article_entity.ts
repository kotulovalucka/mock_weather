import { Column, Entity } from 'typeorm';
import { BaseEntity } from './default_entity.ts';

@Entity({ name: 'LLMArticle' })
export class LLMArticleEntity extends BaseEntity {
	@Column({ name: 'location_key', unique: true, length: 256, type: 'varchar', nullable: false })
	locationKey: string;

	@Column({ length: 256, type: 'varchar', nullable: false })
	title: string;

	@Column({ length: 256, type: 'varchar', nullable: false })
	perex: string;

	@Column({ length: 2560, type: 'varchar', nullable: false })
	description: string;
}
