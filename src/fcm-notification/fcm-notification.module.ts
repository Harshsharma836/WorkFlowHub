import { Module } from '@nestjs/common';
import { FcmNotificationService } from './fcm-notification.service';
import { FcmNotificationController } from './fcm-notification.controller';

@Module({
  controllers: [FcmNotificationController],
  providers: [FcmNotificationService],
})
export class FcmNotificationModule {}
