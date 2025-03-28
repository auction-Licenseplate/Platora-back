import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('grades')
export class Grades {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {comment:'등급명', length: 100, nullable: true})
    grade_name: string;

    @Column('int', {comment:'입찰단위', nullable: true})
    price_unit: number;

    @Column('int', {comment:'최저가격', nullable: true})
    min_price: number;
}