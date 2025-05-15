import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';

@Entity()
export class Supplier {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  supplier_id: number;

  @ApiProperty({ example: 'ABC Supplies Inc.', description: 'Name of the supplier' })
  @Column()
  supplier_name: string;

  @ApiProperty({ example: 'John Smith', description: 'Contact person name' })
  @Column({ nullable: true })
  contact_person: string;

  @ApiProperty({ example: '555-123-4567', description: 'Contact phone number' })
  @Column({ nullable: true })
  contact_phone: string;

  @ApiProperty({ example: 'john@abcsupplies.com', description: 'Contact email' })
  @Column({ nullable: true })
  contact_email: string;

  @ApiProperty({ example: '123 Supply St', description: 'Street address' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ example: 'Chicago', description: 'City' })
  @Column({ nullable: true })
  city: string;

  @ApiProperty({ example: 'IL', description: 'State or province' })
  @Column({ nullable: true })
  state: string;

  @ApiProperty({ example: 'USA', description: 'Country' })
  @Column({ nullable: true })
  country: string;

  @ApiProperty({ example: '60601', description: 'Postal code' })
  @Column({ nullable: true })
  postal_code: string;

  @ApiProperty({ example: true, description: 'Whether the supplier is active' })
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.supplier)
  purchase_orders: PurchaseOrder[];
} 