import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
//import * as serviceAccounts from './service'

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'taskunityproject', // replace with your app project-ID
    clientEmail:
      'firebase-adminsdk-vg56w@taskunityproject.iam.gserviceaccount.com', //replace with your app CLIENT-KEY
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCy12nXzuRySQMn\nd8mfrHZbtLtZAaZcR4PxHhsD7FeQ5VHbzMPsuY0CBhQv2zNp2NQOq63BZySc+nSf\n1ViNzbs6E0f13zUB0ebm8uqOwhRqR0VmLNsXLGbrFiv6MdTGHyd3PRYgH1NxaflZ\nJCe7W4w8yRPCLFpBJl2jMh9ppGRJ8d+76w2zZKTbFqRLcf1oKRunSdy+dnDRC/Mv\n2c8D4edBk3HxUvOEXhY3o9mC/VxrrSrZ6cAnO/VK9YMqOoLfcfPiia1prJDRTM5C\nlNndPQHsuWhfOZeEV+yZ2L9SNiMVVU5nzW3E+l6JM0dNncnvc40pLEWB+k2TLFQj\nTqvmp6cjAgMBAAECggEAOeMp+lWYcjmZ0MOgOpPbN7HXVmcHTyVC2t/wxKNScK8Z\ngPjVjiE9OCN5k0fza1ZoxVrighB9tGYJK9cls7ic2p51E2utP6qOf8CvFYhSjVgG\naZ0pSWXw5jUmBPTuNzbMUncuWzVoj/RKZoUiay2lxeMcByTODfp6IqHNsycn4xrh\nK2BE3+2/xub1eWAy4Rb3JJJloh4pvnpBDasSbgMM3yZEyJqNeqooP3UDHpsncPxu\nCD5pErJwc7Ym9jygcI0wAFtsvHVgWzv4dTXlKtxf4VwtjjTfAXD3VHhLnRhFr6BS\nsizlm/R9K9QhPzvJxy3DmNL1Ljm7NapjgFCfwL+GIQKBgQDsNTPHIxfsBxVy3gEh\nssGvNbqhJUtkCXX5NFEPt56YGGzospze2GboR4hSzSfItegVQi+Ljtul4EBwN1e7\nLKjHAkE+loq15Hfx3WVT+AzfhKGIOUzD1fGcQmjk5yUM3VDx8XUW1FkjAMEj+5bi\na9iQDRHRfh4zrUVYijbsIsjTswKBgQDB06sxRfDW2Hwvsp513NgmDl2R+bDpH3EB\nbfM16fmJ24C70uQbfNHqD0a1/EvkTIaYfKdBN5WHU42wEgOueVWRja8VMlLm7OyQ\n+s0juXV39dsvryVgE9HwjVA1rzFAN4jBkATOmL+6H4vqGe8kZdz3sjkz2+dIc67N\nzaK5Y4Dm0QKBgEOVCUZ9vPd0I2flKw+4NIBr8ATxRbvOlSmDFXpYwBCmVGrTx9xe\nsDrfVJrURgDAQzHp6O6WJjQ0kFtLClfsdDHUbFR7AB8AymyyOq6mtxAww4LVWihi\nCyn5Okfb9pbSr7k5q5WnlgVUzu37qvUHhEPa6XE2E3AXsFKf4Qz4+trPAoGATQmU\nQUFLOBlTQqH72VytjHKpPhu/9OhKQgcxY3xbci+MOxrXDxXNWPo5YJumjlbcKD9j\nOsic5eyPpCuEyxPurqthq0sVKDOC0xzb7BcKWWOeepVihY1bJAEGoE/Bg4SPFl/n\niTWs/o0LT0B/jDfwW4K6uaHtix5vm9zfkE+8LAECgYEAgLLCygp2Agy3OvGFVY83\nmFz7+qIsj0d6rmwLhvfXWUR4kaccMasBAND45K3hDO3ND6tHfZXPDgTJ+L0hkfLj\ngqdtb6sVpG9jdkAr5/2FUAwVssZP0heH0mvkMRw3iJMkJi2krwFS/p/E6tUfjsXQ\ndGwHwltB8jvTS6/yNdqbaoc=\n-----END PRIVATE KEY-----\n',
  }),
});

// admin.initializeApp({
// credential: admin.credential.cert({
// projectId: `${process.env.project_id}`,  // replace with your app project-ID
// clientEmail: `${process.env.client_email}`, //replace with your app CLIENT-KEY
//   privateKey: `${process.env.private_key}`
// }),
// });
// console.log(process.env)

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
