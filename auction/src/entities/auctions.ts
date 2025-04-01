import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Vehicles } from "./vehicles";
import { Grades } from "./grades";

@Entity('auctions')
export class Auctions {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id)
    user: Users;

    @ManyToOne(() => Vehicles, (vehicle) => vehicle.id)
    vehicle: Vehicles;

    @Column('varchar', {comment:'제목', nullable: true})
    title: string;

    @Column('text', {comment:'경매 이미지', nullable: true})
    car_img: string;
    
    @ManyToOne(() => Grades, (grade) => grade.id)
    grade_id: Grades;

    @ManyToOne(() => Grades, (grade) => grade.min_price)
    grade_price: Grades;
    
    @Column({ type: 'timestamp' }) 
    start_time: Date;
    
    @Column({ type: 'timestamp' })
    end_time: Date;

    @Column({ type: 'enum', enum: ['going', 'completed'], default: 'going' })
    status: string;
}