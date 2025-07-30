import { Module } from '@nestjs/common'
import { ServicesModule } from './services/services.module'
import { VersionsModule } from './versions/versions.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from './services/entities/service.entity'
import { Version } from './versions/entities/version.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [Service, Version],
        synchronize: true // don't use in production
      })
    }),
    ServicesModule,
    VersionsModule
  ]
})
export class AppModule { }
