import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username for login'
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'First name'
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name'
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.AGENT,
    description: 'User role',
    default: UserRole.AGENT
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    example: 1,
    description: 'Supplier ID (for supplier users)',
    required: false
  })
  @IsOptional()
  @IsNumber()
  supplier_id?: number;

  @ApiProperty({
    example: true,
    description: 'Whether the user is active',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
} 