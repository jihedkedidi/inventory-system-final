import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { Variant } from '../variant/entities/variant.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Set default for unit_of_measure if not provided
      if (!createProductDto.unit_of_measure) {
        createProductDto.unit_of_measure = 'piece';
      }

      // Try to find existing product with same SKU
      const existingProduct = await this.productRepository.findOne({
        where: { sku: createProductDto.sku }
      });

      if (existingProduct) {
        // Option 1: Update existing product
        return this.productRepository.save({
          ...existingProduct,
          ...createProductDto
        });
        
        // Option 2: Throw conflict exception
        // throw new ConflictException(`Product with SKU ${createProductDto.sku} already exists`);
      }

      // Create new product if no duplicate exists
      return this.productRepository.save(createProductDto);
    } catch (error) {
      // Catch any other database errors
      if (error.code === '23505' && error.detail.includes('sku')) {
        throw new ConflictException(`Product with SKU ${createProductDto.sku} already exists`);
      }
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: any): Promise<Product> {
    // Validate and convert ID to number
    const productId = Number(id);
    
    if (isNaN(productId)) {
      throw new BadRequestException(`Invalid product ID: ${id}. Product ID must be a number.`);
    }
    
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: any, updateProductDto: UpdateProductDto): Promise<Product> {
    // Validate and convert ID to number
    const productId = Number(id);
    
    if (isNaN(productId)) {
      throw new BadRequestException(`Invalid product ID: ${id}. Product ID must be a number.`);
    }
    
    await this.productRepository.update(productId, updateProductDto);
    return this.findOne(productId);
  }

  async remove(id: any): Promise<void> {
    // Validate and convert ID to number
    const productId = Number(id);
    
    if (isNaN(productId)) {
      throw new BadRequestException(`Invalid product ID: ${id}. Product ID must be a number.`);
    }
    
    try {
      // First find the product to ensure it exists
      const product = await this.findOne(productId);
      
      // Use a transaction to ensure data consistency
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try {
        // 1. Delete catalog_products junction table entries
        await queryRunner.query(
          `DELETE FROM catalog_products WHERE "product_id" = $1`, 
          [productId]
        );
        
        // 2. Delete any associated variants
        await queryRunner.manager.delete(Variant, { product: { id: productId } });
        
        // 3. Then delete the product
        await queryRunner.manager.delete(Product, productId);
        
        // Commit the transaction
        await queryRunner.commitTransaction();
      } catch (error) {
        // Rollback the transaction in case of any errors
        await queryRunner.rollbackTransaction();
        
        console.error('Error deleting product:', error);
        throw new InternalServerErrorException('Failed to delete product. Please try again later.');
      } finally {
        // Release the query runner
        await queryRunner.release();
      }
    } catch (error) {
      // If it's an already handled error (NotFoundException or BadRequestException), just rethrow it
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      console.error('Error deleting product:', error);
      throw new InternalServerErrorException('Failed to delete product. Please try again later.');
    }
  }

  async createOrUpdateProduct(createProductDto: CreateProductDto) {
    // Set default for unit_of_measure if not provided
    if (!createProductDto.unit_of_measure) {
      createProductDto.unit_of_measure = 'piece';
    }

    const existingProduct = await this.productRepository.findOne({ 
      where: { sku: createProductDto.sku } 
    });
    
    if (existingProduct) {
      return this.productRepository.update(
        { sku: createProductDto.sku },
        createProductDto
      );
    }
    
    return this.productRepository.save(createProductDto);
  }

  async createProduct(createProductDto: CreateProductDto) {
    try {
      // Set default for unit_of_measure if not provided
      if (!createProductDto.unit_of_measure) {
        createProductDto.unit_of_measure = 'piece';
      }
      
      return await this.productRepository.save(createProductDto);
    } catch (error) {
      if (error.code === '23505' && error.detail.includes('sku')) {
        throw new ConflictException(`Product with SKU ${createProductDto.sku} already exists`);
      }
      throw error;
    }
  }
} 