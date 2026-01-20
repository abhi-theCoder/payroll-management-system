# Enterprise Payroll Frontend - Next.js Structure

## 📁 Folder Organization

```
frontend/
├── public/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── logos/
│
├── src/
│   ├── app/                         # App Router (Next.js 14+)
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── error.tsx                # Error boundary
│   │   ├── loading.tsx              # Loading state
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   │
│   │   │   ├── employees/
│   │   │   │   ├── page.tsx         # Employee list
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx     # Employee details
│   │   │   │   │   ├── edit/page.tsx
│   │   │   │   │   └── salary/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   │
│   │   │   ├── payroll/
│   │   │   │   ├── page.tsx         # Payroll list
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── preview/[id]/page.tsx
│   │   │   │
│   │   │   ├── salary-structures/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   │
│   │   │   ├── payslips/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── salary-register/page.tsx
│   │   │   │   ├── bank-transfer/page.tsx
│   │   │   │   ├── compliance/page.tsx
│   │   │   │   ├── tax-summary/page.tsx
│   │   │   │   └── cost-analysis/page.tsx
│   │   │   │
│   │   │   ├── compliance/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── filings/page.tsx
│   │   │   │
│   │   │   ├── tax/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── declarations/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── security/page.tsx
│   │   │   │   └── integrations/page.tsx
│   │   │   │
│   │   │   └── audit-logs/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                     # API routes (optional, for SSR)
│   │       ├── auth/[...nextauth].ts
│   │       └── webhooks/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── Loading.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── MainLayout.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── EmployeeForm.tsx
│   │   │   ├── SalaryStructureForm.tsx
│   │   │   ├── PayrollForm.tsx
│   │   │   ├── TaxDeclarationForm.tsx
│   │   │   └── ComplianceForm.tsx
│   │   │
│   │   ├── tables/
│   │   │   ├── EmployeeTable.tsx
│   │   │   ├── PayrollTable.tsx
│   │   │   ├── PayslipTable.tsx
│   │   │   ├── ReportTable.tsx
│   │   │   └── AuditLogTable.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── EmployeeCard.tsx
│   │   │   ├── PayrollCard.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── SalaryBreakdownCard.tsx
│   │   │
│   │   ├── dialogs/
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── PayrollLockDialog.tsx
│   │   │   ├── PayslipDialog.tsx
│   │   │   └── ReportExportDialog.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── SalaryTrendChart.tsx
│   │   │   ├── DepartmentCostChart.tsx
│   │   │   ├── TaxProjectionChart.tsx
│   │   │   └── PayrollProgressChart.tsx
│   │   │
│   │   └── ui/                      # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       ├── Alert.tsx
│   │       ├── Badge.tsx
│   │       ├── Tabs.tsx
│   │       ├── Dropdown.tsx
│   │       ├── Checkbox.tsx
│   │       ├── Radio.tsx
│   │       ├── Spinner.tsx
│   │       ├── Toast.tsx
│   │       └── Pagination.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEmployee.ts
│   │   ├── usePayroll.ts
│   │   ├── useSalaryStructure.ts
│   │   ├── useComplianceCalculator.ts
│   │   ├── useTaxCalculator.ts
│   │   ├── usePayslip.ts
│   │   ├── useReport.ts
│   │   ├── usePagination.ts
│   │   ├── useForm.ts
│   │   ├── useFetch.ts
│   │   ├── useDebounce.ts
│   │   └── useNotification.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts             # Axios/Fetch setup
│   │   │   ├── authService.ts
│   │   │   ├── employeeService.ts
│   │   │   ├── payrollService.ts
│   │   │   ├── salaryService.ts
│   │   │   ├── complianceService.ts
│   │   │   ├── taxService.ts
│   │   │   ├── payslipService.ts
│   │   │   ├── reportService.ts
│   │   │   └── auditService.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatter.ts          # Number/currency formatting
│   │   │   ├── validator.ts
│   │   │   ├── calculator.ts         # Frontend calculations
│   │   │   ├── fileDownload.ts
│   │   │   ├── csvExport.ts
│   │   │   ├── pdfExport.ts
│   │   │   └── dateUtils.ts
│   │   │
│   │   └── storage/
│   │       ├── localStorage.ts
│   │       ├── sessionStorage.ts
│   │       └── cookies.ts
│   │
│   ├── store/                        # State management (Zustand/Redux)
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   ├── employeeStore.ts
│   │   ├── payrollStore.ts
│   │   ├── notificationStore.ts
│   │   └── index.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── types/
│   │   ├── api.ts               # API response types
│   │   ├── models.ts            # Domain models
│   │   ├── forms.ts             # Form types
│   │   ├── ui.ts                # UI component props
│   │   └── index.ts
│   │
│   ├── constants/
│   │   ├── api.ts               # API endpoints
│   │   ├── roles.ts
│   │   ├── payrollStatus.ts
│   │   ├── complianceTypes.ts
│   │   ├── messages.ts          # User messages
│   │   └── config.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   ├── components.css
│   │   ├── utilities.css
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   │
│   └── utils/
│       ├── classNames.ts
│       ├── getInitials.ts
│       ├── sanitize.ts
│       └── logger.ts
│
├── .env.local                       # Local env variables
├── .env.production                  # Production env
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tsconfig.json
├── tailwind.config.js              # If using Tailwind
├── package.json
├── README.md
└── public/
    ├── images/
    ├── icons/
    └── fonts/
```

