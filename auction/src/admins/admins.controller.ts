import { Body, Controller, Post, Get, UseGuards, Req, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserInfoListDto } from 'src/dtos/all-user-info.dto';
import { FileInfoDto } from 'src/dtos/certification-file.dto';
import { RefundUserInfoDto } from 'src/dtos/refund-user-info.dto';
import { BannerDto } from 'src/dtos/banner.dto';
import { ApproveCertificateDto } from 'src/dtos/approve-certificate.dto';
import { AuctionItemInfoDto } from 'src/dtos/auction-item.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  // 전체 유저 정보 가져오기
  @Get('/userinfo')
  @ApiOperation({ summary: '전체 유저 정보 조회' })
  @ApiResponse({ status: 200, type: UserInfoListDto })
  async userinfo() {
    return this.adminService.userinfo();
  }

  // 공인인증서 요청 데이터
  @Get('/fileinfo')
  @ApiOperation({ summary: '공인인증서 정보 조회 (승인 요청 리스트)' })
  @ApiResponse({ status: 200, type: FileInfoDto, isArray: true })
  async getFileInfo() {
    return this.adminService.fileinfo();
  }

  // 포인트 반환 리스트
  @Get('/return')
  @ApiOperation({ summary: '포인트 반환 리스트 조회' })
  @ApiResponse({ status: 200, type: RefundUserInfoDto, isArray: true })
  async getReturPoint() {
    return this.adminService.returnpoint();
  }

  // 포인트 반환 승인
  @Post('/pointsuccess')
  @ApiOperation({ summary: '포인트 환불 상태 승인' })
  @ApiBody({ schema: {example: {id: '3'}, description: '유저 Id'}})
  @ApiResponse({ status: 200, description: '환불 상태 변경 완료' })
  async postRefundPoint(@Body() body: { userId: number }){
    return this.adminService.approveRefund(body.userId);
  }

  // 공동인증서 승인
  @Post('/pendding')
  @ApiOperation({ summary: '공동인증서 승인 처리' })
  @ApiBody({ schema: {example: {id: '1'}, description: '승인 대상 유저 Id'}})
  @ApiResponse({ status: 200, type: ApproveCertificateDto})
  async postpendding(@Body() body: { userId: number }) {
    return this.adminService.pendding(body.userId);
  }

  // 배너 이미지
  @Get('/guitar/img')
  @ApiOperation({ summary: '전체 배너 이미지 조회' })
  @ApiResponse({ status: 200, type: BannerDto, isArray: true })
  async banner(){
    return this.adminService.bannerGet();
  }

  // 배너 이미지2
  @Get('/contents')
  @ApiOperation({ summary: '최신 배너 이미지 3개 조회' })
  @ApiResponse({ status: 200, type: BannerDto, isArray: true })
  async banner2(){
    return this.adminService.bannerGet2();
  }

  // 배너 추가
  @Post('/imgvalue')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(__dirname, '../../uploads'), // 저장할 경로
      filename: (req, file, callback) => {
        const filename = `${Date.now()}_${file.originalname}`;
        callback(null, filename);
      },
    }),
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      text: { type: 'string', example: '배너 제목' },
      file: { type: 'string', format: 'binary'}
    }
  }})
  @ApiOperation({ summary: '배너 이미지 업로드' })
  @ApiResponse({ status: 200, 
    schema: { example: { 
      message: '배너 저장 완료',
      banner: {
        banner_title: '배너 제목',
        banner_img: '1713172981234_event.jpg'
      }
    }}
  })
  async uploadBanner( @UploadedFile() file: Express.Multer.File, @Body('text') text: string ) {
    return await this.adminService.saveBanner(text, file)
  }

  // 배너 삭제
  @Post('/guitar/imgdel')
  @ApiOperation({ summary: '배너 이미지 삭제' })
  @ApiBody({ schema: {example: {title: '배너 제목'}, description: '삭제할 배너 제목'}})
  @ApiResponse({ status: 200, description: '배너 삭제 완료' })
  async imgdelete(@Body() body: {title: string}){
    const { title } = body;
    return this.adminService.imgdel(title);
  }

  // 경매 물품 전달
  @Get('/iteminfo')
  @ApiOperation({ summary: '경매 물품 정보 전달' })
  @ApiResponse({ status: 200, type: AuctionItemInfoDto, isArray: true})
  async auctionItem(){
    return this.adminService.itemInfo();
  }

  // 경매 승인 (admin/auction/bid 테이블 저장)
  @Post('/iteminfo/sucess')
  @ApiOperation({ summary: '물품경매 승인' })
  @ApiBody({ schema: {example: {userId: 1, platenum: '12가3456'}, description: '사용자ID와 차량번호판'}})
  @ApiResponse({ status: 200, description: '경매 승인 성공' })
  async postSucess(@Body() body: { userid: number, platenum: string }){
    return this.adminService.success(body.userid, body.platenum);
  }

  // 회원탈퇴
  @Delete('/delete')
  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBody({ schema: {example: {email: 'user@example.com'}, description: '유저 이메일'}})
  @ApiResponse({ status: 200, description: '사용자 탈퇴 완료' })
  async deleteUser(@Body() body: {email: string}){
    const { email } = body;
    return this.adminService.userDelete(email);
  }

  // 사용자 차량승인 상태 전달 (프론트)
  @Get('/getStatus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '사용자 차량 승인 상태 조회' })
  @ApiResponse({ status: 200, schema: {example: {ownership_status: 'approved'}}})
  async userCarStatus(@Req() req) {
    const userId = req.user.id;
    return await this.adminService.carOwnership(userId);
  }
}
