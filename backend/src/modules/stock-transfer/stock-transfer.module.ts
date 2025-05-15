import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferLine } from './entities/stock-transfer-line.entity';
import { StockTransferController } from './stock-transfer.controller';
import { StockTransferService } from './stock-transfer.service';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockTransfer, StockTransferLine]),
    LocationModule
  ],
  controllers: [StockTransferController],
  providers: [StockTransferService],
  exports: [StockTransferService]
})
export class StockTransferModule {} 