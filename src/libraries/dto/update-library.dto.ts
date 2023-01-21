import { PartialType } from '@nestjs/mapped-types';
import { CreateLibraryDto } from './create-library.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLibraryDto extends PartialType(CreateLibraryDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
