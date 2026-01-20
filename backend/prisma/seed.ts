import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (for development)
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@payroll.local' },
    update: {},
    create: {
      email: 'admin@payroll.local',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      active: true,
    },
  });

  console.log('Admin user created:', admin.email);

  // Create HR user
  const hr = await prisma.user.upsert({
    where: { email: 'hr@payroll.local' },
    update: {},
    create: {
      email: 'hr@payroll.local',
      password: hashedPassword,
      firstName: 'HR',
      lastName: 'Manager',
      role: 'HR',
      active: true,
    },
  });

  console.log('HR user created:', hr.email);

  // Create Accounts user
  const accounts = await prisma.user.upsert({
    where: { email: 'accounts@payroll.local' },
    update: {},
    create: {
      email: 'accounts@payroll.local',
      password: hashedPassword,
      firstName: 'Accounts',
      lastName: 'Executive',
      role: 'ACCOUNTS',
      active: true,
    },
  });

  console.log('Accounts user created:', accounts.email);

  // Create sample employee with user
  const employeeUser = await prisma.user.upsert({
    where: { email: 'john.doe@company.local' },
    update: {},
    create: {
      email: 'john.doe@company.local',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'EMPLOYEE',
      active: true,
    },
  });

  const employee = await prisma.employee.upsert({
    where: { employeeId: 'EMP001' },
    update: {},
    create: {
      employeeId: 'EMP001',
      userId: employeeUser.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.local',
      phone: '+91-9876543210',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
      maritalStatus: 'MARRIED',
      department: 'Engineering',
      designation: 'Senior Developer',
      dateOfJoining: new Date('2020-01-15'),
      employmentType: 'PERMANENT',
      panNumber: 'ABCDE1234F',
      aadharNumber: '1234-5678-9012',
      accountNumber: '1234567890123456',
      ifscCode: 'ICIC0000001',
      uanNumber: '100123456789',
      esicNumber: '30123456789012345',
      status: 'ACTIVE',
    },
  });

  console.log('Sample employee created:', employee.employeeId);

  // Create salary structure
  const salaryStructure = await prisma.salaryStructure.create({
    data: {
      employeeId: employee.id,
      name: 'Standard Salary Structure',
      effectiveFrom: new Date('2024-01-01'),
      basicSalary: 60000,
      ctc: 900000,
      hra: 12000,
      dearness: 5000,
      conveyance: 2000,
      medical: 5000,
      isActive: true,
    },
  });

  console.log('Salary structure created:', salaryStructure.id);

  // Create salary components
  const components = [
    {
      salaryStructureId: salaryStructure.id,
      name: 'Basic Salary',
      type: 'EARNING',
      calculationType: 'FIXED',
      value: 60000,
    },
    {
      salaryStructureId: salaryStructure.id,
      name: 'HRA',
      type: 'EARNING',
      calculationType: 'PERCENTAGE',
      value: 20,
      formula: 'Basic * 0.20',
    },
    {
      salaryStructureId: salaryStructure.id,
      name: 'Provident Fund',
      type: 'DEDUCTION',
      calculationType: 'PERCENTAGE',
      value: 12,
    },
    {
      salaryStructureId: salaryStructure.id,
      name: 'Professional Tax',
      type: 'DEDUCTION',
      calculationType: 'FIXED',
      value: 200,
    },
  ];

  for (const component of components) {
    await prisma.salaryComponent.create({ data: component });
  }

  console.log('Salary components created');

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
