import { BookCat } from "./category.model";
import { Author } from './author.model';

export class Book{
    isbn: string;
    title: string;
    publisher: string;
    author: Author;
    category: BookCat
}