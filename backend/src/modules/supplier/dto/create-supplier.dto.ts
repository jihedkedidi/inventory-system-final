import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    example: 'ABC Supplies Inc.',
    description: 'Name of the supplier'
  })
  @IsNotEmpty()
  @IsString()
  supplier_name: string;

  @ApiProperty({
    example: 'John Smith',
    description: 'Contact person name',
    required: false
  })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @ApiProperty({
    example: '555-123-4567',
    description: 'Contact phone number',
    required: false
  })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiProperty({
    example: 'john@abcsupplies.com',
    description: 'Contact email',
    required: false
  })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiProperty({
    example: '123 Supply St',
    description: 'Street address',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Chicago',
    description: 'City',
    required: false
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'IL',
    description: 'State or province',
    required: false
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    example: 'USA',
    description: 'Country',
    required: false
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: '60601',
    description: 'Postal code',
    required: false
  })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the supplier is active',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
} 