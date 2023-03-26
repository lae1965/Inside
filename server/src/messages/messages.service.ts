import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMessageDto: CreateMessageDto) {
    try {
      const response = await this.prisma.message.create({
        data: {
          text: createMessageDto.message,
          userId: createMessageDto.authorId,
          topicId: createMessageDto.topicId,
        },
        include: {
          user: {
            select: {
              login: true,
            },
          },
        },
      });
      return {
        id: response.id,
        message: response.text,
        author: response.user.login,
      };
    } catch (e) {
      throw e;
    }
  }

  async findAll(topicId: number) {
    try {
      const response = await this.prisma.message.findMany({
        where: { topicId },
        include: {
          user: {
            select: {
              login: true,
            },
          },
        },
      });
      const result = response.map((item) => ({
        id: item.id,
        message: item.text,
        author: item.user.login,
      }));
      const topic = (
        await this.prisma.topic.findFirst({
          where: { id: topicId },
          select: {
            text: true,
          },
        })
      ).text;
      return {
        topic,
        result,
      };
    } catch (e) {
      throw e;
    }
  }
}
