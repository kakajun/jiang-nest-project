import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { AuthEntity } from './entities/auth.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt' // 保留导入，因为后续会用到
import { RedisService } from '../redis/redis.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity) private readonly auth: Repository<AuthEntity>,
    private readonly jwtService: JwtService, // 修改为小写驼峰命名法
    private readonly redisService: RedisService, // 注册redis控制器
  ) {}

  // 注册
  async signup(signupData: CreateAuthDto) {
    const findUser = await this.auth.findOne({
      where: { username: signupData.username },
    })
    if (findUser && findUser.username === signupData.username)
      return '用户已存在'
    // 对密码进行加密处理
    signupData.password = bcryptjs.hashSync(signupData.password, 10)
    await this.auth.save(signupData)
    // 尝试将注册成功的用户存入redis中
    this.redisService.set(signupData.username, signupData.password)
    return '注册成功'
  }

  // 登录
  async login(loginData: CreateAuthDto) {
    const findUser = await this.auth.findOne({
      where: { username: loginData.username },
    })
    // 没有找到
    if (!findUser) return new BadRequestException('用户不存在')

    // 找到了对比密码
    const compareRes: boolean = bcryptjs.compareSync(
      loginData.password,
      findUser.password,
    )
    // 密码不正确
    if (!compareRes) return new BadRequestException('密码不正确')
    const payload = { username: findUser.username }

    return {
      access_token: this.jwtService.sign(payload),
      msg: '登录成功',
    }
  }
}
