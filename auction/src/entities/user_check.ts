import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('user_check')
export class UserCheck {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.email)
    @JoinColumn({ name: 'user_email', referencedColumnName: 'email' })
    user: Users;

    @Column('varchar', {comment:'약관확인', nullable: true})
    term?: string;
}