import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true})
export class User {
  @Prop()
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: ['ADMIN', 'USER'], default: ['USER'] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
