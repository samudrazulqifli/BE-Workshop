import { PrismaClient, Role, VehicleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bengkel.com' },
    update: {},
    create: {
      email: 'admin@bengkel.com',
      passwordHash: adminPassword,
      name: 'Admin Bengkel',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // Create sample User
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'samudra@mail.com' },
    update: {},
    create: {
      email: 'samudra@mail.com',
      passwordHash: userPassword,
      name: 'Samudra',
      role: Role.USER,
    },
  });
  console.log(`✅ User: ${user.email}`);

  // Create sample Vehicle for user
  const vehicle = await prisma.vehicle.create({
    data: {
      userId: user.id,
      type: VehicleType.MOTOR,
      brand: 'Honda',
      model: 'Vario 125',
      year: 2022,
    },
  });
  console.log(`✅ Vehicle: ${vehicle.brand} ${vehicle.model}`);

  // Create sample Mechanic
  const mechanicPassword = await bcrypt.hash('mekanik123', 10);
  const mechanicUser = await prisma.user.upsert({
    where: { email: 'budi@bengkel.com' },
    update: {},
    create: {
      email: 'budi@bengkel.com',
      passwordHash: mechanicPassword,
      name: 'Budi Mekanik',
      role: Role.MECHANIC,
    },
  });

  const mechanic = await prisma.mechanic.upsert({
    where: { userId: mechanicUser.id },
    update: {},
    create: {
      userId: mechanicUser.id,
      description: 'Mekanik berpengalaman 10 tahun spesialis motor injection',
      consultationFee: 25000,
      isVerified: true,
      isOnline: true,
    },
  });

  // Add specialties
  await prisma.mechanicSpecialty.createMany({
    data: [
      { mechanicId: mechanic.id, specialty: 'motor_injection' },
      { mechanicId: mechanic.id, specialty: 'motor_matic' },
    ],
    skipDuplicates: true,
  });

  // Create wallet
  await prisma.mechanicWallet.upsert({
    where: { mechanicId: mechanic.id },
    update: {},
    create: {
      mechanicId: mechanic.id,
      balance: 0,
    },
  });

  console.log(`✅ Mechanic: ${mechanicUser.name} (verified, online)`);

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Test accounts:');
  console.log('  Admin:   admin@bengkel.com / admin123');
  console.log('  User:    samudra@mail.com / user123');
  console.log('  Mekanik: budi@bengkel.com / mekanik123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
