import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationDto } from '../../common/dto/pagination.dto'
import { IsOptional, IsString } from 'class-validator'

export class QueryVersionDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by version name (case-insensitive)' })
  @IsOptional()
  @IsString()
    version_name?: string
}
