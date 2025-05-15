import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../../product/entities/product.entity';
import { Variant } from '../../variant/entities/variant.entity';
import { PurchaseOrderLineStatus } from '../enums/purchase-order-line-status.enum';

@Entity()
export class PurchaseOrderLine {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  poline_id: number;

  @ApiProperty({ example: 1, description: 'Purchase order ID' })
  @Column()
  po_id: number;

  @ManyToOne(() => PurchaseOrder, po => po.lines)
  @JoinColumn({ name: 'po_id' })
  purchase_order: PurchaseOrder;

  @ApiProperty({ example: 1, description: 'Product ID' })
  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ example: 1, description: 'Variant ID', required: false })
  @Column({ nullable: true })
  variant_id: number;

  @ManyToOne(() => Variant, { nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @ApiProperty({ example: 10, description: 'Quantity ordered' })
  @Column()
  quantity_ordered: number;

  @ApiProperty({ example: 5, description: 'Quantity received' })
  @Column({ default: 0 })
  quantity_received: number;

  @ApiProperty({ example: 25.99, description: 'Unit price' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @ApiProperty({ example: 259.90, description: 'Total price' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @ApiProperty({ 
    example: PurchaseOrderLineStatus.ORDERED, 
    description: 'Line status',
    enum: PurchaseOrderLineStatus
  })
  @Column({
    type: 'enum',
    enum: PurchaseOrderLineStatus,
    default: PurchaseOrderLineStatus.ORDERED
  })
  status: PurchaseOrderLineStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 