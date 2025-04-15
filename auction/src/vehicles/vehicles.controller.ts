import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Query,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  // 차량 정보 가져오기
  @UseGuards(JwtAuthGuard)
  @Get('/vehicleData')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '차량 정보 가져오기' })
  // @ApiResponse({ status: 200, })
  async carOwnership(@Req() req) {
    const userId = req.user.id;
    return await this.vehicleService.getCarData(userId);
  }

  // 작성글 저장
  @Post('/addWrite')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('car_img', 3, {
      storage: diskStorage({
        destination: join(__dirname, '../../uploads'), // 저장할 경로
        filename: (req, file, callback) => {
          const filename = `${Date.now()}_${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async savePlate(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body,
    @Req() req,
  ) {
    if (!files || files.length === 0) {
      return { message: '이미지 없음' };
    }

    const userId = req.user.id;
    return await this.vehicleService.saveCarImg(userId, body, files);
  }

  // 등록 시 번호판 승인 여부 검사
  @Get('/checkApprovedPlate')
  @UseGuards(JwtAuthGuard)
  async checkApprovedPlate(@Query('plate') plate: string, @Req() req) {
    const userId = req.user.id;
    const exists = await this.vehicleService.checkIfPlateIsApproved(plate, userId);
    return { exists };
  }

}
