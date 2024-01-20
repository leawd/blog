import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { EmailValidationService } from 'src/helper.service';
import { AdminsController } from './admins.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController, AdminsController],
  providers: [UsersService, EmailValidationService],
  exports: [UsersService],
})
export class UsersModule {}
