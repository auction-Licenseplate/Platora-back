import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";

@Entity('admins')
export class Admins {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id)
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id)
    auction: Auctions;

    @Column('timestamp', {comment:'경매시작 날짜'})
    auction_start: Date;

    @Column({ type: 'enum', enum: ['approved', 'rejected'], default: 'rejected' })
    approval_status: string;

    @CreateDateColumn({ type: 'timestamp' }) 
    approved_at: Date;
}