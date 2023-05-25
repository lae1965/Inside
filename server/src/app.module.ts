import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TopicsModule } from './topics/topics.module';
import { MessagesModule } from './messages/messages.module';
import { SocketModule } from './socket/socket.module';
import { ReactionModule } from './reaction/reaction.module';

@Module({
  imports: [
    UserModule,
    TopicsModule,
    MessagesModule,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
      },
    }),
    ConfigModule.forRoot(),
    SocketModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
