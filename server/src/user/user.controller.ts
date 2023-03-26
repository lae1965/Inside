import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

interface User extends Request {
  user: {
    id: number;
    login: string;
    iat: number;
    exp: number;
  };
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.userService.login(createUserDto);
  }

  @Get('auth')
  @UseGuards(AuthGuard)
  auth(@Req() req: User) {
    return { id: req.user.id, login: req.user.login };
  }
}
