import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { checkAuth } from './../util/checkAuth';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const user = checkAuth(req.headers.authorization);
      req.user = user;
      return true;
    } catch (e) {
      throw e;
    }
  }
}
