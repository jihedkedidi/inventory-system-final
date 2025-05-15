import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StockTransfer } from './stock-transfer.entity';
import { Product } from '../../product/entities/product.entity';
import { Variant } from '../../variant/entities/variant.entity';
import { StockTransferLineStatus } from '../enums/stock-transfer-line-status.enum';

@Entity()
export class StockTransferLine {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  transfer_line_id: number;

  @ApiProperty({ example: 1, description: 'Stock transfer ID' })
  @Column()
  transfer_id: number;

  @ManyToOne(() => StockTransfer, transfer => transfer.lines)
  @JoinColumn({ name: 'transfer_id' })
  stock_transfer: StockTransfer;

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

  @ApiProperty({ example: 10, description: 'Quantity transferred' })
  @Column()
  quantity_transferred: number;

  @ApiProperty({ example: 0, description: 'Quantity received' })
  @Column({ default: 0 })
  quantity_received: number;

  @ApiProperty({ 
    example: StockTransferLineStatus.PENDING, 
    description: 'Line status',
    enum: StockTransferLineStatus
  })
  @Column({
    type: 'enum',
    enum: StockTransferLineStatus,
    default: StockTransferLineStatus.PENDING
  })
  status: StockTransferLineStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 