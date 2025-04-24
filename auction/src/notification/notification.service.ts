import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications';
import { Users } from 'src/entities/users.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Vehicles } from 'src/entities/vehicles';
import { Admins } from 'src/entities/admins';
import * as path from 'path';
import { Alerts } from 'src/entities/alert';
import { Cron } from '@nestjs/schedule';
import { Auctions } from 'src/entities/auctions';
import { Bids } from 'src/entities/bids';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notifications)
        private notificationRepository: Repository<Notifications>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Vehicles)
        private vehicleRepository: Repository<Vehicles>,
        @InjectRepository(Admins)
        private adminRepository: Repository<Admins>,
        @InjectRepository(Alerts)
        private alertRepository: Repository<Alerts>,
        @InjectRepository(Auctions)
        private acutionRepository: Repository<Auctions>,
        @InjectRepository(Bids)
        private bidRepository: Repository<Bids>
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

    // 공인인증서, 경매물품 거절 이메일 전송
    async sendTypeEmail(type: string, userId: number, valuetype: string, plate_num: string){
        const failMessageFile = {
            '1': '공인인증서가 유효하지 않습니다.',
            '2': '제출된 정보가 부족합니다.',
            '3': '관리자 판단에 따라 거절되었습니다.',
        };

        const failMessageItem = {
            '1': '차량 이미지가 유효하지 않습니다.',
            '2': '제출된 정보가 부족합니다.',
            '3': '관리자 판단에 따라 거절되었습니다.',
        }

        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user){
            return {message: '사용자 없음'}
        }

        let message = '';
        let typeForDB = '';
        let subject = '';
        
        // 타입 구별
        if (valuetype === 'file') {
            message = failMessageFile[type];
            typeForDB = 'Certification';
            subject = '[공인인증서 거절 안내]';

            // vehicles 테이블 pending 상태로 변경
            const vehicle = await this.vehicleRepository.findOne({ where: {plate_num} });
            if(vehicle){
                vehicle.ownership_status = 'pending';
                await this.vehicleRepository.save(vehicle);
            }

        } else if (valuetype === 'item') {
            message = failMessageItem[type];
            typeForDB = 'Item';
            subject = '[경매물품 거절 안내]';

            // admins 테이블 pending 상태로 변경
            const vehicle = await this.vehicleRepository.findOne({ where: {plate_num} });
            if(vehicle){
                const admin = await this.adminRepository.findOne({where: { vehicle: { id: vehicle.id } }});
                if(admin){
                    admin.write_status = 'pending';
                    await this.adminRepository.save(admin);
                }
            }

        } else {
            return { message: '유효하지 않은 valuetype' };
        }

        // 1. notification 테이블에 저장
        const notification = this.notificationRepository.create({
            user,
            type: typeForDB,
            message,
        });
        await this.notificationRepository.save(notification);

        // 2. 이메일 전송
        await this.transporter.sendMail({
            from: `"관리자" <Platora-project>`,
            to: user.email,
            subject,
            text: message,
            html: `
            <div style="padding:20px; font-family:'Noto Sans KR', sans-serif;">
                <img src="cid:logo" style="width:120px; margin-bottom:20px;" />
                <h2 style="color:#333;">Platora 인증 거절 안내</h2>
                <p style="font-size:15px; color:#555;">
                    안녕하세요, 고객님.<br/>
                    아래 사유로 승인이 거절되었습니다.
                </p>
                <div style="margin:20px 0; padding:15px; background-color:#f8f8f8; border-left:5px solid #ff4d4f;">
                    <strong>${message}</strong>
                </div>
                <p style="font-size:13px; color:#999;">문의사항이 있으시면 고객센터로 연락 주세요.</p>
                <hr style="margin-top:40px;"/>
                <p style="font-size:12px; color:#aaa;">Platora Corp. | www.platora.com</p>
            </div>
            `,
            attachments: [
                {
                  filename: 'logo.png',
                  path: path.join(process.cwd(), 'public', 'platoraLogo2.png'),
                  cid: 'logo',
                },
            ],
        });
        return {message: `${typeForDB} 거절 메일 전송 완료`};
    }

    // 공인인증서 승인 이메일 전송
    async sendApprovalEmail(userId: number){
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user){
            return {message: '사용자 없음'}
        }

        const subject = '[공인인증서 승인 안내]';
        const message = '공인인증서가 정상적으로 승인되었습니다. 감사합니다.';

        await this.transporter.sendMail({
            from: `"관리자" <Platora-project>`,
            to: user.email,
            subject,
            text: message,
            html: `
            <div style="padding:20px; font-family:'Noto Sans KR', sans-serif;">
                <img src="cid:logo" style="width:120px; margin-bottom:20px;" />
                <h2 style="color:#2E8B57;">Platora 인증 승인 안내</h2>
                <p style="font-size:15px; color:#333;">
                    안녕하세요, 고객님.<br/>
                    귀하의 공인인증서가 정상적으로 <strong>승인</strong>되었습니다.
                </p>
                <p style="margin-top: 20px;">Platora 서비스를 이용해 주셔서 감사합니다.</p>
                <hr style="margin-top:40px;"/>
                <p style="font-size:12px; color:#aaa;">Platora Corp. | www.platora.com</p>
            </div>
            `,
            attachments: [
                {
                  filename: 'logo.png',
                  path: path.join(process.cwd(), 'public', 'platoraLogo2.png'),
                  cid: 'logo',
                },
            ],
        })
        return { message: '공인인증서 승인 메일 전송 완료' };
    }

    // 경매물품 승인 이메일 전송
    async sendApprovalEmail2(userId: number){
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user){
            return {message: '사용자 없음'}
        }

        const subject = '[경매물품 승인 안내]';
        const message = '경매물품이 정상적으로 승인되었습니다. 감사합니다.';

        await this.transporter.sendMail({
            from: `"관리자" <Platora-project>`,
            to: user.email,
            subject,
            text: message,
            html: `
            <div style="padding:20px; font-family:'Noto Sans KR', sans-serif;">
                <img src="cid:logo" style="width:120px; margin-bottom:20px;" />
                <h2 style="color:#2E8B57;">Platora 인증 승인 안내</h2>
                <p style="font-size:15px; color:#333;">
                    안녕하세요, 고객님.<br/>
                    귀하의 경매물품이 정상적으로 <strong>승인</strong>되었습니다.
                </p>
                <p style="margin-top: 20px;">Platora 서비스를 이용해 주셔서 감사합니다.</p>
                <hr style="margin-top:40px;"/>
                <p style="font-size:12px; color:#aaa;">Platora Corp. | www.platora.com</p>
            </div>
            `,
            attachments: [
                {
                  filename: 'logo.png',
                  path: path.join(process.cwd(), 'public', 'platoraLogo2.png'),
                  cid: 'logo',
                },
            ],
        })
        return { message: '경매물품 승인 메일 전송 완료' };
    }

    // 알림 정보 전달
    async sendAlertData(userId: number){
        const alerts = await this.alertRepository.find({
            where: {user: {id: userId}},
            relations: ['vehicle', 'auction'],
            order: { created_at: 'DESC'},
        });

        // 필요한 데이터
        return alerts.map(x =>({
            id: x.id,
            message: x.message,
            check: x.check,
            created_at: x.created_at,
            auctionId: x.auction ? x.auction.id : null,
            vehicleId: x.vehicle ? x.vehicle.id : null,
            vehicleTitle: x.vehicle ? x.vehicle.title : null,
        }));
    }

    // 읽음 처리 업데이트
    async alertChkUpdate(id: number, check: boolean){
        const alert = await this.alertRepository.findOne({ where: {id} })
        if(!alert){
            return {message: '해당 알림 없음'}
        }

        alert.check = check;
        await this.alertRepository.save(alert);

        return { message: '알림 변경 완료'};
    }

    // 경매종료 스케줄러 확인
    @Cron('*/1 * * * *') // 1분마다 실행
    async auctionEnd(){
        const now = new Date();
        
        const expireAuc = await this.acutionRepository.find({
            where: {
                end_time: LessThanOrEqual(now),
                status: 'before' // 아놔 진행중으로 상태 수정해놓을걸......
            },
            relations: ['bids', 'vehicle']
        });

        for (const auction of expireAuc) {
            const lastBid = await this.bidRepository.findOne({
                where: {auction: {id: auction.id}},
                relations: ['user'],
                order: {create_at: 'DESC'}
            });

            if (lastBid){
                const alert = this.alertRepository.create({
                    user: lastBid.user,
                    vehicle: auction.vehicle,
                    auction,
                    message: 'auc-end'
                });
                await this.alertRepository.save(alert);
            }
        
            auction.status = 'completed'; // 상태변경
            await this.acutionRepository.save(auction);
        }
    }
}
