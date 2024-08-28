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

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
