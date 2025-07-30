import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
    page?: number = 1

  @ApiPropertyOptional({ description: 'Number of results per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
    limit?: number = 10

  get offset (): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10)
  }
}
