import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RevType } from '../enum/rev_type.ts';

export class AuditEntity {
	@PrimaryGeneratedColumn({ name: 'rev_id' })
	public revId: number;
	@Column({ name: 'rev_type', type: 'enum', enum: RevType, nullable: false })
	public revType: RevType;
	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	public createdAt: Date;

	@UpdateDateColumn({ name: 'modified_at', type: 'timestamptz' })
	public modifiedAt: Date;

	@UpdateDateColumn({ name: 'rev_timestamp', type: 'timestamptz' })
	public revTimestamp: Date;
}
