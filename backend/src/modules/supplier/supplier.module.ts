import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService]
})
export class SupplierModule {} 