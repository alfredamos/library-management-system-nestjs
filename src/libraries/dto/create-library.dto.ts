import {Category} from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString, IsOptional } from "class-validator"

export class CreateLibraryDto {
  @IsEnum(Category)
  requesterCategory: Category;
  @IsNotEmpty()
  @IsString()
  userId: string;
  @IsNotEmpty()
  @IsString()
  bookId: string;
  @IsOptional() 
  dateBookOut: Date;
  @IsOptional()
  dateBookDue?: Date;
  @IsOptional()
  dateBookReturn?: Date;
}
