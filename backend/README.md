# Payroll & Salary Management Backend

Enterprise-grade Payroll & Salary Management Backend built with **Express.js**, **PostgreSQL**, and **TypeScript** following **Clean Architecture** and **Domain-Driven Design** principles.

## 🎯 Features

### Core Modules

- **Auth Module**: JWT authentication, role-based authorization, password management
- **Employee Module**: Employee management, personal & employment details
- **Salary Structure Module**: Rule-driven salary configuration, component management
- **Payroll Processing**: Atomic, idempotent payroll calculation with compliance
- **Compliance Module**: PF, ESI, PT, TDS calculations with compliance filing
- **Tax Module**: Tax declaration, exemption calculation, annual projections
- **Payslip Module**: Payslip generation and distribution tracking
- **Reports Module**: Comprehensive payroll analytics and reporting

### Key Features

✅ **Scalable Architecture** - Clean Architecture with DDD principles  
✅ **Type-Safe** - Full TypeScript with strict mode  
✅ **Production-Ready** - Error handling, logging, security  
✅ **Database** - PostgreSQL with Prisma ORM  
✅ **Testing** - Jest unit & integration tests  
✅ **Docker** - Docker & Docker Compose setup  
✅ **Compliance** - Indian statutory compliance (PF, ESI, PT, TDS)  
✅ **RBAC** - Role-based access control  
✅ **Audit Logs** - Payroll action tracking  

## 📁 Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
│
├── config/
│   ├── env.ts            # Environment configuration
│   ├── database.ts       # Prisma database client
│   └── logger.ts         # Pino logger
│
├── modules/
│   ├── auth/             # Authentication & Authorization
│   ├── employee/         # Employee management
│   ├── salary/           # Salary structure with DDD domain
│   ├── payroll/          # Payroll processing engine
│   ├── compliance/       # Compliance calculations
│   ├── tax/              # Tax calculations
│   ├── payslip/          # Payslip management
│   └── reports/          # Reporting & analytics
│
├── shared/
│   ├── middleware/       # Auth, logging, error handling
│   ├── exceptions/       # Custom exception classes
│   ├── utils/            # Utility functions
│   ├── constants/        # Application constants
│   └── validators/       # Zod validation helpers
│
└── tests/                # Test files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.development .env

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed

# Start development server
npm run dev
```

### Using Docker

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run prisma:migrate

# Seed database
docker-compose exec backend npm run prisma:seed

# View logs
docker-compose logs -f backend
```

## 📚 API Documentation

### Authentication Endpoints

```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "EMPLOYEE"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

# Refresh Token
POST /api/auth/refresh-token
{
  "refreshToken": "eyJhbGc..."
}

# Logout
POST /api/auth/logout
# (Include JWT in Authorization header)
```

### Employee Endpoints

```bash
# Create Employee
POST /api/employees
{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@company.com",
  "department": "Engineering",
  "designation": "Senior Developer",
  "dateOfJoining": "2024-01-15"
}

# Get All Employees
GET /api/employees?page=1&limit=20&department=Engineering

# Get Employee Details
GET /api/employees/:id

# Update Employee
PUT /api/employees/:id

# Deactivate Employee
POST /api/employees/:id/deactivate
```

### Salary Structure Endpoints

```bash
# Create Salary Structure
POST /api/salary
{
  "employeeId": "emp-id",
  "name": "Standard Structure",
  "effectiveFrom": "2024-01-01",
  "basicSalary": 60000,
  "ctc": 900000,
  "hra": 12000,
  "components": [
    {
      "name": "HRA",
      "type": "EARNING",
      "calculationType": "PERCENTAGE",
      "value": 20
    }
  ]
}

# Get Active Salary Structure
GET /api/salary/employee/:employeeId/active

# Calculate Salary
POST /api/salary/:salaryStructureId/calculate
{
  "basicSalary": 60000
}
```

### Payroll Endpoints

```bash
# Process Payroll
POST /api/payroll/process
{
  "month": 1,
  "year": 2024,
  "employeeIds": ["emp-id-1", "emp-id-2"]
}

# Get Payroll
GET /api/payroll/:id

# Get Employee Payroll for Month
GET /api/payroll/employee/:employeeId/month?month=1&year=2024

# Lock Payroll
POST /api/payroll/:id/lock

# Reject Payroll
POST /api/payroll/:id/reject
{
  "reason": "Discrepancy in attendance"
}
```

