import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrderStatus } from './enums/purchase-order-status.enum';
import { PurchaseOrderLineStatus } from './enums/purchase-order-line-status.enum';
import { SupplierService } from '../supplier/supplier.service';
import { LocationService } from '../location/location.service';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderLine)
    private purchaseOrderLineRepository: Repository<PurchaseOrderLine>,
    private supplierService: SupplierService,
    private locationService: LocationService,
  ) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // Validate supplier exists
    await this.supplierService.findOne(createPurchaseOrderDto.supplier_id);
    
    // Validate location exists
    await this.locationService.findOne(createPurchaseOrderDto.location_id);
    
    // Calculate total amount
    let totalAmount = 0;
    for (const line of createPurchaseOrderDto.lines) {
      line.total_price = line.quantity_ordered * line.unit_price;
      totalAmount += line.total_price;
    }
    
    // Create purchase order
    const purchaseOrder = this.purchaseOrderRepository.create({
      ...createPurchaseOrderDto,
      total_amount: totalAmount,
      status: createPurchaseOrderDto.status || PurchaseOrderStatus.DRAFT,
      lines: createPurchaseOrderDto.lines.map(line => ({
        ...line,
        status: PurchaseOrderLineStatus.ORDERED,
        quantity_received: 0
      }))
    });
    
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  async findAll(status?: PurchaseOrderStatus): Promise<PurchaseOrder[]> {
    const query = this.purchaseOrderRepository.createQueryBuilder('po')
      .leftJoinAndSelect('po.supplier', 'supplier')
      .leftJoinAndSelect('po.location', 'location')
      .leftJoinAndSelect('po.lines', 'lines')
      .leftJoinAndSelect('lines.product', 'product')
      .leftJoinAndSelect('lines.variant', 'variant');
    
    if (status) {
      query.where('po.status = :status', { status });
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { po_id: id },
      relations: ['supplier', 'location', 'lines', 'lines.product', 'lines.variant']
    });
    
    if (!purchaseOrder) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`);
    }
    
    return purchaseOrder;
  }

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);
    
    // Don't allow updating completed or cancelled POs
    if (purchaseOrder.status === PurchaseOrderStatus.RECEIVED || 
        purchaseOrder.status === PurchaseOrderStatus.CANCELLED) {
      throw new BadRequestException(`Cannot update purchase order with status ${purchaseOrder.status}`);
    }
    
    // Update the purchase order
    const updatedPO = Object.assign(purchaseOrder, updatePurchaseOrderDto);
    return this.purchaseOrderRepository.save(updatedPO);
  }

  async remove(id: number): Promise<void> {
    const purchaseOrder = await this.findOne(id);
    
    // Don't allow deleting received POs
    if (purchaseOrder.status === PurchaseOrderStatus.RECEIVED || 
        purchaseOrder.status === PurchaseOrderStatus.PARTIALLY_RECEIVED) {
      throw new BadRequestException(`Cannot delete purchase order with status ${purchaseOrder.status}`);
    }
    
    const result = await this.purchaseOrderRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`);
    }
  }

  async receiveItems(id: number, receiveItemsDto: any): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);
    
    // Don't allow receiving for cancelled POs
    if (purchaseOrder.status === PurchaseOrderStatus.CANCELLED) {
      throw new BadRequestException(`Cannot receive items for cancelled purchase order`);
    }
    
    // Process each line item
    let allLinesReceived = true;
    
    for (const line of receiveItemsDto.lines) {
      const poLine = purchaseOrder.lines.find(l => l.poline_id === line.poline_id);
      
      if (!poLine) {
        throw new NotFoundException(`Purchase order line with ID ${line.poline_id} not found`);
      }
      
      // Update received quantity
      poLine.quantity_received += line.quantity_received;
      
      // Ensure received quantity doesn't exceed ordered quantity
      if (poLine.quantity_received > poLine.quantity_ordered) {
        throw new BadRequestException(`Received quantity cannot exceed ordered quantity for line ${poLine.poline_id}`);
      }
      
      // Update line status
      if (poLine.quantity_received === poLine.quantity_ordered) {
        poLine.status = PurchaseOrderLineStatus.FULLY_RECEIVED;
      } else if (poLine.quantity_received > 0) {
        poLine.status = PurchaseOrderLineStatus.PARTIALLY_RECEIVED;
        allLinesReceived = false;
      } else {
        allLinesReceived = false;
      }
      
      await this.purchaseOrderLineRepository.save(poLine);
    }
    
    // Update PO status
    if (allLinesReceived) {
      purchaseOrder.status = PurchaseOrderStatus.RECEIVED;
    } else if (purchaseOrder.lines.some(l => l.quantity_received > 0)) {
      purchaseOrder.status = PurchaseOrderStatus.PARTIALLY_RECEIVED;
    }
    
    return this.purchaseOrderRepository.save(purchaseOrder);
  }
} 