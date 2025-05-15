import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsBoolean, IsAlphanumeric, IsOptional, IsString } from 'class-validator';
import { Variant } from '../../variant/entities/variant.entity';
import { Catalog } from '../../catalog/entities/catalog.entity';

@Entity()
export class Product {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Premium Coffee Mug', description: 'Product name' })
  @Column()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty({ example: 'Ceramic mug description', description: 'Product details' })
  @Column('text')
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'MUG-2023-PRM', description: 'Unique stock unit' })
  @Column({ unique: true })
  @IsAlphanumeric()
  sku: string;

  @ApiProperty({ example: 1, description: 'Category identifier' })
  @Column({ nullable: true })
  @IsOptional()
  category_id: number;

  @ApiProperty({ example: 1, description: 'Brand identifier' })
  @Column({ nullable: true })
  @IsOptional()
  brand_id: number;

  @ApiProperty({ example: 'piece', description: 'Unit of measure (e.g., kg, liter, piece)' })
  @Column({ default: 'piece' })
  @IsString()
  @IsNotEmpty()
  unit_of_measure: string;

  @ApiProperty({ example: true, description: 'Active status' })
  @Column({ default: true })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ 
    example: '2023-01-01T00:00:00.000Z', 
    description: 'Creation timestamp' 
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ 
    example: '2023-01-01T00:00:00.000Z', 
    description: 'Last update timestamp' 
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Variant, variant => variant.product)
  variants: Variant[];

  @ManyToMany(() => Catalog, catalog => catalog.products)
  catalogs: Catalog[];
} 