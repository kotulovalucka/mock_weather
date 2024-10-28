import {
	BaseEntity as TypeOrmBaseEntity,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
export class BaseEntity extends TypeOrmBaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn({ type: 'timestamptz' })
	public createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	public modifiedAt: Date;
}
