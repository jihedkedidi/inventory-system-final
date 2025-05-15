import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Variant]), ProductModule],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService]
})
export class VariantModule {} 