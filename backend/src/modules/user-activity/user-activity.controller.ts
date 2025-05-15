import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserActivity } from './entities/user-activity.entity';

@ApiTags('user-activities')
@Controller('user-activities')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user activity' })
  @ApiResponse({ status: 201, description: 'The user activity has been successfully created.', type: UserActivity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createUserActivityDto: CreateUserActivityDto) {
    return this.userActivityService.create(createUserActivityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user activities' })
  @ApiResponse({ status: 200, description: 'Return all user activities.', type: [UserActivity] })
  findAll() {
    return this.userActivityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user activity by id' })
  @ApiParam({ name: 'id', description: 'User Activity ID' })
  @ApiResponse({ status: 200, description: 'Return the user activity.', type: UserActivity })
  @ApiResponse({ status: 404, description: 'User activity not found.' })
  findOne(@Param('id') id: string) {
    return this.userActivityService.findOne(+id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all activities for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return all activities for the user.', type: [UserActivity] })
  findByUser(@Param('userId') userId: string) {
    return this.userActivityService.findByUser(+userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user activity' })
  @ApiParam({ name: 'id', description: 'User Activity ID' })
  @ApiResponse({ status: 200, description: 'The user activity has been successfully updated.', type: UserActivity })
  @ApiResponse({ status: 404, description: 'User activity not found.' })
  update(@Param('id') id: string, @Body() updateUserActivityDto: UpdateUserActivityDto) {
    return this.userActivityService.update(+id, updateUserActivityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user activity' })
  @ApiParam({ name: 'id', description: 'User Activity ID' })
  @ApiResponse({ status: 200, description: 'The user activity has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User activity not found.' })
  remove(@Param('id') id: string) {
    return this.userActivityService.remove(+id);
  }
} 