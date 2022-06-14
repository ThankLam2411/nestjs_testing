import * as firebase from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import 'dotenv/config';

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

export const db = firebase.firestore();
