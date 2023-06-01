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
              avatar: true,
              aliasName: true,
              aliasColor: true,
            },
          },
        },
      });
      return {
        id: response.id,
        message: response.text,
        author: response.user.login,
        avatar: response.user.avatar,
        aliasName: response.user.aliasName,
        aliasColor: response.user.aliasColor,
        reactions: [],
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
              avatar: true,
              aliasName: true,
              aliasColor: true,
            },
          },
          Reaction: {
            select: {
              reaction: true,
              user: {
                select: {
                  id: true,
                  login: true,
                  avatar: true,
                  aliasName: true,
                  aliasColor: true,
                },
              },
            },
          },
        },
      });

      const result = response.map((item) => ({
        id: item.id,
        message: item.text,
        author: item.user.login,
        avatar: item.user.avatar,
        aliasName: item.user.aliasName,
        aliasColor: item.user.aliasColor,
        reactions: item.Reaction.map((reaction) => ({
          reaction: reaction.reaction,
          author: reaction.user.login,
          authorId: reaction.user.id,
          avatar: reaction.user.avatar,
          aliasName: reaction.user.aliasName,
          aliasColor: reaction.user.aliasColor,
        })),
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

  async update(id: number, message: string) {
    try {
      await this.prisma.message.update({
        where: { id },
        data: { text: message },
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.message.delete({ where: { id } });
    } catch (e) {
      throw e;
    }
  }
}
