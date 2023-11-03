import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
//import * as serviceAccounts from './service'

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.projectId, // replace with your app project-ID
    clientEmail: process.env.clientEmail, //replace with your app CLIENT-KEY
    privateKey: process.env.projectKey
  }),
});

@Injectable()
export class FcmNotificationService {
  constructor() {}

  async sendingNotificationOneUser(token: string, title, msg) {
    const payload = {
      token: token,
      notification: {
        title: title,
        body: msg,
      },
    };
    return admin
      .messaging()
      .send(payload)
      .then((res) => {
        return {
          success: true,
          res: res,
          payload: payload,
        };
      })
      .catch((error) => {
        return {
          error: error,
          success: false,
        };
      });
  }
}
