import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivity } from './entities/user-activity.entity';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';
import { LocationService } from '../location/location.service';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private userActivityRepository: Repository<UserActivity>,
    private locationService: LocationService
  ) {}

  async create(createUserActivityDto: CreateUserActivityDto): Promise<UserActivity> {
    // Check if location exists when location_id is provided
    if (createUserActivityDto.location_id) {
      try {
        await this.locationService.findOne(createUserActivityDto.location_id);
      } catch (error) {
        throw new BadRequestException(`Location with ID ${createUserActivityDto.location_id} does not exist`);
      }
    }
    
    const userActivity = this.userActivityRepository.create(createUserActivityDto);
    return this.userActivityRepository.save(userActivity);
  }

  async findAll(): Promise<UserActivity[]> {
    return this.userActivityRepository.find({
      relations: ['location']
    });
  }

  async findOne(id: number): Promise<UserActivity> {
    const userActivity = await this.userActivityRepository.findOne({
      where: { activity_id: id },
      relations: ['location']
    });
    
    if (!userActivity) {
      throw new NotFoundException(`User activity with ID ${id} not found`);
    }
    
    return userActivity;
  }

  async findByUser(userId: number): Promise<UserActivity[]> {
    return this.userActivityRepository.find({
      where: { user_id: userId },
      relations: ['location'],
      order: { timestamp: 'DESC' }
    });
  }

  async update(id: number, updateUserActivityDto: UpdateUserActivityDto): Promise<UserActivity> {
    const userActivity = await this.findOne(id);
    const updatedUserActivity = Object.assign(userActivity, updateUserActivityDto);
    return this.userActivityRepository.save(updatedUserActivity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userActivityRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User activity with ID ${id} not found`);
    }
  }
} 