import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode } from '@nestjs/common'
import { VersionsService } from './versions.service'
import { CreateVersionDto } from './dto/create-version.dto'
import { UpdateVersionDto } from './dto/update-version.dto'

@Controller('services/:serviceId/versions')
export class VersionsController {
  constructor (private readonly versionsService: VersionsService) { }

  @Post()
  async create (
  @Param('serviceId') serviceId: string,
    @Body() createVersionDto: CreateVersionDto
  ) {
    return await this.versionsService.create(serviceId, createVersionDto)
  }

  @Get()
  async findAll (@Param('serviceId') serviceId: string) {
    return await this.versionsService.findAll(serviceId)
  }

  @Get(':versionId')
  async findOne (
  @Param('serviceId') serviceId: string,
    @Param('versionId') versionId: string
  ) {
    return await this.versionsService.findOne(serviceId, versionId)
  }

  @Patch(':versionId')
  async update (
  @Param('serviceId') serviceId: string,
    @Param('versionId') versionId: string,
    @Body() updateDto: UpdateVersionDto
  ) {
    return await this.versionsService.update(serviceId, versionId, updateDto)
  }

  @Delete(':versionId')
  @HttpCode(204)
  async remove (
  @Param('serviceId') serviceId: string,
    @Param('versionId') versionId: string
  ) {
    return await this.versionsService.remove(serviceId, versionId)
  }
}
