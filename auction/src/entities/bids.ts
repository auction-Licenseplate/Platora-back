import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";

@Entity('bids')
export class Bids {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Auctions, (auction) => auction.id, { cascade: true, onDelete: "CASCADE" })
    auction: Auctions;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @Column('text', {comment:'사용자IP', nullable: true})
    user_ip: string;

    @Column('int', {comment:'입찰금액', nullable: true})
    bid_amount: number;

    @CreateDateColumn({ type: 'timestamp' }) 
    bid_time: Date;
}