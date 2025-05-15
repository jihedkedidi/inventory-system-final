import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { StockTransferStatus } from '../enums/stock-transfer-status.enum';
import { CreateStockTransferLineDto } from './create-stock-transfer-line.dto';

export class CreateStockTransferDto {
  @ApiProperty({
    example: 1,
    description: 'Source location ID'
  })
  @IsNotEmpty()
  @IsNumber()
  from_location_id: number;

  @ApiProperty({
    example: 2,
    description: 'Destination location ID'
  })
  @IsNotEmpty()
  @IsNumber()
  to_location_id: number;

  @ApiProperty({
    example: '2025-03-15',
    description: 'Transfer date'
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  transfer_date: Date;

  @ApiProperty({
    example: StockTransferStatus.PENDING,
    description: 'Transfer status',
    enum: StockTransferStatus,
    default: StockTransferStatus.PENDING
  })
  @IsOptional()
  @IsEnum(StockTransferStatus)
  status?: StockTransferStatus;

  @ApiProperty({
    example: 1,
    description: 'User ID who created the transfer'
  })
  @IsNotEmpty()
  @IsNumber()
  created_by: number;

  @ApiProperty({
    type: [CreateStockTransferLineDto],
    description: 'Stock transfer lines'
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateStockTransferLineDto)
  lines: CreateStockTransferLineDto[];
}