import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { PurchaseOrderLineStatus } from '../enums/purchase-order-line-status.enum';

export class CreatePurchaseOrderLineDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the purchase order this line belongs to'
  })
  @IsNotEmpty()
  @IsNumber()
  po_id: number;

  @ApiProperty({
    example: 1,
    description: 'Product ID'
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    example: 1,
    description: 'Variant ID',
    required: false
  })
  @IsOptional()
  @IsNumber()
  variant_id?: number;

  @ApiProperty({
    example: 10,
    description: 'Quantity ordered'
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity_ordered: number;

  @ApiProperty({
    example: 0,
    description: 'Quantity received',
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity_received?: number;

  @ApiProperty({
    example: 25.99,
    description: 'Unit price'
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unit_price: number;

  @ApiProperty({
    example: 259.90,
    description: 'Total price (calculated as quantity_ordered * unit_price)'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_price?: number;

  @ApiProperty({
    example: PurchaseOrderLineStatus.ORDERED,
    description: 'Line status',
    enum: PurchaseOrderLineStatus,
    default: PurchaseOrderLineStatus.ORDERED
  })
  @IsOptional()
  @IsEnum(PurchaseOrderLineStatus)
  status?: PurchaseOrderLineStatus;
} 