import { Controller, Post, Body, Get } from '@nestjs/common';
import { FcmNotificationService } from './fcm-notification.service';

@Controller('fcm-notification')
export class FcmNotificationController {
  constructor(
    private readonly fcmNotificationService: FcmNotificationService,
  ) {}

  @Post('/token')
  async sendToken(@Body() msg) {
    console.log(msg.token + 'djsdjsd');
  }

  @Post('send-notification')
  async sendNotidication(@Body() body: { token: string }, @Body() details) {
    const { token } = body;
    const a = details.title;
    return await this.fcmNotificationService.sendingNotificationOneUser(
      token,
      details.title,
      details.msg,
    );
  }
}
