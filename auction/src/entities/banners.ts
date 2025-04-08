import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('banners')
export class Banners {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { comment: '배너 제목', length: 255, nullable: true })
    banner_title: string;
    
    @Column('varchar', { comment: '배너 이미지', nullable: true })
    banner_img?: string;
}