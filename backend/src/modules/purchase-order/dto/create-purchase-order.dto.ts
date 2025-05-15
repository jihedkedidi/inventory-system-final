import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsEnum, IsOptional, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';
import { CreatePurchaseOrderLineDto } from './create-purchase-order-line.dto';

export class CreatePurchaseOrderDto {
  @ApiProperty({
    example: 'PO-2025-001',
    description: 'Purchase order number'
  })
  @IsNotEmpty()
  @IsString()
  po_number: string;

  @ApiProperty({
    example: 1,
    description: 'Supplier ID'
  })
  @IsNotEmpty()
  @IsNumber()
  supplier_id: number;

  @ApiProperty({
    example: 1,
    description: 'Location ID'
  })
  @IsNotEmpty()
  @IsNumber()
  location_id: number;

  @ApiProperty({
    example: '2025-03-15',
    description: 'Purchase order date'
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  po_date: Date;

  @ApiProperty({
    example: '2025-03-30',
    description: 'Expected delivery date',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expected_delivery_date?: Date;

  @ApiProperty({
    example: PurchaseOrderStatus.PENDING,
    description: 'Purchase order status',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT
  })
  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;

  @ApiProperty({
    example: 1,
    description: 'User ID who created the purchase order'
  })
  @IsNotEmpty()
  @IsNumber()
  created_by: number;

  @ApiProperty({
    type: [CreatePurchaseOrderLineDto],
    description: 'Purchase order lines'
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineDto)
  lines: CreatePurchaseOrderLineDto[];
} 