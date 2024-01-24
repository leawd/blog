import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
  ForbiddenException,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostInterface } from './interfaces/posts';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { UsersService } from 'src/users/users.service';
import { Post as PostSchema } from './schemas/posts.schema';

@ApiTags('admin')
@Controller('admin')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}
  

  // obtener por userid -----
  async getPostsByUser(@Param('userId') userId: string) {
    const posts = await this.postsService.getPostsByUser(userId);
    return posts;
  }

  // @Get('posts')
  // @UseGuards(JwtAuthGuard, AdminAuthGuard)
  // @ApiOperation({summary:'xxxxxx'})
  // async getPosts(): Promise<PostSchema[]>{
    
  // }

}
