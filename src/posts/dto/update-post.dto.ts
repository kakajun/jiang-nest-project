// src/posts/dto/update-post.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdatePostDto {
  @ApiPropertyOptional({ description: '文章标题' })
  @IsOptional()
  @IsString()
  readonly title?: string

  @ApiPropertyOptional({ description: '作者' })
  @IsOptional()
  @IsString()
  readonly author?: string

  @ApiPropertyOptional({ description: '内容' })
  @IsOptional()
  @IsString()
  readonly content?: string

  @ApiPropertyOptional({ description: '文章封面' })
  @IsOptional()
  @IsString()
  readonly cover_url?: string
}
