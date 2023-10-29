import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class OTP extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Employee' })
  employeeId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expirationTime: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
