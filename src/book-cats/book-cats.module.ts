import { Module } from '@nestjs/common';
import { BookCatsService } from './book-cats.service';
import { BookCatsController } from './book-cats.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookCatsController],
  providers: [BookCatsService]
})
export class BookCatsModule {}
