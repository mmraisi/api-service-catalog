import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { BearerStrategy } from './bearer.strategy'

@Module({
  imports: [PassportModule],
  providers: [BearerStrategy]
})
export class AuthModule { }
