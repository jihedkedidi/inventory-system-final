import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { StockTransferLineStatus } from '../enums/stock-transfer-line-status.enum';

export class CreateStockTransferLineDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the stock transfer this line belongs to'
  })
  @IsNotEmpty()
  @IsNumber()
  transfer_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the product being transferred'
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the product variant (if applicable)',
    required: false
  })
  @IsOptional()
  @IsNumber()
  variant_id?: number;

  @ApiProperty({
    example: 10,
    description: 'Quantity being transferred',
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity_transferred: number;

  @ApiProperty({
    example: 0,
    description: 'Quantity received (defaults to 0)',
    required: false,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity_received?: number;

  @ApiProperty({
    example: StockTransferLineStatus.PENDING,
    description: 'Current status of the transfer line',
    enum: StockTransferLineStatus,
    default: StockTransferLineStatus.PENDING
  })
  @IsOptional()
  @IsEnum(StockTransferLineStatus)
  status?: StockTransferLineStatus;
} 