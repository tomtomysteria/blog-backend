import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from './article.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Category])],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
