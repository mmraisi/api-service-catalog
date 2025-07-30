import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateServiceDto {
  @ApiProperty({ example: 'My API Service' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
    service_name: string

  @ApiProperty({ example: 'Description of the service' })
  @IsString()
  @MaxLength(500)
    service_description?: string
}
