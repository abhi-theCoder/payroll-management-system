-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenBlacklist" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenBlacklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "maritalStatus" TEXT,
    "department" TEXT,
    "designation" TEXT,
    "reportingManager" TEXT,
    "dateOfJoining" TIMESTAMP(3) NOT NULL,
    "dateOfLeaving" TIMESTAMP(3),
    "employmentType" TEXT NOT NULL DEFAULT 'PERMANENT',
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "panNumber" TEXT,
    "aadharNumber" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "uanNumber" TEXT,
    "esicNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "leaveGroupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryStructure" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveUntil" TIMESTAMP(3),
    "basicSalary" DOUBLE PRECISION NOT NULL,
    "ctc" DOUBLE PRECISION NOT NULL,
    "hra" DOUBLE PRECISION,
    "dearness" DOUBLE PRECISION,
    "conveyance" DOUBLE PRECISION,
    "medical" DOUBLE PRECISION,
    "other" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryComponent" (
    "id" TEXT NOT NULL,
    "salaryStructureId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "calculationType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "formula" TEXT,
    "dependsOn" TEXT,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "salaryStructureId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "basicSalary" DOUBLE PRECISION NOT NULL,
    "earnings" DOUBLE PRECISION NOT NULL,
    "deductions" DOUBLE PRECISION NOT NULL,
    "grossSalary" DOUBLE PRECISION NOT NULL,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "pfDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "esiDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ptDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tdsDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "daysWorked" DOUBLE PRECISION NOT NULL,
    "daysPresent" DOUBLE PRECISION NOT NULL,
    "daysAbsent" DOUBLE PRECISION NOT NULL,
    "daysLeave" DOUBLE PRECISION NOT NULL,
    "lockedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollComponent" (
    "id" TEXT NOT NULL,
    "payrollId" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayrollComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payslip" (
    "id" TEXT NOT NULL,
    "payrollId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "pdfUrl" TEXT,
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "downloadedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceRecord" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "payrollId" TEXT,
    "complianceType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "filedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxDeclaration" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "section80C" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "section80D" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "section80E" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "section80G" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "section80TTA" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalExemptions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedTax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "declarationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxDeclaration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "maxPerYear" INTEGER NOT NULL,
    "carryForward" INTEGER NOT NULL,
    "isCarryForwardAllowed" BOOLEAN NOT NULL DEFAULT true,
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "requiresDocument" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveBalance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveTypeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "used" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "carriedForward" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveTypeId" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "days" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "documentUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveApproval" (
    "id" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveApprovalGroup" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "approvalLevels" INTEGER NOT NULL,
    "approverIds" TEXT[],
    "escalationDays" INTEGER NOT NULL DEFAULT 5,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveApprovalGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeavePolicy" (
    "id" TEXT NOT NULL,
    "policyName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "financialYearStart" INTEGER NOT NULL,
    "financialYearEnd" INTEGER NOT NULL,
    "weekendDays" TEXT[],
    "holidayIds" TEXT[],
    "lopConfiguration" JSONB NOT NULL,
    "encashmentRules" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeavePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "reason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollReport" (
    "id" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "dataSnapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayrollReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timesheet" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "weekEndDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timesheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimesheetEntry" (
    "id" TEXT NOT NULL,
    "timesheetId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "workHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sickHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "personalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimesheetEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveGroupReviewer" (
    "id" TEXT NOT NULL,
    "leaveGroupId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveGroupReviewer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "TokenBlacklist_token_key" ON "TokenBlacklist"("token");

-- CreateIndex
CREATE INDEX "TokenBlacklist_userId_idx" ON "TokenBlacklist"("userId");

-- CreateIndex
CREATE INDEX "TokenBlacklist_expiresAt_idx" ON "TokenBlacklist"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "Employee_employeeId_idx" ON "Employee"("employeeId");

-- CreateIndex
CREATE INDEX "Employee_department_idx" ON "Employee"("department");

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE INDEX "Employee_dateOfJoining_idx" ON "Employee"("dateOfJoining");

-- CreateIndex
CREATE INDEX "SalaryStructure_employeeId_idx" ON "SalaryStructure"("employeeId");

-- CreateIndex
CREATE INDEX "SalaryStructure_effectiveFrom_idx" ON "SalaryStructure"("effectiveFrom");

-- CreateIndex
CREATE INDEX "SalaryStructure_isActive_idx" ON "SalaryStructure"("isActive");

-- CreateIndex
CREATE INDEX "SalaryComponent_salaryStructureId_idx" ON "SalaryComponent"("salaryStructureId");

-- CreateIndex
CREATE INDEX "SalaryComponent_type_idx" ON "SalaryComponent"("type");

-- CreateIndex
CREATE INDEX "Payroll_employeeId_idx" ON "Payroll"("employeeId");

-- CreateIndex
CREATE INDEX "Payroll_month_year_idx" ON "Payroll"("month", "year");

-- CreateIndex
CREATE INDEX "Payroll_status_idx" ON "Payroll"("status");

-- CreateIndex
CREATE INDEX "Payroll_createdAt_idx" ON "Payroll"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_employeeId_month_year_key" ON "Payroll"("employeeId", "month", "year");

-- CreateIndex
CREATE INDEX "PayrollComponent_payrollId_idx" ON "PayrollComponent"("payrollId");

-- CreateIndex
CREATE UNIQUE INDEX "Payslip_payrollId_key" ON "Payslip"("payrollId");

-- CreateIndex
CREATE INDEX "Payslip_employeeId_idx" ON "Payslip"("employeeId");

-- CreateIndex
CREATE INDEX "Payslip_status_idx" ON "Payslip"("status");

-- CreateIndex
CREATE INDEX "Attendance_employeeId_idx" ON "Attendance"("employeeId");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_employeeId_date_key" ON "Attendance"("employeeId", "date");

-- CreateIndex
CREATE INDEX "ComplianceRecord_employeeId_idx" ON "ComplianceRecord"("employeeId");

-- CreateIndex
CREATE INDEX "ComplianceRecord_complianceType_idx" ON "ComplianceRecord"("complianceType");

-- CreateIndex
CREATE UNIQUE INDEX "ComplianceRecord_employeeId_complianceType_month_year_key" ON "ComplianceRecord"("employeeId", "complianceType", "month", "year");

-- CreateIndex
CREATE INDEX "TaxDeclaration_employeeId_idx" ON "TaxDeclaration"("employeeId");

-- CreateIndex
CREATE INDEX "TaxDeclaration_financialYear_idx" ON "TaxDeclaration"("financialYear");

-- CreateIndex
CREATE UNIQUE INDEX "TaxDeclaration_employeeId_financialYear_key" ON "TaxDeclaration"("employeeId", "financialYear");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveType_code_key" ON "LeaveType"("code");

-- CreateIndex
CREATE INDEX "LeaveType_code_idx" ON "LeaveType"("code");

-- CreateIndex
CREATE INDEX "LeaveBalance_employeeId_idx" ON "LeaveBalance"("employeeId");

-- CreateIndex
CREATE INDEX "LeaveBalance_year_idx" ON "LeaveBalance"("year");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveBalance_employeeId_leaveTypeId_year_key" ON "LeaveBalance"("employeeId", "leaveTypeId", "year");

-- CreateIndex
CREATE INDEX "LeaveRequest_employeeId_idx" ON "LeaveRequest"("employeeId");

-- CreateIndex
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");

-- CreateIndex
CREATE INDEX "LeaveRequest_fromDate_toDate_idx" ON "LeaveRequest"("fromDate", "toDate");

-- CreateIndex
CREATE INDEX "LeaveApproval_leaveRequestId_idx" ON "LeaveApproval"("leaveRequestId");

-- CreateIndex
CREATE INDEX "LeaveApproval_approverId_idx" ON "LeaveApproval"("approverId");

-- CreateIndex
CREATE INDEX "LeaveApproval_status_idx" ON "LeaveApproval"("status");

-- CreateIndex
CREATE INDEX "LeaveApprovalGroup_active_idx" ON "LeaveApprovalGroup"("active");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveApprovalGroup_department_key" ON "LeaveApprovalGroup"("department");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entity_idx" ON "AuditLog"("entity");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "PayrollReport_reportType_idx" ON "PayrollReport"("reportType");

-- CreateIndex
CREATE INDEX "PayrollReport_month_year_idx" ON "PayrollReport"("month", "year");

-- CreateIndex
CREATE INDEX "Timesheet_employeeId_idx" ON "Timesheet"("employeeId");

-- CreateIndex
CREATE INDEX "Timesheet_status_idx" ON "Timesheet"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Timesheet_employeeId_weekStartDate_key" ON "Timesheet"("employeeId", "weekStartDate");

-- CreateIndex
CREATE INDEX "TimesheetEntry_timesheetId_idx" ON "TimesheetEntry"("timesheetId");

-- CreateIndex
CREATE UNIQUE INDEX "TimesheetEntry_timesheetId_date_key" ON "TimesheetEntry"("timesheetId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveGroup_name_key" ON "LeaveGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveGroupReviewer_leaveGroupId_reviewerId_key" ON "LeaveGroupReviewer"("leaveGroupId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveGroupReviewer_leaveGroupId_level_key" ON "LeaveGroupReviewer"("leaveGroupId", "level");

-- AddForeignKey
ALTER TABLE "TokenBlacklist" ADD CONSTRAINT "TokenBlacklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_leaveGroupId_fkey" FOREIGN KEY ("leaveGroupId") REFERENCES "LeaveGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryStructure" ADD CONSTRAINT "SalaryStructure_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryComponent" ADD CONSTRAINT "SalaryComponent_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES "SalaryStructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES "SalaryStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollComponent" ADD CONSTRAINT "PayrollComponent_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceRecord" ADD CONSTRAINT "ComplianceRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceRecord" ADD CONSTRAINT "ComplianceRecord_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxDeclaration" ADD CONSTRAINT "TaxDeclaration_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApproval" ADD CONSTRAINT "LeaveApproval_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "LeaveRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApproval" ADD CONSTRAINT "LeaveApproval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timesheet" ADD CONSTRAINT "Timesheet_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetEntry" ADD CONSTRAINT "TimesheetEntry_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveGroupReviewer" ADD CONSTRAINT "LeaveGroupReviewer_leaveGroupId_fkey" FOREIGN KEY ("leaveGroupId") REFERENCES "LeaveGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveGroupReviewer" ADD CONSTRAINT "LeaveGroupReviewer_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
