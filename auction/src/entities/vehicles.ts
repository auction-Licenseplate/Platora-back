import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('vehicles')
export class Vehicles {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: Users;

  @Column('varchar', { comment: '작성제목', length: 255, nullable: true })
  title: string;

  @Column('varchar', { comment: '번호판 이미지', nullable: true })
  car_img?: string;

  @Column('varchar', { comment: '상세정보', nullable: true })
  car_info?: string;

  @Column('varchar', { comment: '번호판 번호', nullable: true })
  plate_num?: string;

  @Column('enum', {
    enum: ['waiting', 'approved', 'pending'],
    default: 'waiting',
  })
  ownership_status: string; // 승인 상태 처음 waiting

  @CreateDateColumn({ type: 'timestamp' }) 
  create_at: Date;
}
