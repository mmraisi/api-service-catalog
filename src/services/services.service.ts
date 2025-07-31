import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Service } from './entities/service.entity'
import { FindManyOptions, FindOptionsOrder, ILike, Repository } from 'typeorm'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { QueryServiceDto } from './dto/query-service.dto'

@Injectable()
export class ServicesService {
  constructor (
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) { }

  async create (createDto: CreateServiceDto): Promise<Service> {
    // check for a conflicting service name
    const existingService = await this.serviceRepository.findOne({
      where: { service_name: createDto.service_name }
    })
    if (existingService != null) {
      throw new ConflictException(`Service with name '${createDto.service_name}' already exists`)
    }
    const service = this.serviceRepository.create(createDto)
    return await this.serviceRepository.save(service)
  }

  async findAll (query: QueryServiceDto): Promise<Service[]> {
    const { limit = 10, service_name: serviceName, sort_field: sortField, sort_direction: sortDirection } = query
    const offset = query.offset

    const order: FindOptionsOrder<Service> = sortField
      ? { [sortField]: sortDirection || 'ASC' }
      : { date_created: 'DESC' } // default sort

    const options: FindManyOptions<Service> = {
      relations: ['versions'],
      where: {},
      order,
      take: limit,
      skip: offset
    }
    if (serviceName) {
      options.where = { service_name: ILike(`%${serviceName}%`) }
    }

    return await this.serviceRepository.find(options)
  }

  async findOne (id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { service_id: id },
      relations: ['versions']
    })
    if (service == null) throw new NotFoundException(`Service ${id} not found`)
    return service
  }

  async update (id: string, updateDto: UpdateServiceDto): Promise<Service> {
    await this.serviceRepository.update(id, updateDto)
    return await this.findOne(id)
  }

  async remove (id: string): Promise<void> {
    const result = await this.serviceRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Service ${id} not found`)
    }
  }
}
