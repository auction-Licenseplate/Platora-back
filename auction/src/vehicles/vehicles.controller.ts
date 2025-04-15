import { Controller, Get, Req, UseGuards, Post, UseInterceptors, UploadedFiles, Body, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SaveWriteDto } from 'src/dtos/save-write.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  // 차량 정보 가져오기
  @UseGuards(JwtAuthGuard)
  @Get('/vehicleData')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '차량 정보 가져오기' })
  @ApiResponse({ status: 200, schema: {example: {plate_num: '12가3456', ownership_status: 'approved', create_at: '2025-04-13T00:00:00.000Z'}}})
  async carOwnership(@Req() req) {
    const userId = req.user.id;
    return await this.vehicleService.getCarData(userId);
  }

  // 작성글 저장
  @Post('/addWrite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: '12가3456' },
        car_info: { type: 'string', example: '차량연도~' },
        car_img: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary', // Swagger에 파일 업로드 필드로 인식
            description: '차량 이미지 파일'
          }
        }
      }
    }
  })
  @ApiOperation({ summary: '차량 글 작성 저장 (이미지 포함)' })
  @ApiResponse({ status: 200, schema: {
    example: {
      message: '작성글 저장완료',
      vehicle: { id: 1, plate_num: '12가3456', car_info: '차량연도~', car_img: 'img1.jpg,img2.jpg', title: '12가3456', grade: { id: 1, grade_name: '10' },}
    }
  }})
  async savePlate( @UploadedFiles() files: Express.Multer.File[], @Body() body: SaveWriteDto, @Req() req) {
    if (!files || files.length === 0) {
      return { message: '이미지 없음' };
    }

    const userId = req.user.id;
    return await this.vehicleService.saveCarImg(userId, body, files);
  }

  // 등록 시 번호판 승인 여부 검사
  @Get('/checkApprovedPlate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '번호판 승인 여부 확인' })
  @ApiResponse({ status: 200, schema: { example: {isApproved: true, alreadyWritten: false, anotherUser: false}}})
  @ApiQuery({ name: 'plate', description: '조회할 번호판', example: '12가3456'})
  async checkApprovedPlate(@Query('plate') plate: string, @Req() req) {
    const userId = req.user.id;
    const exists = await this.vehicleService.checkIfPlateIsApproved(plate, userId);
    return { exists };
  }
}
