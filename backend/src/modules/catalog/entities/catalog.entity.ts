import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Catalog {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  catalog_id: number;

  @ApiProperty({ example: 'Summer Collection', description: 'Name of the catalog' })
  @Column({ nullable: false })
  catalog_name: string;

  @ApiProperty({ example: 'Products for summer season', description: 'Description of the catalog' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: true, description: 'Whether the catalog is active' })
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Product, product => product.catalogs)
  @JoinTable({
    name: 'catalog_products',
    joinColumn: { name: 'catalog_id', referencedColumnName: 'catalog_id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' }
  })
  products: Product[];
} 