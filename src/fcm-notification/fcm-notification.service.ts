import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
//import * as serviceAccounts from './service'


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: `${process.env.project_id}`,  // replace with your app project-ID
    clientEmail: `${process.env.client_email}`, //replace with your app CLIENT-KEY
    privateKey: `${process.env.private_key}`
  }),
});
console.log(process.env)
@Injectable()
export class FcmNotificationService {
  constructor() {
  }
  async sendingNotificationOneUser(token:string , title , msg , projectDetails ) {
    const payload= {
      token: token,
      notification: {
        title: title,
        msg: msg
      },
      data: {
        projectDetails:projectDetails ,
      }
      }
    return admin.messaging().send(payload).then((res)=>{
      return {
          success:true
      }

    }).catch((error)=>{
      return {
        success:false
      }
    })
  }
}
