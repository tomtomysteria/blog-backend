import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;
}
