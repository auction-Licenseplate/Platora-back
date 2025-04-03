import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Vehicles } from "./vehicles";
import { Grades } from "./grades";

@Entity('auctions')
export class Auctions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {comment:'경매 랜덤번호', unique: true })
    auction_num: string;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Vehicles, (vehicle) => vehicle.id, { cascade: true, onDelete: "CASCADE" })
    vehicle: Vehicles;
    
    @ManyToOne(() => Grades, (grade) => grade.id, { cascade: true, onDelete: "CASCADE" })
    grade_id: Grades;
    
    @Column({ type: 'timestamp' }) 
    start_time: Date;
    
    @Column({ type: 'timestamp' })
    end_time: Date;

    @Column({ type: 'enum', enum: ['before', 'going', 'completed'], default: 'going' })
    status: string;
}