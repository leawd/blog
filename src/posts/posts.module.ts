import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schemas/posts.schema';
import { EmailValidationService } from 'src/helper.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, EmailValidationService],
  exports: [PostsService],
})
export class PostsModule {}
