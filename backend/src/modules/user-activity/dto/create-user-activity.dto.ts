import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateUserActivityDto {
  @ApiProperty({
    example: 1,
    description: 'User ID who performed the activity'
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'Login',
    description: 'Type of activity performed'
  })
  @IsNotEmpty()
  @IsString()
  activity_type: string;

  @ApiProperty({
    example: { ip: '192.168.1.1', browser: 'Chrome' },
    description: 'Additional details about the activity',
    required: false
  })
  @IsOptional()
  @IsObject()
  activity_details?: Record<string, any>;

  @ApiProperty({
    example: 1,
    description: 'Location ID where activity occurred',
    required: false
  })
  @IsOptional()
  @IsNumber()
  location_id?: number;
} 