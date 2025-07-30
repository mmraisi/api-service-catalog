import { Module } from '@nestjs/common'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from './entities/service.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService] // Exporting the service for use in other modules
})
export class ServicesModule { }
