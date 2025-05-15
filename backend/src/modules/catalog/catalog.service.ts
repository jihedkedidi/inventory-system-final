import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Catalog } from './entities/catalog.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,
    private readonly productService: ProductService,
  ) {}

  async create(createCatalogDto: CreateCatalogDto): Promise<Catalog> {
    const catalog = new Catalog();
    catalog.catalog_name = createCatalogDto.name;
    catalog.description = createCatalogDto.description || '';
    catalog.is_active = createCatalogDto.is_active ?? true;
    
    return this.catalogRepository.save(catalog);
  }

  async findAll(): Promise<Catalog[]> {
    return this.catalogRepository.find({ relations: ['products'] });
  }

  async findOne(id: any): Promise<Catalog> {
    // Validate and convert ID to number
    const catalogId = Number(id);
    
    if (isNaN(catalogId)) {
      throw new BadRequestException(`Invalid catalog ID: ${id}. Catalog ID must be a number.`);
    }
    
    const catalog = await this.catalogRepository.findOne({ 
      where: { catalog_id: catalogId },
      relations: ['products']
    });
    
    if (!catalog) {
      throw new NotFoundException(`Catalog with ID ${id} not found`);
    }
    
    return catalog;
  }

  async update(id: number, updateCatalogDto: UpdateCatalogDto): Promise<Catalog> {
    const catalog = await this.findOne(id);
    
    if (updateCatalogDto.name !== undefined) {
      catalog.catalog_name = updateCatalogDto.name;
    }
    if (updateCatalogDto.description !== undefined) {
      catalog.description = updateCatalogDto.description;
    }
    if (updateCatalogDto.is_active !== undefined) {
      catalog.is_active = updateCatalogDto.is_active;
    }
    
    return this.catalogRepository.save(catalog);
  }

  async remove(id: number): Promise<void> {
    await this.catalogRepository.delete(id);
  }

  async addProductsToCatalog(catalogId: any, productIds: any[]): Promise<Catalog> {
    // Validate productIds array
    if (!Array.isArray(productIds)) {
      throw new BadRequestException('Product IDs must be an array');
    }
    
    // Validate catalog ID
    const catalog = await this.findOne(catalogId);
    
    // Initialize products array if it doesn't exist
    catalog.products = catalog.products || [];
    
    // Get existing product IDs in the catalog to prevent duplicates
    const existingProductIds = catalog.products.map(product => product.id);
    
    // Validate and process each product ID
    const validProductIds: number[] = [];
    for (const id of productIds) {
      const productId = Number(id);
      if (isNaN(productId)) {
        throw new BadRequestException(`Invalid product ID: ${id}. All product IDs must be numbers.`);
      }
      
      // Only add if it's not already in the catalog
      if (!existingProductIds.includes(productId)) {
        validProductIds.push(productId);
      }
    }
    
    // If no new valid products to add, return the catalog as is
    if (validProductIds.length === 0) {
      return catalog;
    }
    
    // Get products with validated IDs
    const productsToAdd = await Promise.all(
      validProductIds.map(id => this.productService.findOne(id))
    );
    
    // Add new products to catalog
    catalog.products = [...catalog.products, ...productsToAdd];
    
    // Save the updated catalog
    return this.catalogRepository.save(catalog);
  }

  async removeProductsFromCatalog(catalogId: any, productIds: any[]): Promise<Catalog> {
    // Validate productIds array
    if (!Array.isArray(productIds)) {
      throw new BadRequestException('Product IDs must be an array');
    }
    
    // Validate catalog ID
    const catalog = await this.findOne(catalogId);
    
    // Initialize products array if it doesn't exist
    if (!catalog.products || catalog.products.length === 0) {
      return catalog; // Nothing to remove
    }
    
    // Validate and process each product ID
    const validProductIds: number[] = [];
    for (const id of productIds) {
      const productId = Number(id);
      if (!isNaN(productId)) {
        validProductIds.push(productId);
      } else {
        throw new BadRequestException(`Invalid product ID: ${id}. All product IDs must be numbers.`);
      }
    }
    
    // Filter out products to be removed
    catalog.products = catalog.products.filter(product => !validProductIds.includes(product.id));
    
    // Save the updated catalog
    return this.catalogRepository.save(catalog);
  }
} 