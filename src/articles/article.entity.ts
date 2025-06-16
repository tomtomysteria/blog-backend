import { Entity, Column, ManyToOne, DeleteDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Article extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  // À la suppression du user associé aux articles, suppression en cascade des articles
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  author: User;

  // À la suppression de la catégorie associée aux articles, set à NULL les valeurs de la clé étrangère categoryId des articles
  @ManyToOne(() => Category, (category) => category.id, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
