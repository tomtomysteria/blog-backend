import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { sanitizeContent } from 'src/utils/sanitize-content.util';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  // Create a new article with validation of author and category
  async create(
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<Article> {
    const { title, content, authorId, categoryId } = createArticleDto;

    const author = await this.usersRepository.findOne({
      where: { id: authorId },
    });
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Utiliser l'utilitaire pour nettoyer le contenu
    const sanitizedContent = sanitizeContent(content);

    const article = this.articlesRepository.create({
      title,
      content: sanitizedContent, // Utiliser le contenu nettoyé
      author,
      category,
      createdBy: user.username,
    });

    return this.articlesRepository.save(article);
  }

  // Fetch all articles with author and category relations, excluding soft-deleted ones
  async findAll(): Promise<Article[]> {
    return this.articlesRepository.find({
      where: { deletedAt: null },
      relations: ['author', 'category'],
    });
  }

  // Fetch a single article by ID with relations
  async findOne(id: string): Promise<Article> {
    return this.articlesRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
  }

  // Fetch articles with pagination
  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ articles: Article[]; total: number }> {
    const [articles, total] = await this.articlesRepository.findAndCount({
      where: { deletedAt: null },
      relations: ['author', 'category'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { articles, total };
  }

  // Update an article
  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    user: User,
  ): Promise<Article> {
    const { authorId, categoryId, content, ...updateFields } = updateArticleDto;

    const article = await this.findOne(id);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (authorId && authorId !== article.author.id) {
      const author = await this.usersRepository.findOne({
        where: { id: authorId },
      });
      if (!author) {
        throw new NotFoundException('Author not found');
      }
      article.author = author;
    }

    if (categoryId && categoryId !== article.category.id) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      article.category = category;
    }

    // Utiliser l'utilitaire pour nettoyer le contenu
    if (content) {
      article.content = sanitizeContent(content);
    }

    Object.assign(article, updateFields);
    article.updatedBy = user.username;

    return this.articlesRepository.save(article);
  }

  // Soft delete an article by ID
  async delete(id: string): Promise<void> {
    const article = await this.articlesRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    await this.articlesRepository.softRemove(article);
  }
}
