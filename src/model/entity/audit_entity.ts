import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RevType } from '../enum/rev_type.ts';

export class AuditEntity {
	@PrimaryGeneratedColumn()
	public revId: number;
	@Column({ type: 'enum', enum: RevType, nullable: false })
	public revType: RevType;
	@CreateDateColumn({ type: 'timestamptz' })
	public createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	public modifiedAt: Date;
}
