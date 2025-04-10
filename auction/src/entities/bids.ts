import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";

@Entity('bids')
export class Bids {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id, { cascade: true, onDelete: "CASCADE" })
    auction: Auctions;

    @Column('int', {comment:'현재 가격', nullable: true})
    bid_price: number;

    @Column('int', {comment:'환불 가격', nullable: true})
    refund_bid_price: number;

    @Column('varchar', { comment: '환불내역 구분', nullable: true })
    type: string;

    @CreateDateColumn({ type: 'timestamp' }) 
    create_at: Date;
}