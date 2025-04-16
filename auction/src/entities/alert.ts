import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Vehicles } from "./vehicles";

@Entity('alerts')
export class Alerts {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Vehicles, (vehicle) => vehicle.id, {cascade: true, onDelete: 'CASCADE'})
    vehicle: Vehicles;

    @Column('text', {comment:'알림 내용'})
    message: string;

    @Column('boolean', {comment: '읽음 유무', default: false})
    check: boolean;

    @CreateDateColumn({ type: 'timestamp' }) 
    created_at: Date;
}