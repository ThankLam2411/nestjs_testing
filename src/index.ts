import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as functions from 'firebase-functions';
import { AppModule } from './app.module';
import * as firebase from 'firebase-admin';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

if (!firebase.apps?.length) {
  const firebase_params = {
    type: process.env.FB_TYPE,
    projectId: process.env.FB_PROJECT_ID,
    privateKeyId: process.env.FB_PRIVATE_KEY_ID,
    privateKey: process.env.FB_PRIVATE_KEY
      ? JSON.parse(process.env.FB_PRIVATE_KEY)
      : undefined,
    clientEmail: process.env.FB_CLIENT_EMAIL,
    clientId: process.env.FB_CLIENT_ID,
    authUri: process.env.FB_AUTH_URI,
    tokenUri: process.env.FB_TOKEN_URI,
    authProviderX509CertUrl: process.env.FB_AUTH_PROVIDER_X509_CERT_URL,
    clientC509CertUrl: process.env.FB_CLIENT_X509_CERT_URL,
  };

  firebase.initializeApp({
    credential: firebase.credential.cert(firebase_params),
    databaseURL: process.env.FB_DATABASE_URL,
  });
}
const server = express();

const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  const config = new DocumentBuilder()
    .setTitle('NestJS')
    .setDescription('NestJS API description')
    .setVersion('1.0')
    .addTag('NestJS')
    .addBearerAuth()
    .addServer(
      'https://us-central1-zporter-trial-1234.cloudfunctions.net/lamapi/',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  return app.init();
};
createNestServer(server)
  .then((v) => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));

export const lamapi = functions.https.onRequest(server);
