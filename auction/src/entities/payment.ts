import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id)
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id)
    auction: Auctions;

    @Column('varchar', {comment:'결제수단', nullable: true})
    payment_method: string;

    @Column({ type: 'enum', enum: ['success', 'failed'], default: 'success' })
    status: string;
}