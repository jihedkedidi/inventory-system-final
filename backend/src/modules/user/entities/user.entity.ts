import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  SUPPLIER = 'supplier'
}

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  user_id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username for login' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @Column()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @Column()
  last_name: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ enum: UserRole, example: UserRole.AGENT, description: 'User role' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AGENT
  })
  role: UserRole;

  @ApiProperty({ example: 1, description: 'Supplier ID (for supplier users)', required: false })
  @Column({ nullable: true })
  supplier_id: number;

  @ApiProperty({ example: true, description: 'Whether the user is active' })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ example: false, description: 'Whether the user email is verified' })
  @Column({ default: false })
  is_email_verified: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last login date' })
  @Column({ nullable: true })
  last_login: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation date' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last update date' })
  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }
}
