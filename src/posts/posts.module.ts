import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schemas/posts.schema';
import { UsersModule } from '../users/users.module';
import { LoggerService } from 'src/logs/logger.service';
import { AdminController } from './admins.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    UsersModule,
  ],
  controllers: [PostsController, AdminController],
  providers: [PostsService, LoggerService],
  exports: [PostsService],
})
export class PostsModule {}
