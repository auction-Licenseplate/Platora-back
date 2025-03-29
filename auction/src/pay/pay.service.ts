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

    // 환불 정보 저장
    async getRefundInfo(userId: number, account: string, cardCompany: string, refundPoint: number) {
        const user = await this.userRepository.findOne({where: {id:userId}})
        if(!user) {
            return { message: '유저정보 없음' };
        }

        const refund = await this.payRepository.create({
            user: { id: userId },
            account,
            card_company: cardCompany,
            refund_amount: refundPoint,
        })

        await this.payRepository.save(refund); // db에 저장
        return { message: '환불정보 저장 성공' };
    }
}