import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const checkAuth = (authorization: string) => {
  try {
    if (authorization) {
      const token = authorization.split(' ')[1];
      if (token) {
        let user: any;
        try {
          user = jwt.verify(token, process.env.KEY);
        } catch {
          user = null;
        }
        if (user) return user;
      }
    }
    throw new HttpException(
      'Пользователь не авторизован',
      HttpStatus.UNAUTHORIZED,
    );
  } catch (e) {
    throw e;
  }
};
