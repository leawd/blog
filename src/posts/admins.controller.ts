import {
  Controller,
  Get,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostInterface } from './interfaces/posts';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { UsersService } from 'src/users/users.service';

@UseGuards(JwtAuthGuard, AdminAuthGuard)
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  private isAdmin(req) {
    const user = req.user;

    // Verificar si el usuario es un administrador o el creador del post
    const isAdmin = user.roles.includes('ADMIN');

    if (!isAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }
    return true;
  }

  @Get()
  @ApiOperation({
    summary: 'Devuelve todos los posts solo para ADMIN',
  })
  adminFindAll(@Req() req): Promise<PostInterface[]> | null {
    this.isAdmin(req);
    return this.postsService.findAll();
  }
}
