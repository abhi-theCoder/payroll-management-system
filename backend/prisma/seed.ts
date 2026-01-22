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
    update: {
      userId: employeeUser.id,
      email: employeeUser.email,
    },
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

  // Add more sample employees
  const otherEmployees = [
    {
      id: 'EMP002',
      email: 'jane.smith@company.local',
      firstName: 'Jane',
      lastName: 'Smith',
      department: 'HR',
      designation: 'HR Specialist',
      role: 'HR' as const,
    },
    {
      id: 'EMP003',
      email: 'bob.wilson@company.local',
      firstName: 'Bob',
      lastName: 'Wilson',
      department: 'Engineering',
      designation: 'DevOps Engineer',
      role: 'EMPLOYEE' as const,
    },
    {
      id: 'EMP004',
      email: 'alice.brown@company.local',
      firstName: 'Alice',
      lastName: 'Brown',
      department: 'Marketing',
      designation: 'Marketing Lead',
      role: 'EMPLOYEE' as const,
    },
    {
      id: 'EMP005',
      email: 'charlie.davis@company.local',
      firstName: 'Charlie',
      lastName: 'Davis',
      department: 'Engineering',
      designation: 'QA Engineer',
      role: 'EMPLOYEE' as const,
    },
  ];

  for (const emp of otherEmployees) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        email: emp.email,
        password: hashedPassword,
        firstName: emp.firstName,
        lastName: emp.lastName,
        role: emp.role,
        active: true,
      },
    });

    await prisma.employee.upsert({
      where: { employeeId: emp.id },
      update: {
        userId: user.id,
        email: emp.email,
        department: emp.department,
        designation: emp.designation,
      },
      create: {
        employeeId: emp.id,
        userId: user.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: `+91-987654321${otherEmployees.indexOf(emp) + 1}`,
        dateOfBirth: new Date('1992-08-20'),
        gender: 'FEMALE',
        maritalStatus: 'SINGLE',
        department: emp.department,
        designation: emp.designation,
        dateOfJoining: new Date('2021-03-10'),
        employmentType: 'PERMANENT',
        panNumber: `BCDAE${1234 + otherEmployees.indexOf(emp)}Z`,
        aadharNumber: `2345-6789-012${otherEmployees.indexOf(emp)}`,
        accountNumber: `234567890123456${otherEmployees.indexOf(emp)}`,
        ifscCode: 'HDFC0000001',
        status: 'ACTIVE',
      },
    });
    console.log(`Employee created: ${emp.id} - ${emp.firstName} ${emp.lastName}`);
  }

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

  // Create Leave Groups
  const engGroup = await prisma.leaveGroup.upsert({
    where: { name: 'Engineering Group' },
    update: {},
    create: {
      name: 'Engineering Group',
      description: 'Leave group for Engineering department',
      active: true,
    },
  });

  // Assign Reviewer (Bob Wilson - Manager) to Engineering Group
  // Find Bob
  const bob = await prisma.user.findFirst({ where: { email: 'bob.wilson@company.local' } });
  if (bob) {
    await prisma.leaveGroupReviewer.upsert({
      where: { leaveGroupId_reviewerId: { leaveGroupId: engGroup.id, reviewerId: bob.id } },
      update: {},
      create: {
        leaveGroupId: engGroup.id,
        reviewerId: bob.id,
        level: 1,
      }
    });
    console.log('Assigned Bob as reviewer for Engineering Group');
  }

  // Assign John Doe to Engineering Group
  await prisma.employee.update({
    where: { employeeId: 'EMP001' },
    data: { leaveGroupId: engGroup.id }
  });
  console.log('Assigned John Doe to Engineering Group');

  console.log('Salary components created');

  // Create default leave types
  const leaveTypes = [
    {
      name: 'Annual Leave',
      code: 'AL',
      maxPerYear: 15,
      carryForward: 5,
      isCarryForwardAllowed: true,
      isPaid: true,
      requiresDocument: false,
    },
    {
      name: 'Sick Leave',
      code: 'SL',
      maxPerYear: 10,
      carryForward: 0,
      isCarryForwardAllowed: false,
      isPaid: true,
      requiresDocument: true,
    },
    {
      name: 'Personal Leave',
      code: 'PL',
      maxPerYear: 5,
      carryForward: 0,
      isCarryForwardAllowed: false,
      isPaid: true,
      requiresDocument: false,
    }
  ];

  for (const type of leaveTypes) {
    await prisma.leaveType.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }
  console.log('Leave types created');

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
