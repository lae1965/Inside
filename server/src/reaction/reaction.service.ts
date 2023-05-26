import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionService {
  constructor(private readonly prisma: PrismaService) {}

  private async findFirst(
    authorId: number,
    messageId: number,
  ): Promise<number> {
    try {
      return (
        await this.prisma.reaction.findFirstOrThrow({
          where: {
            userId: authorId,
            messageId,
          },
          select: {
            id: true,
          },
        })
      ).id;
    } catch (e) {
      throw e;
    }
  }

  async create(createReactionDto: CreateReactionDto) {
    try {
      const response = await this.prisma.reaction.create({
        data: {
          userId: createReactionDto.authorId,
          messageId: createReactionDto.messageId,
          reaction: createReactionDto.reaction,
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
        reaction: response.reaction,
        messageId: response.messageId,
        author: response.user.login,
        authorId: response.userId,
      };
    } catch (e) {
      throw e;
    }
  }

  async update(createReactionDto: CreateReactionDto) {
    try {
      const response = await this.prisma.reaction.update({
        where: {
          id: await this.findFirst(
            createReactionDto.authorId,
            createReactionDto.messageId,
          ),
        },
        data: {
          reaction: createReactionDto.reaction,
        },
      });
      return {
        reaction: response.reaction,
        messageId: response.messageId,
        authorId: response.userId,
      };
    } catch (e) {
      throw e;
    }
  }

  async remove(authorId: number, messageId: number) {
    try {
      const response = await this.prisma.reaction.delete({
        where: {
          id: await this.findFirst(authorId, messageId),
        },
      });
      return {
        messageId: response.messageId,
        authorId: response.userId,
      };
    } catch (e) {
      throw e;
    }
  }
}
