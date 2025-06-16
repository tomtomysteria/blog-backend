import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { Article } from 'src/articles/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Article])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
