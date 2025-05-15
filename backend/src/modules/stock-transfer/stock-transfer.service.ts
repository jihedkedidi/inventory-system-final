import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferLine } from './entities/stock-transfer-line.entity';
import { CreateStockTransferDto } from './dto/create-stock-transfer.dto';
import { UpdateStockTransferDto } from './dto/update-stock-transfer.dto';
import { StockTransferStatus } from './enums/stock-transfer-status.enum';
import { StockTransferLineStatus } from './enums/stock-transfer-line-status.enum';
import { LocationService } from '../location/location.service';

@Injectable()
export class StockTransferService {
  constructor(
    @InjectRepository(StockTransfer)
    private stockTransferRepository: Repository<StockTransfer>,
    @InjectRepository(StockTransferLine)
    private stockTransferLineRepository: Repository<StockTransferLine>,
    private locationService: LocationService,
  ) {}

  async create(createStockTransferDto: CreateStockTransferDto): Promise<StockTransfer> {
    // Validate locations exist
    await this.locationService.findOne(createStockTransferDto.from_location_id);
    await this.locationService.findOne(createStockTransferDto.to_location_id);
    
    // Ensure from and to locations are different
    if (createStockTransferDto.from_location_id === createStockTransferDto.to_location_id) {
      throw new BadRequestException('Source and destination locations cannot be the same');
    }
    
    // Create stock transfer
    const stockTransfer = this.stockTransferRepository.create({
      ...createStockTransferDto,
      status: createStockTransferDto.status || StockTransferStatus.PENDING,
      lines: createStockTransferDto.lines.map(line => ({
        ...line,
        status: StockTransferLineStatus.PENDING,
        quantity_received: 0
      }))
    });
    
    return this.stockTransferRepository.save(stockTransfer);
  }

  async findAll(status?: StockTransferStatus): Promise<StockTransfer[]> {
    const query = this.stockTransferRepository.createQueryBuilder('st')
      .leftJoinAndSelect('st.fromLocation', 'fromLocation')
      .leftJoinAndSelect('st.toLocation', 'toLocation')
      .leftJoinAndSelect('st.lines', 'lines')
      .leftJoinAndSelect('lines.product', 'product')
      .leftJoinAndSelect('lines.variant', 'variant');
    
    if (status) {
      query.where('st.status = :status', { status });
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<StockTransfer> {
    const stockTransfer = await this.stockTransferRepository.findOne({
      where: { transfer_id: id },
      relations: ['fromLocation', 'toLocation', 'lines', 'lines.product', 'lines.variant']
    });
    
    if (!stockTransfer) {
      throw new NotFoundException(`Stock transfer with ID ${id} not found`);
    }
    
    return stockTransfer;
  }

  async update(id: number, updateStockTransferDto: UpdateStockTransferDto): Promise<StockTransfer> {
    const stockTransfer = await this.findOne(id);
    
    // Don't allow updating completed or cancelled transfers
    if (stockTransfer.status === StockTransferStatus.COMPLETED || 
        stockTransfer.status === StockTransferStatus.CANCELLED) {
      throw new BadRequestException(`Cannot update stock transfer with status ${stockTransfer.status}`);
    }
    
    // Update the stock transfer
    const updatedTransfer = Object.assign(stockTransfer, updateStockTransferDto);
    return this.stockTransferRepository.save(updatedTransfer);
  }

  async remove(id: number): Promise<void> {
    const stockTransfer = await this.findOne(id);
    
    // Don't allow deleting in-transit or completed transfers
    if (stockTransfer.status === StockTransferStatus.IN_TRANSIT || 
        stockTransfer.status === StockTransferStatus.COMPLETED) {
      throw new BadRequestException(`Cannot delete stock transfer with status ${stockTransfer.status}`);
    }
    
    const result = await this.stockTransferRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Stock transfer with ID ${id} not found`);
    }
  }

  async ship(id: number): Promise<StockTransfer> {
    const stockTransfer = await this.findOne(id);
    
    // Only pending transfers can be shipped
    if (stockTransfer.status !== StockTransferStatus.PENDING) {
      throw new BadRequestException(`Cannot ship stock transfer with status ${stockTransfer.status}`);
    }
    
    // Update transfer status
    stockTransfer.status = StockTransferStatus.IN_TRANSIT;
    
    // Update line statuses
    for (const line of stockTransfer.lines) {
      line.status = StockTransferLineStatus.IN_TRANSIT;
      await this.stockTransferLineRepository.save(line);
    }
    
    return this.stockTransferRepository.save(stockTransfer);
  }

  async receive(id: number, receiveDto: any): Promise<StockTransfer> {
    const stockTransfer = await this.findOne(id);
    
    // Only in-transit transfers can be received
    if (stockTransfer.status !== StockTransferStatus.IN_TRANSIT) {
      throw new BadRequestException(`Cannot receive stock transfer with status ${stockTransfer.status}`);
    }
    
    // Process each line item
    let allLinesReceived = true;
    
    for (const line of receiveDto.lines) {
      const transferLine = stockTransfer.lines.find(l => l.transfer_line_id === line.transfer_line_id);
      
      if (!transferLine) {
        throw new NotFoundException(`Transfer line with ID ${line.transfer_line_id} not found`);
      }
      
      // Update received quantity
      transferLine.quantity_received += line.quantity_received;
      
      // Ensure received quantity doesn't exceed transferred quantity
      if (transferLine.quantity_received > transferLine.quantity_transferred) {
        throw new BadRequestException(`Received quantity cannot exceed transferred quantity for line ${transferLine.transfer_line_id}`);
      }
      
      // Update line status
      if (transferLine.quantity_received === transferLine.quantity_transferred) {
        transferLine.status = StockTransferLineStatus.COMPLETED;
      } else {
        allLinesReceived = false;
      }
      
      await this.stockTransferLineRepository.save(transferLine);
    }
    
    // Update transfer status
    if (allLinesReceived) {
      stockTransfer.status = StockTransferStatus.COMPLETED;
    }
    
    return this.stockTransferRepository.save(stockTransfer);
  }
} 