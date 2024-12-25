import { Module } from '@nestjs/common'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerService } from '../logger/logger.service'
import { PostsEntity } from './entities/posts.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  controllers: [PostsController],
  providers: [PostsService, LoggerService],
})
export class PostsModule {}