### Compliance Endpoints

```bash
# Calculate Compliance Deductions
POST /api/compliance/calculate
{
  "grossSalary": 75000,
  "basicSalary": 60000,
  "employeeId": "emp-id"
}

# Get Compliance Report
GET /api/compliance/report?month=1&year=2024
```

### Tax Endpoints

```bash
# Create Tax Declaration
POST /api/tax/declarations
{
  "employeeId": "emp-id",
  "financialYear": "2024-2025",
  "section80C": 50000,
  "section80D": 15000
}

# Calculate Tax Projection
POST /api/tax/employee/:employeeId/projection
{
  "monthlyGrossSalary": 75000,
  "monthlyBasic": 60000
}
```

### Reports Endpoints

```bash
# Salary Register
GET /api/reports/salary-register?month=1&year=2024&department=Engineering

# Bank Transfer Report
GET /api/reports/bank-transfer?month=1&year=2024

# Compliance Filing
GET /api/reports/compliance?month=1&year=2024

# Tax Summary
GET /api/reports/tax-summary?financialYear=2024-2025

# Cost Analysis
GET /api/reports/cost-analysis?month=1&year=2024

# Attendance Report
GET /api/reports/attendance?month=1&year=2024
```

## 🏗️ Architecture

### Domain-Driven Design

Each module follows a strict structure:

- **Entity**: Domain models with business logic
- **Domain Rules**: Business rule definitions
- **Service**: Use cases and business operations
- **Controller**: HTTP request handling
- **Repository**: Data access layer (via Prisma)
- **DTO**: Data transfer objects with validation

### Example: Salary Structure Module

```typescript
// Domain Entity with business logic
export class SalaryStructure {
  calculateGrossSalary(): number { ... }
  calculateDeductions(): number { ... }
  validate(): { valid: boolean; errors: string[] } { ... }
}

// Domain Rules
export const SalaryRules = {
  isValidCTC(basic, ctc) { ... },
  calculateHRA(basic) { ... }
}

// Service (Use Case)
export class SalaryService {
  async createSalaryStructure(data) { ... }
  async calculateSalary(structureId, context) { ... }
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🔒 Security

- JWT authentication with refresh token rotation
- Password hashing with bcrypt (10+ rounds)
- SQL injection prevention (Prisma)
- Request validation with Zod
- Role-based access control (RBAC)
- Helmet for security headers
- Request timeout: 30 seconds
- Audit logs for sensitive operations

## 📊 Database Schema

Key tables:

- `users` - User accounts with roles
- `employees` - Employee information
- `salaryStructures` - Salary templates
- `salaryComponents` - Individual components
- `payrolls` - Monthly payroll records
- `payslips` - Generated payslips
- `complianceRecords` - PF, ESI, PT, TDS records
- `taxDeclarations` - Annual tax declarations
- `auditLogs` - Action tracking

## 🌍 Environment Variables

See `.env.development` and `.env.production` for complete configuration options.

Critical variables:

```bash
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your-secret-key
REDIS_URL=redis://host:6379
LOG_LEVEL=info
BCRYPT_ROUNDS=10
```

## 📦 Deployment

### Docker Build

```bash
npm run build
docker build -t payroll-backend:1.0.0 .
docker run -p 3000:3000 --env-file .env.production payroll-backend:1.0.0
```

### Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure production database
- [ ] Setup Redis for caching
- [ ] Configure email service
- [ ] Enable HTTPS/SSL
- [ ] Setup monitoring & logging
- [ ] Configure database backups
- [ ] Enable audit logging
- [ ] Setup rate limiting
- [ ] Configure CORS appropriately

## 🤝 Contributing

1. Follow the existing folder structure
2. Maintain Clean Architecture principles
3. Write tests for new features
4. Use TypeScript strict mode
5. Add JSDoc comments for public methods

## 📄 License

MIT

## 🆘 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U payroll_user -d payroll_dev -c "SELECT 1"

# Reset migrations
npm run prisma:migrate reset
```

### Port Already in Use

```bash
# Use different port
PORT=3001 npm run dev
```

### Module Import Errors

```bash
# Ensure TypeScript paths are set correctly in tsconfig.json
# Regenerate Prisma client
npm run prisma:generate
```

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Express.js, PostgreSQL, and TypeScript**
