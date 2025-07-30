import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-http-bearer'

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor (private readonly configService: ConfigService) {
    super()
  }

  validate (token: string): boolean {
    const validToken = this.configService.get<string>('AUTH_TOKEN')
    if (token === validToken) {
      return true
    }
    throw new UnauthorizedException('Invalid token')
  }
}
