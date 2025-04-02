import { Body, Controller, Get, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  // 차량 정보 가져오기
  @UseGuards(JwtAuthGuard)
  @Get('/vehicleData')
  async carOwnership(@Req() req) {
    const userId = req.user.id;
    return await this.vehicleService.getCarData(userId);
  }
  
  // 작성글 저장
  @Post('/addWrite')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('car_img', 3, {
    storage: diskStorage({
      destination: join(__dirname, '../../uploads'), // 저장할 경로
      filename: (req, file, callback) => {
        const filename = `${Date.now()}_${file.originalname}`;
        callback(null, filename);
      },
    })
  }))
  async savePlate(@UploadedFiles() files: Express.Multer.File[], @Body() body, @Req() req){
    if (!files || files.length === 0) {
      return { message: '이미지 없음' };
    }

    const userId = req.user.id;
    return await this.vehicleService.saveCarImg(userId, body, files);
  }
}
