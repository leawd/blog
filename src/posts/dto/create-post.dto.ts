import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Length(20, 150)
  @ApiProperty({ description: 'Título de post (entre 20 y 150 caracteres)' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'ID del usuario al que pertenece el post' })
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @Length(500, 10000)
  @ApiProperty({
    description: 'Contenido del post (entre 500 y 10000 caracteres)',
  })
  content: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Categorías del post',
  })
  categories: string[];
}
