import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('vehicles')
export class VehiclesController {
    constructor(
        private readonly vehicleService: VehiclesService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('/vehicleData')
    async carOwnership(@Req() req){
        const userId = req.user.id;
        return this.vehicleService.getCarData(userId);
    }
}
