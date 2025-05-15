import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Catalog } from './entities/catalog.entity';

@ApiTags('catalogs')
@Controller('catalogs')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new catalog' })
  @ApiResponse({ status: 201, description: 'The catalog has been successfully created.', type: Catalog })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCatalogDto: CreateCatalogDto) {
    return this.catalogService.create(createCatalogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all catalogs' })
  @ApiResponse({ status: 200, description: 'Return all catalogs.', type: [Catalog] })
  findAll() {
    return this.catalogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a catalog by id' })
  @ApiParam({ name: 'id', description: 'Catalog ID' })
  @ApiResponse({ status: 200, description: 'Return the catalog.', type: Catalog })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a catalog' })
  @ApiParam({ name: 'id', description: 'Catalog ID' })
  @ApiResponse({ status: 200, description: 'The catalog has been successfully updated.', type: Catalog })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  update(@Param('id') id: string, @Body() updateCatalogDto: UpdateCatalogDto) {
    return this.catalogService.update(+id, updateCatalogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a catalog' })
  @ApiParam({ name: 'id', description: 'Catalog ID' })
  @ApiResponse({ status: 200, description: 'The catalog has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  remove(@Param('id') id: string) {
    return this.catalogService.remove(+id);
  }

  @Post(':id/products')
  @ApiOperation({ summary: 'Add products to a catalog' })
  @ApiParam({ name: 'id', description: 'Catalog ID' })
  @ApiBody({
    description: 'Array of product IDs to add to the catalog',
    schema: {
      type: 'array',
      items: {
        type: 'number',
        example: 1
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Products successfully added to catalog', type: Catalog })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Catalog or products not found.' })
  addProducts(@Param('id') id: string, @Body() productIds: number[]) {
    return this.catalogService.addProductsToCatalog(+id, productIds);
  }

  @Delete(':id/products')
  @ApiOperation({ summary: 'Remove products from a catalog' })
  @ApiParam({ name: 'id', description: 'Catalog ID' })
  @ApiBody({
    description: 'Array of product IDs to remove from the catalog',
    schema: {
      type: 'array',
      items: {
        type: 'number',
        example: 1
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Products successfully removed from catalog', type: Catalog })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  removeProducts(@Param('id') id: string, @Body() productIds: number[]) {
    return this.catalogService.removeProductsFromCatalog(+id, productIds);
  }
} 