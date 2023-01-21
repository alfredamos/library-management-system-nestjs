import { Category } from "@prisma/client";
import { Book } from './book.model';
import { User } from "./user.model";

export class LibraryInfo{
    requesterCategory: Category;
    dateBookOut: Date;
    dateBookDue: Date;
    book: Book;
    user: User;
}