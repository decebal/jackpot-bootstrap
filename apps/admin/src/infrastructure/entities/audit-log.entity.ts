import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm'

@Entity('audit_logs')
export class AuditLogEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	@Index()
	userId: string

	@Column()
	username: string

	@Column()
	@Index()
	action: string

	@Column()
	@Index()
	resource: string

	@Column({ nullable: true })
	resourceId: string

	@Column({ type: 'simple-json', nullable: true })
	details: Record<string, any>

	@CreateDateColumn()
	@Index()
	timestamp: Date

	@Column({ nullable: true })
	ip: string

	@Column({ nullable: true })
	userAgent: string
}
