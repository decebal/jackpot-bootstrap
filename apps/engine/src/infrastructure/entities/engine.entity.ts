import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('engine_requests')
export class EngineEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'json' })
  data: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  })
  status: string;

  @Column({ type: 'json', nullable: true })
  result: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
