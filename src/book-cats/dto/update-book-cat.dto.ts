import { PartialType } from '@nestjs/mapped-types';
import { CreateBookCatDto } from './create-book-cat.dto';
import {IsString, IsNotEmpty} from 'class-validator';

export class UpdateBookCatDto extends PartialType(CreateBookCatDto) {
    @IsNotEmpty()
    @IsString()
    id: string;
}
