import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";

@Entity('admins')
export class Admins {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id, { cascade: true, onDelete: "CASCADE" })
    auction: Auctions;

    @Column('varchar', {comment: '배너 타이틀', nullable: true})
    title: string;

    @Column('varchar', {comment: '배너 이미지', nullable: true})
    img: string;

    @Column('timestamp', {comment:'경매시작 날짜'})
    auction_start: Date;

    @Column('timestamp', {comment:'경매끝나는 날짜'})
    auction_end: Date;

    @Column('enum', {enum: ['approved', 'pending'], default: 'pending' })
    write_status: string;

    @CreateDateColumn({ type: 'timestamp' }) 
    approved_at: Date;
}