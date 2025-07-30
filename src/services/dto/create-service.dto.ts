import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
    service_name: string

  @IsString()
  @MaxLength(500)
    service_description?: string
}
