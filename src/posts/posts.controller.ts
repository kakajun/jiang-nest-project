import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger'
import { PostsService, PostsRo } from './posts.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dot'
import { UpdatePostDto } from './dto/update-post.dto' // 假设你有一个 DTO 来定义请求体
import { LoggerService } from '../logger/logger.service'

@ApiTags('文章')
@Controller('post')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '创建文章' })
  @ApiBearerAuth()
  @Post('/create')
  async create(@Body() post: CreatePostDto) {
    return await this.postsService.create(post)
  }

  /**
   * 获取所有文章
   */
  @ApiOperation({ summary: '获取文章列表' })
  @ApiBearerAuth()
  @Get('/findAll')
  async findAll(@Query() query): Promise<PostsRo> {
    this.logger.log('Finding all posts with query:', query)
    try {
      const result = await this.postsService.findAll(query)
      this.logger.log('Posts found successfully:', result)
      return result
    } catch (error) {
      this.logger.error('Error finding all posts:', error)
      throw error
    }
  }

  /**
   * 获取指定文章
   * @param id
   */
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: '文章的唯一标识符',
    type: String,
  })
  async findById(@Param('id') id) {
    return await this.postsService.findById(id)
  }

  /**
   * 更新文章
   * @param id
   * @param post
   */
  @ApiBearerAuth()
  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: '文章的唯一标识符',
    type: String,
  })
  @ApiBody({ type: UpdatePostDto, description: '更新文章的内容' })
  async update(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return await this.postsService.updateById(id, post)
  }

  /**
   * 删除
   * @param id
   */
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: '文章的唯一标识符',
    type: String,
  })
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(id)
  }
}
