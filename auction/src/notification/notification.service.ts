import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notifications)
        private notificationRepository: Repository<Notifications>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    private transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: process.env.GOOGLE_EMAIL_USER,
            pass: process.env.GOOGLE_EMAIL_PASS,
        }
    })

    // 공인인증서 오류 이메일 전송
    async sendTypeEmail(type: string, userId: number){
        const failMessages = {
            '1': '공동인증서가 유효하지 않습니다.',
            '2': '제출된 정보가 부족합니다.',
            '3': '관리자 판단에 따라 거절되었습니다.',
        };

        const message = failMessages[type] || '알 수 없는 거절 사유입니다.';
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user){
            return {message: '사용자 없음'}
        }

        // 1. 테이블에 저장
        const notification = this.notificationRepository.create({
            user,
            type: 'Certification',
            message,
        });
        await this.notificationRepository.save(notification);

        // 2. 이메일 전송
        await this.transporter.sendMail({
            from: `"관리자" <${process.env.GOOGLE_EMAIL_USER}>`,
            to: user.email,
            subject: '[공동인증서 거절 안내]',
            text: message,
        });
        return {message: '공동인증서 거절 메일 전송함'};
    }
}
