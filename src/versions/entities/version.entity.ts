import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'
import { Service } from '../../services/entities/service.entity'

@Entity('versions')
@Unique('u_version_name_service', ['version_name', 'service'])
export class Version {
  @PrimaryGeneratedColumn('uuid')
    version_id: string

  @Column()
    version_name: string // e.g. "v1.0", "v2.0"

  @ManyToOne(() => Service, service => service.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
    service: Service

  @CreateDateColumn()
    date_created: Date

  @UpdateDateColumn()
    date_updated: Date
}
