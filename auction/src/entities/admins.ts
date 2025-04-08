import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Auctions } from './auctions';
import { Vehicles } from './vehicles';
import { Grades } from './grades';

@Entity('admins')
export class Admins {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: Users;

  @ManyToOne(() => Auctions, (auction) => auction.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  auction: Auctions;

  @ManyToOne(() => Grades, (grade) => grade.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'grade_id' })
  grade: Grades;

  @ManyToOne(() => Vehicles, (vehicle) => vehicle.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicles;

  @Column('varchar', { comment: '배너 타이틀', nullable: true })
  title: string;

  @Column('varchar', { comment: '배너 이미지', nullable: true })
  img: string;

  @Column('timestamp', { comment: '경매시작 날짜', nullable: true })
  auction_start: Date;

  @Column('timestamp', { comment: '경매끝나는 날짜', nullable: true })
  auction_end: Date;

  @Column('enum', {
    enum: ['approved', 'pending', 'waiting'],
    default: 'waiting',
  })
  write_status: string;
}
