import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateVersionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
    version_name: string
}
