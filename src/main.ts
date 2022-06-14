import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe());
//   // app.useGlobalFilters(new HttpExceptionFilter());

//   const config = new DocumentBuilder()
//     .setTitle('NestJS')
//     .setDescription('NestJS API description')
//     .setVersion('1.0')
//     .addTag('NestJS')
//     .addBearerAuth()
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   await app.listen(3000);
// }
// bootstrap();

const server: express.Express = express();

export const createNestServer = async (
  expressInstance: express.Express,
): Promise<NestExpressApplication> => {
  const adapter: ExpressAdapter = new ExpressAdapter(expressInstance);
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, adapter, {});

  app.enableCors();

  return app.init();
};

createNestServer(server)
  .then((v) => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));

export const api: functions.HttpsFunction = functions.https.onRequest(server);
