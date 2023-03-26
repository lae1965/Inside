import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';

import { AuthGuard } from 'src/guards/auth.guard';

@Controller('topic')
@UseGuards(AuthGuard)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  async create(@Body() createTopicDto: CreateTopicDto) {
    return await this.topicsService.create(createTopicDto);
  }

  @Get()
  async findAll() {
    return await this.topicsService.findAll();
  }
}
