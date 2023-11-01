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
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    // For MongoDB
    MongooseModule.forRoot(process.env.MONGO_URL),

    // Use for Redis Db for Cache memory.
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        }),
      }),
    }),

    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      global: true,
    }),
    // Firebase module for notification.
    FcmNotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
