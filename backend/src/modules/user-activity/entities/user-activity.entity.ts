import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../../location/entities/location.entity';

@Entity()
export class UserActivity {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  activity_id: number;

  @ApiProperty({ example: 1, description: 'User ID who performed the activity' })
  @Column()
  user_id: number;

  @ApiProperty({ example: 'Login', description: 'Type of activity performed' })
  @Column()
  activity_type: string;

  @ApiProperty({ 
    example: '{"ip":"192.168.1.1","browser":"Chrome"}', 
    description: 'Additional details about the activity' 
  })
  @Column({ type: 'json', nullable: true })
  activity_details: Record<string, any>;

  @ApiProperty({ example: '2023-01-01T12:00:00Z', description: 'When the activity occurred' })
  @CreateDateColumn()
  timestamp: Date;

  @ApiProperty({ example: 1, description: 'Location ID where activity occurred', required: false })
  @Column({ nullable: true })
  location_id: number;

  @ManyToOne(() => Location, location => location.activities)
  @JoinColumn({ name: 'location_id' })
  location: Location;
} 