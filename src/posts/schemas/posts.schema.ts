import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true})
export class User {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  categories: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
