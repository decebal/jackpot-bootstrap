import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('metrics')
export class MetricsEntity {
	@PrimaryColumn()
	id: string

	@Column()
	@Index()
	source: string

	@Column()
	@Index()
	event_type: string

	@Column({ type: 'json' })
	data: any

	@Column()
	@Index()
	timestamp: string

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}
