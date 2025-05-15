import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { VariantModule } from './modules/variant/variant.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { LocationModule } from './modules/location/location.module';
import { UserActivityModule } from './modules/user-activity/user-activity.module';
import { StockTransferModule } from './modules/stock-transfer/stock-transfer.module';
import { StockTransferLineModule } from './modules/stock-transfer-line/stock-transfer-line.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { PurchaseOrderLineModule } from './modules/purchase-order/purchase-order-line.module';
import { UserModule } from './modules/user/user.module';
import { MlService } from './ml/ml.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [],
      synchronize: true,
      autoLoadEntities: true
    }),
    ProductModule,
    VariantModule,
    CatalogModule,
    LocationModule,
    UserActivityModule,
    StockTransferModule,
    StockTransferLineModule,
    SupplierModule,
    PurchaseOrderModule,
    PurchaseOrderLineModule,
    UserModule,
  ],
  providers: [MlService],
})
export class AppModule {}
