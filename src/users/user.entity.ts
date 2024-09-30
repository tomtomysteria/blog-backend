import { Entity, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  BLOGGER = 'blogger',
}

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BLOGGER,
  })
  role: UserRole;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true, type: 'date' }) // Date de naissance, facultative
  birthdate?: Date;

  @Column({ unique: true }) // Email unique
  email: string;

  @Column({ unique: true }) // Username unique
  username: string;

  @Column({ select: false }) // Ne jamais sélectionner le mot de passe dans les requêtes SQL
  @Exclude() // Exclure le mot de passe lors de la transformation des objets en JSON
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
