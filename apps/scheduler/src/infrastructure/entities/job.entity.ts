import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('jobs')
export class JobEntity {
	@PrimaryColumn()
	id: string

	@Column()
	name: string

	@Column()
	type: string

	@Column()
	schedule: string

	@Column('json')
	target: {
		service: string
		method: string
		payload: any
	}

	@Column({
		type: 'enum',
		enum: ['active', 'inactive', 'completed', 'failed'],
		default: 'active'
	})
	status: 'active' | 'inactive' | 'completed' | 'failed'

	@Column()
	created_at: string

	@Column()
	updated_at: string

	@Column({ nullable: true })
	last_executed_at: string

	@Column({ nullable: true })
	next_execution: string

	@Column('json', { nullable: true })
	result: any

	@Column({ nullable: true })
	error: string

	@Column('json', { nullable: true })
	metadata: Record<string, any>

	@Column({ default: 0 })
	retries: number

	@Column({ default: 3 })
	max_retries: number

	@Column({ default: 30000 })
	timeout: number
}
