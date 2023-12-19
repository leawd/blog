import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true})
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  categories: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
