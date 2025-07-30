import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common'
import { ServicesService } from './services.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { Service } from './entities/service.entity'
import { UpdateServiceDto } from './dto/update-service.dto'

@Controller('services')
export class ServicesController {
  constructor (private readonly servicesService: ServicesService) { }

  @Post()
  async create (@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return await this.servicesService.create(createServiceDto)
  }

  @Get()
  async findAll () {
    return await this.servicesService.findAll()
  }

  @Get(':serviceId')
  async findOne (@Param('serviceId') serviceId: string): Promise<Service> {
    return await this.servicesService.findOne(serviceId)
  }

  @Patch(':serviceId')
  async update (@Param('serviceId') serviceId: string, @Body() updateServiceDto: UpdateServiceDto): Promise<Service> {
    return await this.servicesService.update(serviceId, updateServiceDto)
  }

  @HttpCode(204)
  @Delete(':serviceId')
  async remove (@Param('serviceId') serviceId: string): Promise<void> {
    return await this.servicesService.remove(serviceId)
  }
}
