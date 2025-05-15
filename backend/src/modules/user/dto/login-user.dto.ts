import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username or email for login'
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
} 