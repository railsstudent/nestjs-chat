import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import { RedisIoAdapter } from './events/adapters';
// import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet(), compression());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // limit each IP to 100 requests per windowMs
    }),
  );
  app.enableCors({ origin: (origin, callback) => {
      const whitelist = ['http://localhost:8080', 'http://localhost:3002'];
      if (!origin) {
        return callback(null, true);
      }
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    } 
  });

  // app.useWebSocketAdapter(new WsAdapter(app));
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  await app.listen(3002);
}
bootstrap();
