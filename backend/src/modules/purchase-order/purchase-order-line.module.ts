import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderLine])],
  controllers: [],
  providers: [],
  exports: []
})
export class PurchaseOrderLineModule {} 