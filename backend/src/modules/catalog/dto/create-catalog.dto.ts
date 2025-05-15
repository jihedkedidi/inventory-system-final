import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCatalogDto {
  @ApiProperty({
    example: 'Summer Collection',
    description: 'The name of the catalog',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Products available for summer 2023',
    description: 'Description of the catalog',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the catalog is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
} 