import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty } from 'class-validator'

export class CreatePetDto {
  @ApiProperty({ description: '小动物名字' })
  @IsNotEmpty({ message: '名字不能为空' })
  readonly name: string

  @ApiProperty({ description: '出生日期' })
  @IsDateString({}, { message: '生日必须是有效的日期格式，例如 2022-08-09' })
  readonly birthday: string
}
