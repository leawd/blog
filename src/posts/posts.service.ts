import {Body, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, ValidationPipe, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, MongooseError } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/posts.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) public postModel: Model<Post>,
    private readonly titleLengthMin: 20,
    private readonly titleLengthMax: 150,
    private readonly contentLengthMin: 500,
    private readonly contentLengthMax: 10000,
    private postsService: PostsService,
    // private readonly emailValidationService: EmailValidationService,
  ) {}

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
    const user = await this.postsService.findOne(createPostDto.user_id);
    if (!user) {
      throw new NotFoundException('Autor no encontrado');
    }

    // categorías -----
    if (!createPostDto.categories || createPostDto.categories.length == 0) {
      throw new HttpException(
        `Debe idnicar al menos 1 categoría para el post`,
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
    return this.postModel.updateOne({ _id: id }, UpdatePostDto).lean();
  }

  async remove(id: string): Promise<Post> {
    return this.postModel.deleteOne({ _id: id }).lean();
  }
}
