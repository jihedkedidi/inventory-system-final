import { PartialType } from '@nestjs/swagger';
import { CreateStockTransferLineDto } from './create-stock-transfer-line.dto';

export class UpdateStockTransferLineDto extends PartialType(CreateStockTransferLineDto) {}  