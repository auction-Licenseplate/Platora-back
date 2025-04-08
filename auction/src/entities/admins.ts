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

  @ManyToOne(() => Grades, (grade) => grade.id, {cascade: true, onDelete: 'CASCADE'})
  grade: Grades;

  @ManyToOne(() => Vehicles, (vehicle) => vehicle.id, {cascade: true, onDelete: 'CASCADE'})
  vehicle: Vehicles;

  @Column('varchar', { comment: '배너 타이틀', nullable: true })
  title: string;

  @Column('varchar', { comment: '배너 이미지', nullable: true })
  img: string;

  @Column('enum', {
    enum: ['approved', 'pending', 'waiting'],
    default: 'waiting',
  })
  write_status: string;
}
