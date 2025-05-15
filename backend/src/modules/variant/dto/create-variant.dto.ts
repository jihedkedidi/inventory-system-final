import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({
    example: 'Large Red Mug',
    description: 'The name of the variant',
  })
  @IsNotEmpty()
  @IsString()
  variant_name: string;

  @ApiProperty({
    example: 'Red-Large',
    description: 'Value of the variant (e.g. color-size)',
    required: false
  })
  @IsOptional()
  @IsString()
  variant_value?: string;

  @ApiProperty({
    example: 'MUG-RED-L',
    description: 'SKU of the variant',
  })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the product this variant belongs to',
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    example: 19.99,
    description: 'Price of the variant',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 12.50,
    description: 'Cost price of the variant',
    required: false
  })
  @IsOptional()
  @IsNumber()
  cost_price?: number;

  @ApiProperty({
    example: '123456789',
    description: 'Barcode of the variant',
    required: false
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({
    example: 'Red',
    description: 'Color of the variant',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    example: 'Large',
    description: 'Size of the variant',
    required: false,
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the variant is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
} 