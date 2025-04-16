import { Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AllProductDto } from 'src/dtos/all-product.dto';
import { MyPostResponseDto } from 'src/dtos/mypots.dto';
import { ApprovedPostDto } from 'src/dtos/post.dto';
import { FavoriteDto } from 'src/dtos/favorite.dto';
import { UserPostResponseDto } from 'src/dtos/user-posts.dto';
import { DetailResponseDto } from 'src/dtos/detail-item.dto';
import { UpdatePriceDto } from 'src/dtos/update-price.dto';
import { UpdatePriceResponseDto } from 'src/dtos/update-price-res.dto';
import { LikePostRequestDto } from 'src/dtos/like-post.dto';
import { DashboardItemDto } from 'src/dtos/dashboard.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  // 모든 경매 목록 전달
  @Post('/getAllProduct')
  @ApiOperation({ summary: '모든 경매 목록 전달' })
  @ApiResponse({ status: 200, type: AllProductDto, isArray: true})
  async allInfo() {
    return await this.boardService.getAllInfo();
  }

  // 승인 전
  @Get('/getMyPosts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '작성글 조회 (승인 전)' })
  @ApiQuery({ name: 'write_status', example: 'waiting' })
  @ApiResponse({ status: 200, type: MyPostResponseDto, isArray: true })
  async getNo(@Query() query, @Req() req) {
    const userId = req.user.id;
    return await this.boardService.getMyPots(userId, query);
  }

  // 승인 후
  @Get('/getPosts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '작성글 조회 (승인 후)' })
  @ApiQuery({ name: 'write_status', example: 'approved'})
  @ApiResponse({ status: 200, type: ApprovedPostDto, isArray: true})
  async getYes(@Query() query, @Req() req) {
    const userId = req.user.id;
    return await this.boardService.getPosts(userId, query);
  }

  // 해당유저 게시글 전달
  @Post('/userPosts')
  @ApiOperation({ summary: '해당 유저의 게시글 목록 조회' })
  @ApiBody({ schema: {example: {userId: '1'}}})
  @ApiOkResponse({ type: UserPostResponseDto, isArray: true})
  async userDatas(@Body() body: {userId: string}) {
    const {userId} = body;
    return await this.boardService.userData(userId);
  }

  // 관심상품
  @Get('/getMyFavorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '관심 상품 조회' })
  @ApiOkResponse({ type: FavoriteDto, isArray: true})
  async getFavorite(@Req() req) {
    const userId = req.user.id;
    return await this.boardService.getfavorite(userId);
  }

  // 상세페이지 정보 전달
  @Post('/detail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상세페이지 정보 전달' })
  @ApiBody({ schema: {example: {id: '1'}, description: '조회할 경매 게시글 Id'}})
  @ApiResponse({ status: 200, type: DetailResponseDto })
  async detailPage(@Body() body: {id: string}, @Req() req){
    const { id } = body;
    const userId = req.user.id
    return await this.boardService.getDetailInfo(id, userId);
  }

  // 입찰가 갱신
  @Post('/priceupdate')
  @ApiOperation({ summary: '입찰가 갱신' })
  @ApiResponse({ status: 200, type: UpdatePriceResponseDto })
  async postPrice(@Body() body: UpdatePriceDto){
    const { id, price, userId, prePrice, preUserId } = body;
    return await this.boardService.updatePrice(id, price, userId, prePrice, preUserId);
  }

  // 좋아요 업데이트
  @Post('/likepost')
  @ApiOperation({ summary: '좋아요 등록/취소' })
  @ApiResponse({ status: 200, schema: {example: {message: '좋아요 등록 완료', status: true }}})
  async postLike(@Body() body: LikePostRequestDto){
    const { id, userId } = body;
    return await this.boardService.updateLike(id, userId);
  }

  // 대시보드 정보 전달
  @Get('/getInfo')
  @ApiOperation({ summary: '대시보드 정보 조회' })
  @ApiResponse({ status: 200, type: DashboardItemDto, isArray: true })
  async getInfos(){
    return await this.boardService.dashInfo();
  }
}
