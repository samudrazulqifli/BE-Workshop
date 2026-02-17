import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('mechanics')
  getAllMechanics() {
    return this.adminService.getAllMechanics();
  }

  @Patch('mechanics/:id/verify')
  verifyMechanic(@Param('id') id: string, @CurrentUser() admin: any) {
    return this.adminService.verifyMechanic(id, admin.id);
  }

  @Patch('users/:id/suspend')
  suspendUser(@Param('id') id: string, @CurrentUser() admin: any) {
    return this.adminService.suspendUser(id, admin.id);
  }

  @Patch('users/:id/unsuspend')
  unsuspendUser(@Param('id') id: string, @CurrentUser() admin: any) {
    return this.adminService.unsuspendUser(id, admin.id);
  }

  @Get('transactions')
  getTransactions() {
    return this.adminService.getTransactions();
  }

  @Get('logs')
  getAdminLogs() {
    return this.adminService.getAdminLogs();
  }
}
