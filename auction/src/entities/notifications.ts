import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity('notifications')
export class Notifications {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @Column('varchar', {comment:'메일 종류', length: 100, nullable: true})
    type: string;

    @Column('text', {comment:'메일 내용'})
    message: string;

    @CreateDateColumn({ type: 'timestamp' }) 
    send_at: Date;
}