import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityService } from './user-activity.service';
import { UserActivityController } from './user-activity.controller';
import { UserActivity } from './entities/user-activity.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserActivity]),
    LocationModule
  ],
  controllers: [UserActivityController],
  providers: [UserActivityService],
  exports: [UserActivityService]
})
export class UserActivityModule {} 