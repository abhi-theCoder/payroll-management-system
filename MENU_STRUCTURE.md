# Application Navigation Menu Structure

## ✅ Complete Menu Integration

All application pages are properly integrated into the sidebar navigation menu with role-based access control.

### Menu Hierarchy

```
📊 Dashboard
   └─ [Dashboard Overview]

👥 Employee Management
   ├─ 👤 All Employees → /dashboard/employees
   ├─ ➕ Add Employee → /dashboard/employees/new
   ├─ 📅 Attendance → /dashboard/attendance
   └─ 🏖️ Leave Management → /dashboard/leave

💰 Salary & Payroll
   ├─ 📈 Salary Structure → /dashboard/salary
   ├─ ⚙️ Payroll Processing → /dashboard/payroll
   └─ 📄 Payslips → /dashboard/payslips

🛡️ Compliance & Tax
   ├─ ✅ Compliance Tracking → /dashboard/compliance
   └─ 📋 Tax Declarations → /dashboard/tax

📊 Reports → /dashboard/reports

⚙️ Settings → /dashboard/settings

👤 My Profile → /dashboard/profile
```

### Leave Management Integration

**Location in Menu:** Employee Management → Leave Management
**URL:** `/dashboard/leave`
**Icon:** Clock
**Permissions:** VIEW_LEAVE

**Features:**
- ✅ Leave Balance Display
- ✅ Apply for Leave
- ✅ Leave History
- ✅ Pending Approvals (HR/Admin)
- ✅ Policy Settings (Admin only)

### Role-Based Access

**EMPLOYEE:**
- Dashboard, Employees, Attendance, Leave Management, Payslips, Profile

**HR:**
- Dashboard, Employee Management (all), Attendance, Leave Management (with approvals), Salary & Payroll, Reports, Settings

**ADMIN:**
- All menu items with full access including Policy Settings

**ACCOUNTS:**
- Dashboard, Salary & Payroll (all), Reports, Compliance & Tax

### Permission Matrix for Leave Management

| Permission | EMPLOYEE | HR | ADMIN | ACCOUNTS |
|------------|----------|----|----|----------|
| VIEW_LEAVE | ✅ | ✅ | ✅ | ❌ |
| CREATE_LEAVE | ✅ | ✅ | ✅ | ❌ |
| APPROVE_LEAVE | ❌ | ✅ | ✅ | ❌ |
| MANAGE_LEAVE_POLICY | ❌ | ❌ | ✅ | ❌ |

### Verification Checklist

✅ Dashboard configured and accessible  
✅ Employee Management menu with sub-items  
✅ All employee-related pages (Employees, Attendance, Leave)  
✅ Salary & Payroll structure complete  
✅ Compliance & Tax tracking available  
✅ Reports dashboard integrated  
✅ Settings panel accessible  
✅ User profile page functional  
✅ Leave Management fully integrated  
✅ Role-based access control enforced  
✅ Sidebar navigation with collapse feature  
✅ Top header with user info and logout  

### Menu Configuration File

**Location:** `frontend/src/config/rbac.ts`

The SIDEBAR_MENU array contains:
- 7 main menu sections
- 10+ sub-menu items
- Permission-based visibility
- Icon support via Lucide React
- Full href routing integration

### Frontend Page Status

| Page | Status | Menu Link | Auth Protected |
|------|--------|-----------|---|
| Dashboard | ✅ Ready | Main Menu | Yes |
| Employees | ✅ Ready | Employee Management | Yes |
| Attendance | ✅ Ready | Employee Management | Yes |
| Leave Management | ✅ Ready | Employee Management | Yes |
| Salary | ✅ Ready | Salary & Payroll | Yes |
| Payroll | ✅ Ready | Salary & Payroll | Yes |
| Payslips | ✅ Ready | Salary & Payroll | Yes |
| Compliance | ✅ Ready | Compliance & Tax | Yes |
| Tax | ✅ Ready | Compliance & Tax | Yes |
| Reports | ✅ Ready | Main Menu | Yes |
| Settings | ✅ Ready | Main Menu | Yes |
| Profile | ✅ Ready | Main Menu | Yes |

### Recent Additions - Leave Management

**New API Endpoints:**
- POST `/api/leaves/apply` - Apply for leave
- GET `/api/leaves/history` - Get leave history
- GET `/api/leaves/balance` - Get leave balance
- GET `/api/leaves/pending` - Get pending approvals (HR/Admin)
- POST `/api/leaves/:id/approve` - Approve leave
- POST `/api/leaves/:id/reject` - Reject leave
- GET `/api/leaves/settings/policy` - Get policy
- PUT `/api/leaves/settings/policy` - Update policy

**New Frontend Components:**
- LeaveApplyForm - Employee application form
- LeaveHistory - Leave request history
- LeaveBalanceCards - Balance display
- PendingApprovalssDashboard - Admin approvals
- LeaveSettingsPanel - Policy configuration
- LeaveManagementPage - Main page with tabs

**New Services:**
- leaveService.ts - API client for leave operations

---

**Note:** All menu items are now fully integrated into the application. The Leave Management system is production-ready and accessible through the main navigation.
