import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { decode } from 'js-base64';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import * as jwt from 'jsonwebtoken';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private decodeDto(createUserDto: CreateUserDto) {
    return {
      login: decode(createUserDto.login),
      password: decode(createUserDto.password),
    };
  }

  private generateToken(payload: {
    id: number;
    login: string;
    avatar?: string;
    aliasName?: string;
    aliasColor?: string;
  }) {
    return jwt.sign(payload, process.env.KEY, { expiresIn: '24h' });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { login, password } = this.decodeDto(createUserDto);
      if (await this.prisma.user.findFirst({ where: { login } })) {
        throw new HttpException(
          `Пользователь с логином "${login}" уже существует`,
          HttpStatus.CONFLICT,
        );
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const id = (
        await this.prisma.user.create({
          data: { ...createUserDto, password: hashPassword, login },
          select: { id: true },
        })
      ).id;
      return {
        id,
        token: this.generateToken({
          id,
          login,
          avatar: createUserDto.avatar,
          aliasColor: createUserDto.aliasColor,
          aliasName: createUserDto.aliasName,
        }),
      };
    } catch (e) {
      throw e;
    }
  }

  async login(createUserDto: CreateUserDto) {
    try {
      const { login, password } = this.decodeDto(createUserDto);
      const user = await this.prisma.user.findFirst({ where: { login } });
      if (!user) {
        throw new HttpException(
          `Пользователя с логином "${login}" не существует`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!(await bcrypt.compare(password, user.password))) {
        throw new HttpException('Неправильный пароль', HttpStatus.UNAUTHORIZED);
      }
      return {
        id: user.id,
        aliasName: user.aliasName,
        aliasColor: user.aliasColor,
        token: this.generateToken({
          id: user.id,
          login,
          avatar: user.avatar,
          aliasColor: user.aliasColor,
          aliasName: user.aliasName,
        }),
      };
    } catch (e) {
      throw e;
    }
  }
}
