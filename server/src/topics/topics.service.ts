import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTopicDto: CreateTopicDto) {
    try {
      const response = await this.prisma.topic.create({
        data: {
          text: createTopicDto.topic,
          userId: createTopicDto.authorId,
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
        topic: response.text,
        author: response.user.login,
      };
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    try {
      const response = await this.prisma.topic.findMany({
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
        topic: item.text,
        author: item.user.login,
      }));
      return {
        result: {
          topics: result,
        },
      };
    } catch (e) {
      throw e;
    }
  }
}
