import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";
import { Vehicles } from "./vehicles";
import { Grades } from "./grades";

@Entity('favorites')
export class Favorites {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id, { cascade: true, onDelete: "CASCADE" })
    auction: Auctions;

    // @ManyToOne(() => Vehicles, (vehicle) => vehicle.id, { cascade: true, onDelete: "CASCADE" })
    // vehicle: Vehicles;

    // @ManyToOne(() => Grades, (grade) => grade.id, { cascade: true, onDelete: "CASCADE" })
    // grade: Grades;
}