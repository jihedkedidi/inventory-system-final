import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsAlphanumeric, IsString, IsBoolean, MaxLength, Matches, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Premium Coffee Mug',
    description: 'The name of the product'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  product_name: string;

  @ApiProperty({
    example: 'Ceramic mug with premium finish',
    description: 'Detailed product description'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiProperty({
    example: 'MUG-2023-PRM',
    description: 'Unique stock keeping unit'
  })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'SKU can only contain letters, numbers, hyphens and underscores'
  })
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    example: 1,
    description: 'Category identifier',
    required: false
  })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Brand identifier',
    required: false
  })
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @ApiProperty({
    example: 'piece',
    description: 'Unit of measure (e.g., kg, liter, piece)',
    default: 'piece'
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  unit_of_measure?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the product is active',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
} 