---

## 🗂️ Detailed Component Structure

### **Common Components**
```
Header.tsx          - Top navigation bar
Sidebar.tsx         - Left navigation menu
Footer.tsx          - Page footer
Navbar.tsx          - Mobile navbar
Breadcrumb.tsx      - Navigation breadcrumb
Loading.tsx         - Loading skeleton
```

### **Forms**
```
LoginForm.tsx                   - Login form with email/password
EmployeeForm.tsx               - Employee CRUD form
SalaryStructureForm.tsx         - Salary structure setup
PayrollForm.tsx                 - Monthly payroll processing
TaxDeclarationForm.tsx          - Tax declaration form
ComplianceForm.tsx              - Compliance data input
```

### **Tables**
```
EmployeeTable.tsx               - Employee listing with search/filter
PayrollTable.tsx                - Payroll runs display
PayslipTable.tsx                - Payslips listing
ReportTable.tsx                 - Dynamic report display
AuditLogTable.tsx               - Action audit trail
```

### **Cards**
```
EmployeeCard.tsx                - Employee summary card
PayrollCard.tsx                 - Payroll status card
StatCard.tsx                    - KPI/metric display
SalaryBreakdownCard.tsx          - Salary component breakdown
```

### **UI Components (Reusable)**
```
Button.tsx                      - Variants: primary, secondary, danger
Input.tsx                       - Text, email, number inputs
Select.tsx                      - Dropdown selection
Modal.tsx                       - Dialog/modal windows
Alert.tsx                       - Info, success, warning, error
Badge.tsx                       - Status badges
Tabs.tsx                        - Tab navigation
Pagination.tsx                  - Table pagination
```

---

## 🔗 Custom Hooks

```typescript
// useAuth.ts - Authentication management
const { user, login, logout, isAuthenticated } = useAuth();

// useEmployee.ts - Employee data fetching
const { employees, loading, error, fetchEmployee } = useEmployee();

// usePayroll.ts - Payroll operations
const { payroll, processing, processPayroll } = usePayroll();

// useForm.ts - Form state management
const form = useForm({ initialValues, onSubmit });

// usePagination.ts - Pagination logic
const { page, pageSize, setPage, totalPages } = usePagination();

// useFetch.ts - Generic data fetching
const { data, loading, error, refetch } = useFetch(url);

// useNotification.ts - Toast notifications
const { notify, success, error } = useNotification();
```

---

## 🔐 Services Structure

### **API Services**
```typescript
// authService.ts
- login(email, password)
- register(data)
- logout()
- refreshToken()
- changePassword()

// employeeService.ts
- getEmployees(filters)
- getEmployee(id)
- createEmployee(data)
- updateEmployee(id, data)
- deleteEmployee(id)
- getEmployeeSalaryStructure(id)

// payrollService.ts
- getPayrolls(month, year)
- getPayroll(id)
- processPayroll(month, year)
- lockPayroll(id)
- rejectPayroll(id, reason)

// reportService.ts
- getSalaryRegister(filters)
- getBankTransferReport(filters)
- getComplianceReport(filters)
- getTaxSummaryReport(fy)
- getCostAnalysisReport(filters)
- exportReport(type, format)
```

---

## 📦 State Management (Zustand)

```typescript
// authStore.ts
- user
- token
- isAuthenticated
- login()
- logout()

// uiStore.ts
- sidebarOpen
- theme
- toggleSidebar()
- toggleTheme()

// employeeStore.ts
- employees
- selectedEmployee
- fetchEmployees()
- selectEmployee()

// notificationStore.ts
- notifications
- addNotification()
- removeNotification()
```

