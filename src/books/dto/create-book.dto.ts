import { IsNotEmpty, IsString, IsPositive } from "class-validator";

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  isbn: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  publisher: string;
  @IsNotEmpty()
  @IsString()
  edition: string;
  @IsNotEmpty()
  @IsString()
  volume: string;
  @IsNotEmpty()
  @IsString()
  bookCatId: string;
  @IsPositive()
  quantity: number;
  @IsNotEmpty()
  @IsString()
  dateOfPublication: Date;
  @IsNotEmpty()
  @IsString()
  authorId: string;
}
