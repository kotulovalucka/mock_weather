import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { AuditEntity } from './audit_entity.ts';

@Entity({ name: 'LLMArticleAudit' })
export class LLMArticleAuditEntity extends AuditEntity {
	@Column({ type: 'int' })
	id: number;

	@Column({ unique: true, length: 256, type: 'varchar' })
	location_key: string;

	@Column({ length: 256, type: 'varchar' })
	title: string;

	@Column({ length: 256, type: 'varchar' })
	perex: string;

	@Column({ length: 2560, type: 'varchar' })
	description: string;

	@UpdateDateColumn({ type: 'timestamptz' })
	modified_at: Date;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;
}
