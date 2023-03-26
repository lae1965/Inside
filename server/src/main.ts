import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { PrismaService } from 'nestjs-prisma';

import { AppModule } from './app.module';

const PORT = +process.env.PORT | 3333;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useWebSocketAdapter(new IoAdapter(app));

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(PORT, () => {
    console.log(`Server has been started on ${PORT} port...`);
  });
}
bootstrap();
