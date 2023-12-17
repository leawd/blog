import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto{
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(20, 150)
    @ApiProperty({ description: 'Título de post (entre 20 y 150 caracteres)' })
    title?: string;
  
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(500, 10000)
    @ApiProperty({
      description: 'Contenido del post (entre 500 y 10000 caracteres)',
    })
    content?: string;
  
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @ApiProperty({
      description: 'Categorías del post',
    })
    categories?: string[];
}
