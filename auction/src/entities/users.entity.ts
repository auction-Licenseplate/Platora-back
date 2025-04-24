import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Favorites } from './favorites';
@Entity('users') // 테이블 이름
export class Users {
  @PrimaryGeneratedColumn({type:'int', comment:'고유 사용자ID'})
  id: number;

  @Column('varchar', {comment:'이메일', length: 255, nullable: true, unique: true })
  email: string;

  @Column('varchar', {comment:'비밀번호', length: 255, nullable: true })
  password?: string;

  @Column('varchar', {comment:'이름', length: 500, nullable: true })
  name?: string;

  @Column('varchar', {comment:'핸드폰번호', length: 500, nullable: true, unique: true })
  phone?: string;

  @Column('varchar', {comment:'공인인증서', nullable: true})
  certification?: string;

  @Column('int', {comment:'포인트', nullable: true, default: 300})
  point?: number;

  @Column('varchar', {comment:'제공자', length: 100, nullable: true})
  provider?: string;

  @Column('varchar', {comment:'관리자', length: 100, nullable: true, default: 'user'})
  role?: string;

  @OneToMany(() => Favorites, (favorite) => favorite.user)
  favorites: Favorites[];

  @CreateDateColumn({ type: 'timestamp' }) 
  created_at: Date;
}
