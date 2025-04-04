import { Body, Controller, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardService: BoardsService) {}

    // 필요한 정보 : 판매자명(users.id), 제목(vehicles.id), 등급(grades.id), final_price, end_time, status
    @Post('/getAllProduct')
    async allInfo(@Body() body){
        console.log(body, '화긴용')
        return await this.boardService.getAllInfo(body);
    }
}