---

## 🎨 Styling Approach

**Recommended: Tailwind CSS + CSS Modules**

```
src/styles/
├── globals.css          - Global styles
├── variables.css        - CSS variables (colors, spacing)
├── components/
│   ├── Button.module.css
│   ├── Form.module.css
│   └── Table.module.css
└── themes/
    ├── light.css
    └── dark.css
```

---

## 🔄 Page Features by Route

### **Authentication Pages**
- `/login` - Login with JWT token storage
- `/register` - Employee registration
- `/forgot-password` - Password reset flow

### **Dashboard**
- `/dashboard` - KPI cards, recent activities, quick actions

### **Employee Management**
- `/employees` - List all employees with search/filter
- `/employees/[id]` - Employee details & salary history
- `/employees/[id]/edit` - Edit employee data
- `/employees/new` - Create new employee

### **Payroll**
- `/payroll` - List payroll runs
- `/payroll/new` - Start new payroll
- `/payroll/[id]` - Payroll details & approval
- `/payroll/preview/[id]` - Preview before finalization

### **Salary Structures**
- `/salary-structures` - List all structures
- `/salary-structures/[id]` - Edit structure
- `/salary-structures/new` - Create structure

### **Payslips**
- `/payslips` - List all payslips
- `/payslips/[id]` - View & download payslip

### **Reports**
- `/reports` - Report dashboard
- `/reports/salary-register` - Salary register export
- `/reports/bank-transfer` - Bank transfer file
- `/reports/compliance` - Compliance filing data
- `/reports/tax-summary` - Tax summary by FY
- `/reports/cost-analysis` - Department cost analysis

### **Compliance**
- `/compliance` - Compliance records
- `/compliance/[id]` - View compliance record
- `/compliance/filings` - Filing status

### **Tax**
- `/tax` - Tax declarations
- `/tax/declarations` - Declaration management
- `/tax/[id]` - Edit tax declaration

### **Settings**
- `/settings` - General settings
- `/settings/profile` - User profile
- `/settings/security` - Password & 2FA
- `/settings/integrations` - API integrations

### **Audit Logs**
- `/audit-logs` - Action history

---

## 🛠️ Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.3.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "tailwindcss": "^3.3.0",
    "next-auth": "^4.24.0",
    "jspdf": "^2.5.0",
    "papaparse": "^5.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.3.0"
  }
}
```

---

## 📋 Type Definitions

```typescript
// types/models.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'HR' | 'ACCOUNTS' | 'EMPLOYEE';
}

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  salaryStructure?: SalaryStructure;
}

interface Payroll {
  id: string;
  month: number;
  year: number;
  status: 'DRAFT' | 'PROCESSING' | 'PROCESSED' | 'LOCKED' | 'REJECTED';
  employees: PayrollEmployee[];
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  processedAt?: string;
  lockedAt?: string;
}

interface SalaryStructure {
  id: string;
  name: string;
  basicSalary: number;
  ctc: number;
  components: SalaryComponent[];
  effectiveFrom: string;
  effectiveUntil?: string;
}

interface SalaryComponent {
  id: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION';
  calculationType: 'FIXED' | 'PERCENTAGE' | 'FORMULA';
  value: number;
}
```

---

## 🚀 Getting Started

```bash
# Create Next.js project
npx create-next-app@latest frontend --typescript --tailwind

# Install dependencies
npm install axios zustand react-hook-form zod date-fns

# Development
npm run dev              # http://localhost:3000

# Build
npm run build

# Production
npm start
```

---

## 🔒 Security Best Practices

1. **Authentication**: Use NextAuth.js or JWT stored in httpOnly cookies
2. **CORS**: Configure backend CORS for frontend domain
3. **Input Validation**: Use Zod for client-side validation
4. **XSS Protection**: Sanitize all user inputs
5. **CSRF Tokens**: Include CSRF tokens in sensitive operations
6. **Environment Variables**: Never commit `.env.local`
7. **Request Logging**: Log API calls for debugging

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Use Tailwind's responsive classes
- Mobile sidebar collapse on smaller screens

---

## 🎯 Performance Optimizations

- Code splitting with dynamic imports
- Image optimization with Next.js Image component
- API response caching
- Lazy load heavy charts/tables
- Memoization for expensive computations
- Debounce search/filter inputs

---

**This structure is production-ready and scales with your backend perfectly!**
