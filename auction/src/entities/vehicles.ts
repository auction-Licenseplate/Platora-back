import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity('vehicles')
export class Vehicles {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id)
    user: Users;

    @Column('varchar', {comment:'작성제목', length: 255})
    title: string;

    @Column('varchar', {comment:'번호판 이미지', nullable: true})
    car_img?: string;

    @Column('varchar', {comment:'상세정보', nullable: true})
    car_info?: string;

    @Column('varchar', {comment:'번호판 번호', nullable: true})
    plate_num?: string;

    @Column('enum', {enum: ['approved', 'pending'], default: 'pending' })
    ownership_status: string;
}