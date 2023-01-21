import { Module } from '@nestjs/common';
import { LibrariesModule } from './libraries/libraries.module';
import { AuthorsModule } from './authors/authors.module';
import { DepartmentsModule } from './departments/departments.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { BookCatsModule } from './book-cats/book-cats.module';

@Module({
  imports: [
    LibrariesModule,
    AuthorsModule,
    DepartmentsModule,
    UsersModule,
    BooksModule,
    BookCatsModule,
    AuthModule,
    UtilsModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BookCatsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
