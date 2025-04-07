import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";
import { Vehicles } from "./vehicles";

@Entity('admins')
export class Admins {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id, { cascade: true, onDelete: "CASCADE" })
    auction: Auctions;

    @ManyToOne(() => Vehicles, (vehicle) => vehicle.id, { cascade: true, onDelete: "CASCADE" })
    vehicle: Vehicles;

    @Column('varchar', {comment: '배너 타이틀', nullable: true})
    title: string;

    @Column('varchar', {comment: '배너 이미지', nullable: true})
    img: string;

    @Column('enum', {enum: ['approved', 'pending'], default: 'pending' })
    write_status: string;
}