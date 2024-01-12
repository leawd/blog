import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, MongooseError } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/posts.schema';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class PostsService {
  private titleLengthMin = 20;
  private titleLengthMax = 150;
  private contentLengthMin = 500;
  private contentLengthMax = 10000;

  constructor(
    @InjectModel(Post.name) public postModel: Model<Post>,
    @InjectModel(Post.name) public userModel: Model<User>,
    private usersService: UsersService,
  ) {}

  // Filtro por autor del post -----
  async searchPostsByAuthor(authorName: string) {
    const user = await this.userModel.findOne({ name: authorName }).exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const posts = await this.postModel.find({ user_id: user.id }).exec();
    return posts;
  }

  /**
   * Filtro por categoría de post
   * 
   * @param category String que contiene el nombre de la categoría a buscar
   * @returns 
   */
  async searchPostsByCategory(category: string) {
    const posts = await this.postModel.find({ categories: category }).exec();
    return posts;
  }

  /**
   * Lógica dle endpoint de filtros
   * 
   * @param type String [AUTHOR, CATEGORY]
   * @param query String que contiene lo que se va a buscar
   * @returns Colección de posts
   */
  async searchPostsByType(type: string, query: string) {
    if (type !== 'author' && type !== 'category') {
      throw new BadRequestException('Tipo de búsqueda no válido');
    }

    if (query.length < 3) {
      throw new BadRequestException(
        'El parámetro "query" debe tener al menos 3 caracteres.',
      );
    }

    let results;

    switch (type) {
      case 'author':
        results = await this.searchPostsByAuthor(query);
        break;
      case 'category':
        results = await this.searchPostsByCategory(query);
        break;
      default:
        throw new BadRequestException('Tipo de búsqueda no válido');
    }

    return results;
  }

  /**
   * Guarda registro de usuario en base de datos
   *
   * @param createPostDto
   * @returns Promise<Post>
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    // INI VALIDACIONES -----
    // title -----
    if (
      !createPostDto.title ||
      createPostDto.title.length < this.titleLengthMin ||
      createPostDto.title.length > this.titleLengthMax
    ) {
      throw new HttpException(
        `El título del post es obligatorio y debe tener entre ${this.titleLengthMin} y ${this.titleLengthMax} caracteres`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // contenido -----
    if (
      !createPostDto.content ||
      createPostDto.content.length < this.contentLengthMin ||
      createPostDto.content.length > this.contentLengthMax
    ) {
      throw new HttpException(
        `El contenido del post es obligatorio y debe tener entre ${this.contentLengthMin} y ${this.contentLengthMax} caracteres`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // autor -----
    const user = await this.usersService.findOne(createPostDto.user_id);
    if (!user) {
      throw new NotFoundException('Autor no encontrado');
    }

    // categorías -----
    if (!createPostDto.categories || createPostDto.categories.length == 0) {
      throw new HttpException(
        `Debe indicar al menos 1 categoría para el post`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // FIN VALIDACIONES -----

    // GUARDAR CONTRASEÑA CON HASH -----
    const createdPost = new this.postModel(createPostDto);

    try {
      return await createdPost.save();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al guardar el post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @returns
   */
  async findAll() {
    return this.postModel.find().lean();
  }

  async findOne(id: string) {
    return this.postModel.findOne({ _id: id }).lean();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postModel.updateOne({ _id: id }, updatePostDto).lean();
  }

  async remove(id: string): Promise<Post> {
    return this.postModel.deleteOne({ _id: id }).lean();
  }

  // obtener posts de un usuario determinado -----
  async getPostsByUser(userId: string): Promise<Post[]> {
    // Recupera los posts del usuario específico por su userId
    return this.postModel.find({ user_id: userId }).exec();
  }

  // Búsqueda de posts -----
  async searchPosts(
    query: string,
    pagination: { page: number; limit: number },
  ) {
    const results = await this.postModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Case-insensitive  -----
          { user_id: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { categories: { $in: [query] } },
        ],
      })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();

    return results;
  }
}
