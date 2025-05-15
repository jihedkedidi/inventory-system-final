import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransferLine } from '../stock-transfer/entities/stock-transfer-line.entity';
import { StockTransferLineController } from './stock-transfer-line.controller';
import { StockTransferLineService } from './stock-transfer-line.service';
import { StockTransferModule } from '../stock-transfer/stock-transfer.module';
import { ProductModule } from '../product/product.module';
import { VariantModule } from '../variant/variant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockTransferLine]),
    StockTransferModule,
    ProductModule,
    VariantModule
  ],
  controllers: [StockTransferLineController],
  providers: [StockTransferLineService],
  exports: [StockTransferLineService]
})
export class StockTransferLineModule {} 