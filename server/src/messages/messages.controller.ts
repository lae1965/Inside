import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':topicId')
  async findAll(@Param('topicId') topicId: string) {
    return await this.messagesService.findAll(+topicId);
  }
}
