import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateVersionDto {
  @ApiProperty({ example: 'v1.0.0' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
    version_name: string
}
