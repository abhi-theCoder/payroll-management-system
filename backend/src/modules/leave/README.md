## 🎯 Leave Management Module - Backend Implementation

Enterprise-grade Leave Management System for Payroll & HRMS integrated with PostgreSQL and Prisma ORM.

### 📁 Module Structure

```
backend/src/modules/leave/
├── leave.controller.ts          # HTTP request handlers
├── leave.service.ts             # Business logic & workflows
├── leave.repository.ts          # Data access layer
├── leave.dto.ts                 # Data transfer objects
├── leave.validator.ts           # Input validation (Zod schemas)
├── routes.ts                    # Express route export
├── leave.routes.ts              # Core route definitions
└── domain/
    ├── leave.entity.ts          # Domain entities with validation
    ├── leave-policy.rules.ts    # Business rules & calculations
    └── approval-flow.rules.ts   # Approval workflow logic
```

### 🗄️ Database Schema

#### Core Tables

**LeaveType**
- Leave type definitions (CL, SL, PL, LOP, WFH, etc.)
- Max days per year, carry forward limits
- Paid/Unpaid, document requirements

**LeaveBalance**
- Employee leave balance tracking per year
- Total, Used, Balance calculations
- Carry forward tracking

**LeaveRequest**
- Leave request submissions
- From/To dates, days calculation
- Status: PENDING, APPROVED, REJECTED, CANCELLED

**LeaveApproval**
- Multi-level approval workflow
- Per-level approval tracking
- Approver identity & timestamp

**LeaveApprovalGroup**
- Department-wise approval hierarchies
- Multiple approval levels
- Escalation rules

**LeavePolicy**
- Company leave policies
- Financial year configuration
- Weekend/Holiday exclusions
- LOP & Encashment rules

### 🔌 API Endpoints

#### Employee Endpoints

```
POST   /api/leaves/apply              # Apply for leave
GET    /api/leaves/history            # Get leave history
GET    /api/leaves/balance            # Get leave balance
POST   /api/leaves/:id/cancel         # Cancel leave request
```

#### Admin/HR Endpoints

```
GET    /api/leaves/pending            # Get pending approvals
POST   /api/leaves/:id/approve        # Approve leave
POST   /api/leaves/:id/reject         # Reject leave
```

#### Settings Endpoints

```
GET    /api/leaves/settings/policy    # Get leave policy
PUT    /api/leaves/settings/policy    # Update leave policy
```

### 📝 Request/Response Examples

**Apply for Leave**
```json
POST /api/leaves/apply
{
  "leaveTypeId": "cll1234",
  "fromDate": "2026-02-01T00:00:00Z",
  "toDate": "2026-02-05T00:00:00Z",
  "reason": "Personal family event",
  "documentUrl": "https://example.com/doc.pdf"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "leave123",
    "employeeId": "emp123",
    "leaveTypeId": "cll1234",
    "fromDate": "2026-02-01",
    "toDate": "2026-02-05",
    "days": 5,
    "reason": "Personal family event",
    "status": "PENDING",
    "createdAt": "2026-01-20T10:00:00Z"
  }
}
```

**Approve Leave**
```json
POST /api/leaves/leave123/approve
{
  "remarks": "Approved - sufficient balance available"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "leave123",
    "status": "APPROVED",
    "approvals": [
      {
        "level": 1,
        "approverId": "approver123",
        "status": "APPROVED",
        "remarks": "Approved...",
        "approvedAt": "2026-01-20T11:00:00Z"
      }
    ]
  }
}
```

### 🔐 Business Rules Implemented

#### Leave Validation
- ✅ No leave overlap with existing approved leaves
- ✅ Date range validation (from <= to)
- ✅ Leave balance sufficiency check
- ✅ Weekend/Holiday exclusion from day count
- ✅ Document requirement validation

#### Approval Workflow
- ✅ Multi-level approval hierarchy
- ✅ Sequential approval by level
- ✅ Rejection at any level = overall rejection
- ✅ Auto-approval completion when all levels approved
- ✅ Escalation tracking (configurable days)

#### Leave Balance Management
- ✅ Per-employee, per-leave-type, per-year tracking
- ✅ Automatic balance deduction on approval
- ✅ Balance restoration on cancellation
- ✅ Carry forward calculation
- ✅ Forfeiture tracking

#### Leave Cancellation
- ✅ Can only cancel approved leaves
- ✅ Minimum 2-day notice required
- ✅ Automatic balance restoration
- ✅ Audit trail logging

### 💼 Service Methods

```typescript
// Apply for leave
applyLeave(employeeId: string, input: ApplyLeaveInput)

// Get leave balance
getLeaveBalance(employeeId: string)

// Get leave history
getLeaveHistory(employeeId: string)

// Approve leave
approveLeave(leaveRequestId: string, approverId: string, input: ApproveLeaveInput)

// Reject leave
rejectLeave(leaveRequestId: string, approverId: string, input: RejectLeaveInput)

// Cancel leave
cancelLeave(leaveRequestId: string, employeeId: string)

// Get pending leaves
getPendingLeaves(filters?: { employeeId?, department?, leaveTypeId? })
```

### 🔒 Access Control

**Roles & Permissions**

- **EMPLOYEE**: Can apply, view own leaves, cancel own approved leaves
- **HR/ADMIN**: Can approve/reject, view all pending leaves
- **ADMIN**: Can configure policies & approval groups

### 📊 Database Relationships

```
User (1) ──→ (N) LeaveApproval (approver)
Employee (1) ──→ (N) LeaveRequest
Employee (1) ──→ (N) LeaveBalance
LeaveType (1) ──→ (N) LeaveRequest
LeaveType (1) ──→ (N) LeaveBalance
LeaveRequest (1) ──→ (N) LeaveApproval
```

### 🚀 Integration Points

- **Payroll Integration**: LOP calculations affect salary
- **Attendance Integration**: Approved leaves update attendance
- **Email Notifications**: Auto-send on apply/approve/reject
- **Audit Logging**: All actions logged with user/timestamp
- **Role-Based Access**: Uses existing RBAC system

### ✅ Testing Checklist

- [ ] Apply leave with valid dates
- [ ] Validate overlapping leaves rejection
- [ ] Test balance sufficiency check
- [ ] Test multi-level approval workflow
- [ ] Test leave cancellation with 2-day notice
- [ ] Test balance restoration on cancellation
- [ ] Test LOP salary impact
- [ ] Test carry forward calculations
- [ ] Test weekend/holiday exclusion
- [ ] Test audit trail logging

### 🔧 Configuration

Update `LeavePolicy` table with:

```json
{
  "weekendDays": ["SATURDAY", "SUNDAY"],
  "financialYearStart": 4,
  "financialYearEnd": 3,
  "lopConfiguration": {
    "deductionPercentage": 100,
    "applicableOnly": ["LOP", "UNPAID"]
  },
  "encashmentRules": {
    "allowEncashment": true,
    "maxEncashableDays": 10
  }
}
```

### 📚 References

- **Validation**: Zod schema in `leave.validator.ts`
- **Entities**: Domain models in `domain/leave.entity.ts`
- **Rules**: Business logic in `domain/leave-policy.rules.ts`
- **Repository**: Data access in `leave.repository.ts`
- **Service**: Workflows in `leave.service.ts`
- **Controller**: HTTP handlers in `leave.controller.ts`
