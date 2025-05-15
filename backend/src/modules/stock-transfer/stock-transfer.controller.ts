import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { CreateStockTransferDto } from './dto/create-stock-transfer.dto';
import { UpdateStockTransferDto } from './dto/update-stock-transfer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferStatus } from './enums/stock-transfer-status.enum';

@ApiTags('stock-transfers')
@Controller('stock-transfers')
export class StockTransferController {
  constructor(private readonly stockTransferService: StockTransferService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock transfer' })
  @ApiResponse({ 
    status: 201, 
    description: 'Stock transfer created successfully', 
    type: StockTransfer 
  })
  create(@Body() createStockTransferDto: CreateStockTransferDto) {
    return this.stockTransferService.create(createStockTransferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock transfers' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all stock transfers', 
    type: [StockTransfer] 
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: StockTransferStatus,
    description: 'Filter by status' 
  })
  findAll(@Query('status') status?: StockTransferStatus) {
    return this.stockTransferService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stock transfer by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the stock transfer', 
    type: StockTransfer 
  })
  findOne(@Param('id') id: string) {
    return this.stockTransferService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a stock transfer' })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock transfer updated successfully', 
    type: StockTransfer 
  })
  update(@Param('id') id: string, @Body() updateStockTransferDto: UpdateStockTransferDto) {
    return this.stockTransferService.update(+id, updateStockTransferDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a stock transfer' })
  @ApiResponse({ status: 200, description: 'Stock transfer deleted successfully' })
  remove(@Param('id') id: string) {
    return this.stockTransferService.remove(+id);
  }

  @Post(':id/ship')
  @ApiOperation({ summary: 'Ship a stock transfer' })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock transfer shipped successfully', 
    type: StockTransfer 
  })
  ship(@Param('id') id: string) {
    return this.stockTransferService.ship(+id);
  }

  @Post(':id/receive')
  @ApiOperation({ summary: 'Receive a stock transfer' })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock transfer received successfully', 
    type: StockTransfer 
  })
  receive(@Param('id') id: string, @Body() receiveDto: any) {
    return this.stockTransferService.receive(+id, receiveDto);
  }
} 