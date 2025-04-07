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
  @Get('/return')
  async getReturPoint() {
    // console.log('🔍 getReturPoint() 실행됨'); // 실행 여부 확인
    return this.adminService.returnpoint();
  }
  @Post('/pendding')
  async postpendding(@Body() body: { userId: number }) {
    // console.log('🔍 getReturPoint() 실행됨'); // 실행 여부 확인
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
