import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MechanicsModule } from './mechanics/mechanics.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MessagesModule } from './messages/messages.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MechanicsModule,
    VehiclesModule,
    ConsultationsModule,
    PaymentsModule,
    ReviewsModule,
    MessagesModule,
    AdminModule,
  ],
})
export class AppModule {}
