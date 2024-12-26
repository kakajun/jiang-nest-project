import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PetEntity } from './entities/pet.entity'

export interface PetRo {
  list: PetEntity[]
  count: number
}

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private readonly postsRepository: Repository<PetEntity>,
  ) {}
  async create(post: Partial<PetEntity>): Promise<PetEntity> {
    const { name } = post
    const doc = await this.postsRepository.findOne({ where: { name } })
    if (doc) {
      throw new HttpException('小动物已存在', 401)
    }
    return await this.postsRepository.save(post)
  }

  async findAll(query): Promise<PetRo> {
    const qb = this.postsRepository.createQueryBuilder('post')
    qb.orderBy('post.create_time', 'DESC')
    const count = await qb.getCount()
    const { pageNum = 1, pageSize = 10, ...params } = query
    qb.limit(pageSize)
    qb.offset(pageSize * (pageNum - 1))
    const posts = await qb.getMany()
    return { list: posts, count: count }
  }

  async findById(id: number) {
    return await this.postsRepository.findOne({ where: { id } })
  }

  async updateById(id, post): Promise<PetEntity> {
    const existPost = await this.postsRepository.findOne({ where: { id } })
    if (!existPost) {
      throw new HttpException(`id为${id}的小动物不存在`, 401)
    }
    const updatePost = this.postsRepository.merge(existPost, post)
    return this.postsRepository.save(updatePost)
  }

  async remove(id) {
    const existPost = await this.postsRepository.findOne({ where: { id } })
    if (!existPost) {
      throw new HttpException(`id为${id}的小动物不存在`, 401)
    }
    return await this.postsRepository.remove(existPost)
  }
}
