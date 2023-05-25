import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { AuthGuardWS } from '../guards/authWS.guard';
import { MessagesService } from '../messages/messages.service';
import { ReactionService } from '../reaction/reaction.service';

@Injectable()
@WebSocketGateway()
export class MyGateway {
  constructor(
    @Inject(MessagesService) private readonly messageService: MessagesService,
    @Inject(ReactionService) private readonly reactionService: ReactionService,
    @Inject('SOCKET_IO') private readonly socket: Socket,
  ) {}

  @UseGuards(AuthGuardWS)
  @SubscribeMessage('chat')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    const data = await this.messageService.create(payload);
    client.broadcast.emit('chat', data);
  }

  @SubscribeMessage('reaction-create')
  async handleReactionCreate(client: Socket, payload: any): Promise<void> {
    const data = await this.reactionService.create(payload);
    client.broadcast.emit('reaction-create', data);
  }

  @SubscribeMessage('reaction-update')
  async handleReactionUpdate(client: Socket, payload: any): Promise<void> {
    const data = await this.reactionService.update(payload);
    client.broadcast.emit('reaction-update', data);
  }

  @SubscribeMessage('reaction-remove')
  async handleReactionRemove(client: Socket, payload: any): Promise<void> {
    const data = await this.reactionService.remove(
      payload.authorId,
      payload.messageId,
    );
    client.broadcast.emit('reaction-remove', data);
  }

  @SubscribeMessage('error')
  handleError(client: Socket, error: any) {
    client.emit('error', error);
  }
}
