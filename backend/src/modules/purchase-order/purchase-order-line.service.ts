import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { CreatePurchaseOrderLineDto } from './dto/create-purchase-order-line.dto';
import { UpdatePurchaseOrderLineDto } from './dto/update-purchase-order-line.dto';
import { PurchaseOrderService } from './purchase-order.service';
import { ProductService } from '../product/product.service';
import { VariantService } from '../variant/variant.service';

@Injectable()
export class PurchaseOrderLineService {
  constructor(
    @InjectRepository(PurchaseOrderLine)
    private purchaseOrderLineRepository: Repository<PurchaseOrderLine>,
    private purchaseOrderService: PurchaseOrderService,
    private productService: ProductService,
    private variantService: VariantService
  ) {}

  async create(createDto: CreatePurchaseOrderLineDto): Promise<PurchaseOrderLine> {
    // Validate purchase order exists
    await this.purchaseOrderService.findOne(createDto.po_id);
    
    // Validate product exists
    await this.productService.findOne(createDto.product_id);
    
    // Validate variant if provided
    if (createDto.variant_id) {
      await this.variantService.findOne(createDto.variant_id);
    }

    return this.purchaseOrderLineRepository.save(
      this.purchaseOrderLineRepository.create(createDto)
    );
  }

  // Add other CRUD methods here
} 