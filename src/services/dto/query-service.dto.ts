import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class QueryServiceDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fuzzy filter by service name' })
  @IsOptional()
  @IsString()
    service_name?: string
}
