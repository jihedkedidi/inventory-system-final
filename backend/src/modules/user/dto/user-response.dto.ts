import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  user_id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username for login' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  last_name: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  phone: string;

  @ApiProperty({ enum: UserRole, example: UserRole.AGENT, description: 'User role' })
  role: UserRole;

  @ApiProperty({ example: 1, description: 'Supplier ID (for supplier users)', required: false })
  supplier_id: number;

  @ApiProperty({ example: true, description: 'Whether the user is active' })
  is_active: boolean;

  @ApiProperty({ example: false, description: 'Whether the user email is verified' })
  is_email_verified: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last login date' })
  last_login: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last update date' })
  updated_at: Date;
} 