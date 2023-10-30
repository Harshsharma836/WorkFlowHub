import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FcmNotificationService } from './fcm-notification.service';

@Controller('fcm-notification')
export class FcmNotificationController {
  constructor(private readonly fcmNotificationService: FcmNotificationService) {}

  @Post('send-notification/')
  async sendNotidication(@Body() body:{ token: string }, title , msg , projectDetails) {
  const {token}=body
   return await this.fcmNotificationService.sendingNotificationOneUser(token , title , msg , projectDetails)
  }
}
