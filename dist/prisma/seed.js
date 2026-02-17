"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bengkel.com' },
        update: {},
        create: {
            email: 'admin@bengkel.com',
            passwordHash: adminPassword,
            name: 'Admin Bengkel',
            role: client_1.Role.ADMIN,
        },
    });
    console.log(`✅ Admin: ${admin.email}`);
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'samudra@mail.com' },
        update: {},
        create: {
            email: 'samudra@mail.com',
            passwordHash: userPassword,
            name: 'Samudra',
            role: client_1.Role.USER,
        },
    });
    console.log(`✅ User: ${user.email}`);
    const vehicle = await prisma.vehicle.create({
        data: {
            userId: user.id,
            type: client_1.VehicleType.MOTOR,
            brand: 'Honda',
            model: 'Vario 125',
            year: 2022,
        },
    });
    console.log(`✅ Vehicle: ${vehicle.brand} ${vehicle.model}`);
    const mechanicPassword = await bcrypt.hash('mekanik123', 10);
    const mechanicUser = await prisma.user.upsert({
        where: { email: 'budi@bengkel.com' },
        update: {},
        create: {
            email: 'budi@bengkel.com',
            passwordHash: mechanicPassword,
            name: 'Budi Mekanik',
            role: client_1.Role.MECHANIC,
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
    await prisma.mechanicSpecialty.createMany({
        data: [
            { mechanicId: mechanic.id, specialty: 'motor_injection' },
            { mechanicId: mechanic.id, specialty: 'motor_matic' },
        ],
        skipDuplicates: true,
    });
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
//# sourceMappingURL=seed.js.map