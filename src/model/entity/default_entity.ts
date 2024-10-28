import {
	BaseEntity as TypeOrmBaseEntity,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
export class BaseEntity extends TypeOrmBaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	public createdAt: Date;

	@UpdateDateColumn({ name: 'modified_at', type: 'timestamptz' })
	public modifiedAt: Date;
}
