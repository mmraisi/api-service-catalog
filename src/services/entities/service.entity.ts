import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Version } from '../../versions/entities/version.entity'

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
    service_id: string

  @Index('idx_service_name')
  @Column({ unique: true })
    service_name: string

  @Column({ nullable: true })
    service_description: string

  @CreateDateColumn()
    date_created: Date

  @UpdateDateColumn()
    date_updated: Date

  @OneToMany(() => Version, version => version.service, { cascade: true })
    versions: Version[]
}
