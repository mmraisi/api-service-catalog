import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationDto } from '../../common/dto/pagination.dto'
import { Type } from 'class-transformer'

export class QueryServiceDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fuzzy filter by service name' })
  @IsOptional()
  @IsString()
    service_name?: string

  @ApiPropertyOptional({ description: 'Sort field', example: 'date_created' })
  @IsOptional()
  @IsString()
    sort_field?: string

  @ApiPropertyOptional({ description: 'Sort direction', example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
    sort_direction?: 'ASC' | 'DESC'
}
