import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Article } from 'src/articles/article.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: User,
  ): Promise<Category> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      createdBy: user.username,
    });
    const result = await this.categoryRepository.save(category);
    this.logger.verbose(
      `Category ${result.name} created successfully by ${user.username}`,
    );
    return result;
  }

  async findAll(): Promise<Category[]> {
    const results = await this.categoryRepository.find();
    this.logger.verbose(`Found ${results.length} categories`);
    return results;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: User,
  ): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    category.updatedBy = user.username;
    const updatedCategory = await this.categoryRepository.save(category);
    this.logger.verbose(`Category with ID: ${id} updated successfully`);
    return updatedCategory;
  }

  async delete(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.markArticlesAsDeleted(category.id);
    await this.categoryRepository.remove(category);
    this.logger.verbose(`Category with ID: ${id} deleted successfully`);
  }

  private async markArticlesAsDeleted(categoryId: string): Promise<void> {
    // Soft delete des articles de cette catégorie (si ce n'est pas déjà fait)
    await this.articleRepository
      .createQueryBuilder()
      .softDelete()
      .from(Article)
      .where('categoryId = :categoryId', { categoryId })
      .execute();
  }
}
