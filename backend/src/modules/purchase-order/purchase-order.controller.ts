import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderStatus } from './enums/purchase-order-status.enum';

@ApiTags('purchase-orders')
@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase order' })
  @ApiResponse({ 
    status: 201, 
    description: 'Purchase order created successfully', 
    type: PurchaseOrder 
  })
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.create(createPurchaseOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchase orders' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all purchase orders', 
    type: [PurchaseOrder] 
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: PurchaseOrderStatus,
    description: 'Filter by status' 
  })
  findAll(@Query('status') status?: PurchaseOrderStatus) {
    return this.purchaseOrderService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase order by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the purchase order', 
    type: PurchaseOrder 
  })
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a purchase order' })
  @ApiResponse({ 
    status: 200, 
    description: 'Purchase order updated successfully', 
    type: PurchaseOrder 
  })
  update(@Param('id') id: string, @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return this.purchaseOrderService.update(+id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a purchase order' })
  @ApiResponse({ status: 200, description: 'Purchase order deleted successfully' })
  remove(@Param('id') id: string) {
    return this.purchaseOrderService.remove(+id);
  }

  @Post(':id/receive')
  @ApiOperation({ summary: 'Receive items for a purchase order' })
  @ApiResponse({ 
    status: 200, 
    description: 'Items received successfully', 
    type: PurchaseOrder 
  })
  receiveItems(@Param('id') id: string, @Body() receiveItemsDto: any) {
    return this.purchaseOrderService.receiveItems(+id, receiveItemsDto);
  }
} 