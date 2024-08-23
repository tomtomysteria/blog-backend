import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true }) // Email unique
  @IsEmail()
  email: string;

  @Column({ unique: true }) // Username unique
  @IsNotEmpty()
  username: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  role: 'blogger' | 'admin' | 'super-admin';

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
