import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { AuthGuardWS } from 'src/guards/authWS.guard';
import { MessagesService } from '../messages/messages.service';

@Injectable()
@WebSocketGateway()
export class MyGateway {
  constructor(
    @Inject(MessagesService) private readonly messageService: MessagesService,
    @Inject('SOCKET_IO') private readonly socket: Socket,
  ) {}

  @UseGuards(AuthGuardWS)
  @SubscribeMessage('chat')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    const data = await this.messageService.create(payload);
    client.broadcast.emit('chat', data);
  }

  @SubscribeMessage('error')
  handleError(client: Socket, error: any) {
    client.emit('error', error);
  }
}
