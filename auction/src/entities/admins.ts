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

    @Column('varchar', {comment: '배너 타이틀', nullable: true})
    title: string;

    @Column('varchar', {comment: '배너 이미지', nullable: true})
    img: string;

    @Column('timestamp', {comment:'경매시작 날짜'})
    auction_start: Date;

    @Column('timestamp', {comment:'경매끝나는 날짜'})
    auction_end: Date;

    @Column({ type: 'enum', enum: ['approved', 'rejected'], default: 'rejected' })
    approval_status: string;

    @CreateDateColumn({ type: 'timestamp' }) 
    approved_at: Date;
}