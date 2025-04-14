import { Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  // 모든 경매 목록 전달
  @Post('/getAllProduct')
  async allInfo() {
    return await this.boardService.getAllInfo();
  }

  // 승인 전
  @Get('/getMyPosts')
  @UseGuards(JwtAuthGuard)
  async getNo(@Query() query, @Req() req) {
    const userId = req.user.id;
    return await this.boardService.getMyPots(userId, query);
  }

  // 승인 후
  @Get('/getPosts')
  @UseGuards(JwtAuthGuard)
  async getYes(@Query() query, @Req() req) {
    const userId = req.user.id;
    return await this.boardService.getPosts(userId, query);
  }

  // 해당유저 게시글 전달
  @Post('/userPosts')
  async userDatas(@Body() body: {userId: string}) {
    const {userId} = body;
    return await this.boardService.userData(userId);
  }

  // 관심상품
  @Get('/getMyFavorites')
  @UseGuards(JwtAuthGuard)
  async getFavorite(@Req() req) {
    const userId = req.user.id;
    return await this.boardService.getfavorite(userId);
  }

  // 상세페이지 정보 전달
  @Post('/detail')
  @UseGuards(JwtAuthGuard)
  async detailPage(@Body() body: {id: string}, @Req() req){
    const { id } = body;
    const userId = req.user.id
    return await this.boardService.getDetailInfo(id, userId);
  }

  // 입찰가 갱신
  @Post('/priceupdate')
  async postPrice(@Body() body: {id: number; price: number; userId: string; prePrice: number, preUserId: string}){
    const { id, price, userId, prePrice, preUserId } = body;
    return await this.boardService.updatePrice(id, price, userId, prePrice, preUserId);
  }

  // 좋아요 업데이트
  @Post('/likepost')
  async postLike(@Body() body: {id: number, userId: string}){
    const { id, userId } = body;
    return await this.boardService.updateLike(id, userId);
  }

  // 대시보드 정보 전달
  @Get('/getInfo')
  async getInfos(@Query() query){
    return await this.boardService.dashInfo(query);
  }
}
