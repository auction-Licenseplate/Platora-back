import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('users') // 테이블 이름
export class Exhibition {
  @PrimaryGeneratedColumn({type:'int', comment:'고유 사용자ID'})
  id: number;

  @Column('varchar', {comment:'이메일', length: 255, nullable: false })
  email: string;

  @Column('varchar', {comment:'비밀번호', length: 255, nullable: false })
  password: string;

  @Column('varchar', {comment:'핸드폰번호', length: 500, nullable: true })
  period?: string;

  @CreateDateColumn({ type: 'timestamp' }) 
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
