import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';
import { User } from '../users/user.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin', 'admin', 'blogger')
  create(@Body() createArticleDto: CreateArticleDto, @Req() req: Request) {
    const user = req.user as User;
    return this.articlesService.create(createArticleDto, user);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin', 'admin', 'blogger')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const article = await this.articlesService.findOne(id);

    // Si l'utilisateur est un "blogger", il ne peut modifier que ses propres articles
    if (user.role === 'blogger' && article.author.id !== user.id) {
      throw new ForbiddenException('You can only update your own articles.');
    }

    return this.articlesService.update(id, updateArticleDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin', 'admin', 'blogger')
  async delete(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    const article = await this.articlesService.findOne(id);

    // Si l'utilisateur est un "blogger", il ne peut supprimer que ses propres articles
    if (user.role === 'blogger' && article.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own articles.');
    }

    return this.articlesService.delete(id);
  }
}
