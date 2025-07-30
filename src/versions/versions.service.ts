import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Version } from './entities/version.entity'
import { Repository } from 'typeorm'
import { CreateVersionDto } from './dto/create-version.dto'
import { Service } from 'src/services/entities/service.entity'
import { UpdateVersionDto } from './dto/update-version.dto'

@Injectable()
export class VersionsService {
  constructor (
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) { }

  async create (serviceId: string, dto: CreateVersionDto): Promise<Version> {
    const service = await this.serviceRepository.findOneBy({ service_id: serviceId })
    if (service == null) {
      throw new NotFoundException(`Service ${serviceId} not found`)
    }
    // check if the version already exists for the service
    const existingVersion = await this.versionRepository.findOne({
      where: { version_name: dto.version_name, service: { service_id: serviceId } }
    })

    if (existingVersion != null) {
      throw new ConflictException(`Version ${dto.version_name} already exists for service ${serviceId}`)
    }

    const version = this.versionRepository.create({
      ...dto,
      service // Associate with the service
    })

    return await this.versionRepository.save(version)
  }

  async findAll (serviceId: string): Promise<Version[]> {
    return await this.versionRepository.find({
      where: { service: { service_id: serviceId } },
      relations: ['service']
    })
  }

  async findOne (serviceId: string, versionId: string): Promise<Version> {
    const version = await this.versionRepository.findOne({
      where: { version_id: versionId, service: { service_id: serviceId } },
      relations: ['service']
    })

    if (version == null) {
      throw new NotFoundException(`Version ${versionId} for service ${serviceId} not found`)
    }

    return version
  }

  async update (serviceId: string, versionId: string, dto: UpdateVersionDto): Promise<Version> {
    const version = await this.findOne(serviceId, versionId)
    Object.assign(version, dto)
    return await this.versionRepository.save(version)
  }

  async remove (serviceId: string, versionId: string): Promise<void> {
    const result = await this.versionRepository.delete({ version_id: versionId, service: { service_id: serviceId } })
    if (result.affected === 0) {
      throw new NotFoundException(`Version ${versionId} not found`)
    }
  }
}
