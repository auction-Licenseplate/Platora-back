import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";

@Entity('favorites')
export class Favorites {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id)
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id)
    auction: Auctions;
}