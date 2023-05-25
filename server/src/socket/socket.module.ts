import { Module } from '@nestjs/common';
import { io } from 'socket.io-client';

import { AuthGuardWS } from 'src/guards/authWS.guard';
import { MyGateway } from './socket.gateway';
import { MessagesModule } from '../messages/messages.module';
import { MessagesService } from '../messages/messages.service';
import { ReactionModule } from '../reaction/reaction.module';
import { ReactionService } from '../reaction/reaction.service';

export const socketProvider = {
  provide: 'SOCKET_IO',
  useFactory: () => io('http://localhost:3333'),
};

@Module({
  imports: [MessagesModule, ReactionModule],
  providers: [
    MyGateway,
    AuthGuardWS,
    MessagesService,
    ReactionService,
    socketProvider,
  ],
  exports: [socketProvider],
})
export class SocketModule {}
