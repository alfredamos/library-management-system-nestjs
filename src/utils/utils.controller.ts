import { Controller, Get, Param} from '@nestjs/common';
import { UtilsService } from './utils.service';
import { AllUserCategories } from 'src/constants/all-category.constant';
import { Roles } from 'src/decorators/roles.decorator';


@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Roles(...AllUserCategories)
  @Get('author-books/:authorId')
  findAllBooksRequestByAuthorId(@Param('authorId') authorId: string) {
    return this.utilsService.findAllBooksByAuthorId(authorId);
  }

  @Roles(...AllUserCategories)
  @Get('category-books/:bookCatId')
  findAllBooksRequestByBookCatId(@Param('bookCatId') bookCatId: string) {
    return this.utilsService.findAllBooksByBookCatId(bookCatId);
  }

  @Roles(...AllUserCategories)
  @Get('book-libraries/:bookId')
  findAllLibraryRequestsByBookId(@Param('bookId') bookId: string) {
    return this.utilsService.findAllLibraryRequestsByBookId(bookId);
  }

  @Roles('Admin')
  @Get('user-libraries/:userId')
  findAllLibraryRequestsByUserId(@Param('userId') userId: string) {
    return this.utilsService.findAllLibraryRequestsByUserId(userId);
  }
}
