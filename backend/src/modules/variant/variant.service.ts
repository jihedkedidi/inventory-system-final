import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Variant } from './entities/variant.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    private readonly productService: ProductService,
  ) {}

  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    const product = await this.productService.findOne(createVariantDto.product_id);
    const variant = this.variantRepository.create({
      ...createVariantDto,
      product
    });
    return this.variantRepository.save(variant);
  }

  async findAll(): Promise<Variant[]> {
    return this.variantRepository.find({ relations: ['product'] });
  }

  async findOne(id: number): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: { variant_id: id },
      relations: ['product']
    });
    if (!variant) throw new NotFoundException(`Variant with ID ${id} not found`);
    return variant;
  }

  async update(id: number, updateVariantDto: UpdateVariantDto): Promise<Variant> {
    const variant = await this.findOne(id);
    return this.variantRepository.save({ ...variant, ...updateVariantDto });
  }

  async remove(id: number): Promise<void> {
    await this.variantRepository.delete(id);
  }
} 