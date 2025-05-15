import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Variant } from './entities/variant.entity';

@ApiTags('variants')
@Controller('variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new variant' })
  @ApiResponse({ status: 201, description: 'The variant has been successfully created.', type: Variant })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Variant with this SKU already exists.' })
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantService.create(createVariantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all variants' })
  @ApiResponse({ status: 200, description: 'Return all variants.', type: [Variant] })
  findAll() {
    return this.variantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a variant by id' })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiResponse({ status: 200, description: 'Return the variant.', type: Variant })
  @ApiResponse({ status: 404, description: 'Variant not found.' })
  findOne(@Param('id') id: string) {
    return this.variantService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a variant' })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiResponse({ status: 200, description: 'The variant has been successfully updated.', type: Variant })
  @ApiResponse({ status: 404, description: 'Variant not found.' })
  update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantService.update(+id, updateVariantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a variant' })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiResponse({ status: 200, description: 'The variant has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Variant not found.' })
  remove(@Param('id') id: string) {
    return this.variantService.remove(+id);
  }
} 