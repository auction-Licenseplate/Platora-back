import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
            refund_status: 'success',
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
            user,
            amount: body.amount,
            payment_method: body.payment_method,
            status: body.status,
        });

        return await this.payRepository.save(payment);
    }
}