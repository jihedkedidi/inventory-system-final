import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { Location } from '../../location/entities/location.entity';
import { PurchaseOrderLine } from './purchase-order-line.entity';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';

@Entity()
export class PurchaseOrder {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  po_id: number;

  @ApiProperty({ example: 'PO-2025-001', description: 'Purchase order number' })
  @Column({ unique: true })
  po_number: string;

  @ApiProperty({ example: 1, description: 'Supplier ID' })
  @Column()
  supplier_id: number;

  @ManyToOne(() => Supplier, supplier => supplier.purchase_orders)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ApiProperty({ example: 1, description: 'Location ID' })
  @Column()
  location_id: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ApiProperty({ example: '2025-03-15', description: 'Purchase order date' })
  @Column({ type: 'date' })
  po_date: Date;

  @ApiProperty({ example: '2025-03-30', description: 'Expected delivery date' })
  @Column({ type: 'date', nullable: true })
  expected_delivery_date: Date;

  @ApiProperty({ 
    example: PurchaseOrderStatus.PENDING, 
    description: 'Purchase order status',
    enum: PurchaseOrderStatus
  })
  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT
  })
  status: PurchaseOrderStatus;

  @ApiProperty({ example: 1250.75, description: 'Total amount of the purchase order' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @ApiProperty({ example: 1, description: 'User ID who created the purchase order' })
  @Column()
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PurchaseOrderLine, line => line.purchase_order, { cascade: true })
  lines: PurchaseOrderLine[];
} 