import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id, { cascade: true, onDelete: "CASCADE" })
    auction: Auctions;

    @Column('varchar', {comment:'결제수단', nullable: true})
    payment_method: string;

    @Column('varchar', {comment:'카드사 종류', nullable: true})
    card_company: string;

    @Column('varchar', {comment:'환불 계좌번호', nullable: true})
    account: string;

    @Column('int', {comment:'결제금액', nullable: true})
    amount: number;

    @Column('int', {comment:'환불금액', nullable: true})
    refund_amount: number;

    @Column({ type: 'enum', enum: ['success', 'failed'], default: 'success' })
    status: string;

    @Column({ type: 'enum', enum: ['success', 'failed'], default: 'success' })
    refund_status: string;
}