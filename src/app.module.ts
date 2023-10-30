import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { ProjectModule } from './project/project.module';
import { EmployeeModule } from './employee/employee.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './Auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FcmNotificationModule } from './fcm-notification/fcm-notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CompanyModule,
    ProjectModule,
    EmployeeModule,
    FcmNotificationModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      global: true
    }),
    FcmNotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
