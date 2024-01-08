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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostInterface } from './interfaces/posts';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { UsersService } from 'src/users/users.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  // búsqueda de posts, lo puse primero porque sino daba ----
  // error la url con la de GET por :id -----
  @Get('search')
  searchPosts(
    @Query('query') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.searchPosts(query, { page, limit });
  }

  // ENDPOINT para obtener por categoría -----
  @Get('category/:category')
  getPostsByCategory(
    @Param('category') category: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    // Llama a la función en el servicio para obtener posts por categoría
    return this.postsService.getPostsByCategory(category, { page, limit });
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo post' })
  @ApiBody({ type: CreatePostDto, description: 'Datos del post a crear' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(): Promise<PostInterface[]> | null {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostInterface> | null {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ): Promise<PostInterface> | null {
    // Obtener el usuario desde el token JWT -----
    const user = req.user;

    const post = await this.postsService.findOne(id);

    // Verificar si el usuario es un administrador o el creador del post
    const isAdmin = user.roles.includes('ADMIN');
    const isPostCreator = post.user_id === user.id;

    if (!isAdmin && !isPostCreator) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<PostInterface> | null {
    return this.postsService.remove(id);
  }

  // obtener por userid -----
  @Get('user/:userId')
  async getPostsByUser(@Param('userId') userId: string) {
    const posts = await this.postsService.getPostsByUser(userId);
    return posts;
  }
}
