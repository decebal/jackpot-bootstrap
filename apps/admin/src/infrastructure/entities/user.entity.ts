import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class UserEntity {
	@PrimaryColumn()
	id: string

	@Column({ unique: true })
	username: string

	@Column({ unique: true })
	email: string

	@Column()
	password: string

	@Column({
		type: 'enum',
		enum: ['admin', 'operator', 'viewer'],
		default: 'viewer'
	})
	role: 'admin' | 'operator' | 'viewer'

	@Column({ nullable: true })
	firstName: string

	@Column({ nullable: true })
	lastName: string

	@Column({
		type: 'enum',
		enum: ['active', 'inactive'],
		default: 'active'
	})
	status: 'active' | 'inactive'

	@Column({ nullable: true, type: 'datetime' })
	lastLogin: Date

	@Column('simple-json')
	permissions: string[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
