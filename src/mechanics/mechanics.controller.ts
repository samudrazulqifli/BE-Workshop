import {
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('mechanics')
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Get()
  findAll(
    @Query('specialty') specialty?: string,
    @Query('online') online?: string,
  ) {
    return this.mechanicsService.findAll(specialty, online);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mechanicsService.findById(id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MECHANIC)
  updateProfile(
    @CurrentUser() user: any,
    @Body() dto: CreateMechanicDto,
  ) {
    return this.mechanicsService.updateProfile(user.id, dto);
  }

  @Patch('status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MECHANIC)
  updateStatus(
    @CurrentUser() user: any,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.mechanicsService.updateStatus(user.id, dto);
  }
}
