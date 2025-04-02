import { Body, Controller, Get, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  // 차량 정보 가져오기
  @UseGuards(JwtAuthGuard)
  @Get('/vehicleData')
  async carOwnership(@Req() req) {
    const userId = req.user.id;
    return this.vehicleService.getCarData(userId);
  }
  
  // 번호판 이미지 저장
  @Post('/addWrite')
  @UseInterceptors(FilesInterceptor('car_img', 3, {
    storage: diskStorage({
      destination: join(__dirname, '../../uploads'), // 저장할 경로
      filename: (req, file, callback) => {
        const filename = `${Date.now()}_${file.originalname}`;
        console.log('저장될 파일 이름:', filename); // 파일 이름 확인
        callback(null, filename);
      },
    })
  }))
  async savePlate(@UploadedFiles() files: Express.Multer.File[], @Body() body, @Res() res){
    console.log('업로드된 파일:', files);
    console.log('받은 데이터:', body);

    if (!files || files.length === 0) {
      return { message: '이미지 업로드 실패' };
    }

    await this.vehicleService.saveCarImg(body, files);
    return res.status(200).send(); // 저장 성공
  }
}
