import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bids } from 'src/entities/bids';
import { Payment } from 'src/entities/payment';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PayService {
    constructor(
        @InjectRepository(Payment)
        private payRepository: Repository<Payment>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Bids)
        private bidRepository: Repository<Bids>
    ) {}

    // 환불할 포인트
    async getRefundInfo(userId: number, account: string, cardCompany: string, refundPoint: number) {
        const user = await this.userRepository.findOne({where: {id:userId}})
        if(!user) {
            return { message: '유저정보 없음' };
        }

        if (user.point! < refundPoint) {
            return { message: '잔여 포인트 부족' };
        }

        const refund = await this.payRepository.create({
            user: { id: userId },
            account,
            card_company: cardCompany,
            refund_amount: refundPoint,
            refund_status: 'waiting',
        });

        // 환불 처리 후 유저테이블 포인트 업데이트
        user.point! -= refundPoint;
        await this.userRepository.save(user);

        await this.payRepository.save(refund); // db에 저장
        return { message: '환불정보 저장 성공', refund, remainPoint: user.point };
    }

    // 환불 성공여부 전달
    async refundState(userId: number) {
        const refundData = await this.payRepository.find({
            where: {user: {id: userId}},
            select: ['refund_amount', 'refund_status']
        });

        return refundData;
    }

    // 토스 결제정보 저장
    async tossSave(userId: number, body: any) {
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user) {
            return { message: '유저정보 없음' };
        }

        const payment = this.payRepository.create({
            user: { id: userId },
            amount: body.amount,
            payment_method: body.payment_method,
            status: body.status,
        });

        // 유저테이블 point 반영
        user.point! += body.amount;
        await this.userRepository.save(user);

        await this.payRepository.save(payment);

        return { message: '결제정보 저장완료', payment };
    }

    // 사용자 포인트 정보 전달
    async pointData(userId: number){
        const payPoint = await this.payRepository.find({
            where: {user: {id: userId}},
            select: ['amount', 'refund_amount', 'status', 'refund_status', 'point_minus', 'create_at']
        })

        const refundPoint = await this.bidRepository.find({
            where: {user: {id: userId}},
            select: ['bid_price', 'refund_bid_price', 'create_at']
        })

        return { message: '포인트정보 전달 완료', payPoint, refundPoint};
    }

    // 사용자 포인트 차감
    async pointDelete(userId: number){
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user) {
            return { message: '유저정보 없음' };
        }

        if (user.point! < 100) {
            return { message: '포인트 부족함' };
        }

        user.point! -= 100;
        await this.userRepository.save(user); // user 엔티티 차감

        const minusPay = this.payRepository.create({
            user: {id: userId},
            point_minus: 100,
        });
        await this.payRepository.save(minusPay);

        return { message: '포인트 100 차감 완료' };
    }
}