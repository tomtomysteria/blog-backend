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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../users/user.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.articlesService.update(id, updateArticleDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  }
}
