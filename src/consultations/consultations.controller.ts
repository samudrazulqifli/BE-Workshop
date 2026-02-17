import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  create(@CurrentUser() user: any, @Body() dto: CreateConsultationDto) {
    return this.consultationsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    if (user.role === Role.MECHANIC) {
      return this.consultationsService.findAllByMechanic(user.id);
    }
    return this.consultationsService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.consultationsService.findById(id, user.id, user.role);
  }

  @Post(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  complete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.consultationsService.complete(id, user.id);
  }

  @Post(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  cancel(@CurrentUser() user: any, @Param('id') id: string) {
    return this.consultationsService.cancel(id, user.id);
  }

  @Post(':id/attachments')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  uploadAttachment(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileUrl = `/uploads/${file.filename}`;
    return this.consultationsService.addAttachment(id, user.id, fileUrl);
  }
}
