import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {comment:'관리자 구별', nullable: true})
    role: string;
}