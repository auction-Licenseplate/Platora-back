import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
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
    console.log('🔍 getReturPoint() 실행됨'); // 실행 여부 확인
    return this.adminService.returnpoint();
  }

  @Get('/getStatus')
  @UseGuards(JwtAuthGuard)
  async userCarStatus(@Req() req){
    const userId = req.user.id;
    return await this.adminService.carOwnership(userId);
  }
}
