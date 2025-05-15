import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockTransferLine } from '../stock-transfer/entities/stock-transfer-line.entity';
import { CreateStockTransferLineDto } from '../stock-transfer/dto/create-stock-transfer-line.dto';
import { UpdateStockTransferLineDto } from '../stock-transfer/dto/update-stock-transfer-line.dto';
import { StockTransferService } from '../stock-transfer/stock-transfer.service';
import { ProductService } from '../product/product.service';
import { VariantService } from '../variant/variant.service';

@Injectable()
export class StockTransferLineService {
  constructor(
    @InjectRepository(StockTransferLine)
    private stockTransferLineRepository: Repository<StockTransferLine>,
    private stockTransferService: StockTransferService,
    private productService: ProductService,
    private variantService: VariantService
  ) {}

  async create(createDto: CreateStockTransferLineDto): Promise<StockTransferLine> {
    // Validate stock transfer exists
    await this.stockTransferService.findOne(createDto.transfer_id);
    
    // Validate product exists
    await this.productService.findOne(createDto.product_id);
    
    // Validate variant if provided
    if (createDto.variant_id) {
      await this.variantService.findOne(createDto.variant_id);
    }

    return this.stockTransferLineRepository.save(
      this.stockTransferLineRepository.create(createDto)
    );
  }

  async findAll(): Promise<StockTransferLine[]> {
    return this.stockTransferLineRepository.find({
      relations: ['stock_transfer', 'product', 'variant']
    });
  }

  async findOne(id: number): Promise<StockTransferLine> {
    const line = await this.stockTransferLineRepository.findOne({
      where: { transfer_line_id: id },
      relations: ['stock_transfer', 'product', 'variant']
    });
    
    if (!line) {
      throw new NotFoundException(`Stock transfer line with ID ${id} not found`);
    }
    return line;
  }

  async update(
    id: number,
    updateStockTransferLineDto: UpdateStockTransferLineDto
  ): Promise<StockTransferLine> {
    const line = await this.findOne(id);
    const updatedLine = Object.assign(line, updateStockTransferLineDto);
    return this.stockTransferLineRepository.save(updatedLine);
  }

  async remove(id: number): Promise<void> {
    const result = await this.stockTransferLineRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Stock transfer line with ID ${id} not found`);
    }
  }
} 