import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { checkAuth } from 'src/util/checkAuth';

@Injectable()
export class AuthGuardWS implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('SOCKET_IO') private readonly socket: Socket,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    try {
      checkAuth(client.handshake.auth.token);
      return true;
    } catch (e) {
      this.socket.to(client.id).emit('error', e);
      return false;
    }
  }
}
