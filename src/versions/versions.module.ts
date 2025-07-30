import { Module } from '@nestjs/common'
import { VersionsController } from './versions.controller'
import { VersionsService } from './versions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Version } from './entities/version.entity'
import { Service } from 'src/services/entities/service.entity'
import { ServicesModule } from 'src/services/services.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Version, Service])
  ],
  controllers: [VersionsController],
  providers: [VersionsService],
  exports: [VersionsService]
})
export class VersionsModule { }
