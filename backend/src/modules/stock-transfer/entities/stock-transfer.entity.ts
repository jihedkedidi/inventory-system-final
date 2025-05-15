import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../../location/entities/location.entity';
import { StockTransferLine } from './stock-transfer-line.entity';
import { StockTransferStatus } from '../enums/stock-transfer-status.enum';

@Entity()
export class StockTransfer {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  transfer_id: number;

  @ApiProperty({ example: 1, description: 'Source location ID' })
  @Column()
  from_location_id: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'from_location_id' })
  fromLocation: Location;

  @ApiProperty({ example: 2, description: 'Destination location ID' })
  @Column()
  to_location_id: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'to_location_id' })
  toLocation: Location;

  @ApiProperty({ example: '2025-03-15', description: 'Transfer date' })
  @Column({ type: 'date' })
  transfer_date: Date;

  @ApiProperty({ 
    example: StockTransferStatus.PENDING, 
    description: 'Transfer status',
    enum: StockTransferStatus
  })
  @Column({
    type: 'enum',
    enum: StockTransferStatus,
    default: StockTransferStatus.PENDING
  })
  status: StockTransferStatus;

  @ApiProperty({ example: 1, description: 'User ID who created the transfer' })
  @Column()
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => StockTransferLine, line => line.stock_transfer, { cascade: true })
  lines: StockTransferLine[];
} 