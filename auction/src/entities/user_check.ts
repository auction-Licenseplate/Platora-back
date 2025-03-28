import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity('user_check')
export class UserCheck {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id)
    user: Users;

    @Column('varchar', {comment:'약관확인', length: 500, nullable: true})
    term?: boolean; // true 또는 false
}