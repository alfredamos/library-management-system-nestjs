import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBookCatDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
