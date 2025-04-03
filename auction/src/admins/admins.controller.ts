import { Body, Controller, Post, Get } from '@nestjs/common';
import { AdminsService } from './admins.service';
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @Get('/userinfo')
  async userinfo(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      phone: string;
    },
  ) {
    return this.adminService.userinfo();
  }
}
