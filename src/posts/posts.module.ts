import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './posts.service';
import { UsersController } from './posts.controller';
import { User, UserSchema } from './schemas/posts.schema';
import { EmailValidationService } from 'src/helper.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailValidationService],
  exports: [UsersService],
})
export class UsersModule {}
