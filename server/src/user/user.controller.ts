import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

interface User extends Request {
  user: {
    id: number;
    login: string;
    avatar?: string;
    aliasName?: string;
    aliasColor?: string;
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

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @Get('auth')
  @UseGuards(AuthGuard)
  auth(@Req() req: User) {
    return {
      id: req.user.id,
      login: req.user.login,
      avatar: req.user.avatar,
      aliasName: req.user.aliasName,
      aliasColor: req.user.aliasColor,
    };
  }
}
