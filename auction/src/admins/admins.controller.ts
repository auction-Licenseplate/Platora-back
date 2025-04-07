import { Body, Controller, Post, Get, UseGuards, Req, Delete } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @Get('/userinfo')
  async userinfo(@Body() body: { email: string; password: string; name: string; phone: string; }) {
    return this.adminService.userinfo();
  }

  @Get('/fileinfo')
  async getFileInfo() {
    return this.adminService.fileinfo();
  }

  // 포인트 반환 리스트
  @Get('/return')
  async getReturPoint() {
    return this.adminService.returnpoint();
  }
  // 포인트 반환 승인
  @Post('/pointsuccess')
  async postRefundPoint(@Body() body: { userId: number }){
    return this.adminService.approveRefund(body.userId);
  }

  // 공동인증서 승인
  @Post('/pendding')
  async postpendding(@Body() body: { userId: number }) {
    return this.adminService.pendding(body.userId);
  }

  // 배너 이미지
  @Get('/guitar/img')
  async banner(){
    return this.adminService.bannerGet();
  }
  @Get('/contents')
  async banner2(){
    return this.adminService.bannerGet2();
  }

  // 경매 물품 전달
  @Get('/iteminfo')
  async auctionItem(){
    return this.adminService.itemInfo();
  }

  // 경매 승인 (auction 테이블 저장)
  @Post('/iteminfo/sucess')
  async postSucess(@Body() body: { userid: number, platenum: string }){
    console.log('경매요청어케되는거니', body)
    return this.adminService.success(body.userid, body.platenum);
  }

  // 회원탈퇴
  @Delete('/delete')
  async deleteUser(@Body() body: {email: string}){
    console.log('삭제들간다', body)
    const { email } = body;
    return this.adminService.userDelete(email);
  }

  // 사용자 차량승인 상태 전달 (프론트)
  @Get('/getStatus')
  @UseGuards(JwtAuthGuard)
  async userCarStatus(@Req() req) {
    const userId = req.user.id;
    return await this.adminService.carOwnership(userId);
  }
}
