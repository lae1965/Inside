import { Module } from '@nestjs/common';
import { io } from 'socket.io-client';

import { AuthGuardWS } from 'src/guards/authWS.guard';
import { MyGateway } from './socket.gateway';
import { MessagesModule } from '../messages/messages.module';
import { MessagesService } from './../messages/messages.service';

export const socketProvider = {
  provide: 'SOCKET_IO',
  useFactory: () => io('http://localhost:3333'),
};

@Module({
  imports: [MessagesModule],
  providers: [MyGateway, AuthGuardWS, MessagesService, socketProvider],
  exports: [socketProvider],
})
export class SocketModule {}
