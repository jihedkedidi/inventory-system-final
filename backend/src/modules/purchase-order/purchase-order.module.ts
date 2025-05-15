import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';
import { SupplierModule } from '../supplier/supplier.module';
import { LocationModule } from '../location/location.module';
import { PurchaseOrderLineService } from './purchase-order-line.service';
import { ProductModule } from '../product/product.module';
import { VariantModule } from '../variant/variant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderLine]),
    SupplierModule,
    LocationModule,
    ProductModule,
    VariantModule
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService, PurchaseOrderLineService],
  exports: [PurchaseOrderService, PurchaseOrderLineService]
})
export class PurchaseOrderModule {} 