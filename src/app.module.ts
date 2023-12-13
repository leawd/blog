import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailValidationService } from './helper.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
      dbName: 'blog',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailValidationService],
  exports: [EmailValidationService],
})
export class AppModule {}
