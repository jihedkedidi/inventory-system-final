import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockTransferLineService } from './stock-transfer-line.service';
import { CreateStockTransferLineDto } from '../stock-transfer/dto/create-stock-transfer-line.dto';
import { UpdateStockTransferLineDto } from '../stock-transfer/dto/update-stock-transfer-line.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StockTransferLine } from '../stock-transfer/entities/stock-transfer-line.entity';

@ApiTags('stock-transfer-lines')
@Controller('stock-transfer-lines')
export class StockTransferLineController {
  constructor(private readonly stockTransferLineService: StockTransferLineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock transfer line' })
  @ApiResponse({ 
    status: 201, 
    description: 'Stock transfer line created successfully', 
    type: StockTransferLine 
  })
  create(@Body() createStockTransferLineDto: CreateStockTransferLineDto) {
    return this.stockTransferLineService.create(createStockTransferLineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock transfer lines' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all stock transfer lines', 
    type: [StockTransferLine] 
  })
  findAll() {
    return this.stockTransferLineService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stock transfer line by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the stock transfer line', 
    type: StockTransferLine 
  })
  findOne(@Param('id') id: string) {
    return this.stockTransferLineService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a stock transfer line' })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock transfer line updated successfully', 
    type: StockTransferLine 
  })
  update(
    @Param('id') id: string,
    @Body() updateStockTransferLineDto: UpdateStockTransferLineDto
  ) {
    return this.stockTransferLineService.update(+id, updateStockTransferLineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a stock transfer line' })
  @ApiResponse({ status: 200, description: 'Stock transfer line deleted successfully' })
  remove(@Param('id') id: string) {
    return this.stockTransferLineService.remove(+id);
  }
} 