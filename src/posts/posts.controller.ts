import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
  @ApiOperation({
    summary: 'Buscar Posts por título, contenido y más. Permite paginación.',
  })
  searchPosts(
    @Query('query') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.searchPosts(query, { page, limit });
  }

  @Get('filter')
  @ApiOperation({
    summary:
      'Filtra posts por autor o categoría (type) y un texto dado (query)',
  })
  async filterPosts(
    @Query('type') type: string,
    @Query('query') query: string,
  ) {
    try {
      const results = await this.postsService.searchPostsByType(type, query);
      return results;
    } catch (error) {
      // Manejar errores específicos si es necesario
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo post' })
  @ApiBody({ type: CreatePostDto, description: 'Datos del post a crear' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Devuelve todos los posts',
  })
  findAll(): Promise<PostInterface[]> | null {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Devuelve un post específico ne base a su identificador',
  })
  findOne(@Param('id') id: string): Promise<PostInterface> | null {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Actualiza los datos de un post específico. Solo para usuarios ADMIN o el creador del post a actualizar.',
  })
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
  @ApiOperation({
    summary: 'Elimina un post. Solo para usuarios ADMIN o el creador del post a actualizar.',
  })
  async remove(
    @Param('id') id: string,
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

    return this.postsService.remove(id);
  }

  // obtener por userid -----
  @Get('user/:userId')
  @ApiOperation({
    summary: 'Devuelve todos los posts de un usuario dado.',
  })
  async getPostsByUser(@Param('userId') userId: string) {
    const posts = await this.postsService.getPostsByUser(userId);
    return posts;
  }
}
