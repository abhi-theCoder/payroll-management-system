# Frontend - ERP Payroll System

A modern Next.js-based frontend for the comprehensive payroll and HR management system.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.3
- **State Management**: Zustand
- **Form Handling**: React Hook Form 7.48
- **Validation**: Zod 3.22
- **HTTP Client**: Axios 1.6
- **Authentication**: NextAuth.js 4.24
- **UI Components**: Custom components built with Tailwind CSS

## Project Structure

```
src/
├── app/              # App Router pages
│   ├── (auth)/       # Authentication routes (login, register)
│   ├── dashboard/    # Protected dashboard routes
│   ├── layout.tsx    # Root layout with metadata
│   └── page.tsx      # Home page
├── components/       # Reusable React components
│   └── ui/          # Base UI components (Button, Input, Alert)
├── services/        # API service layer
│   └── api/         # Axios instance and service functions
├── hooks/           # Custom React hooks
│   ├── useAuth.ts   # Authentication hook
│   └── useAsync.ts  # Async data fetching hook
├── store/           # Zustand stores
│   └── authStore.ts # Auth state management
├── types/           # TypeScript type definitions
│   └── models.ts    # API response types
├── constants/       # Application constants
│   └── index.ts     # API endpoints, roles, statuses
├── utils/           # Utility functions
│   └── index.ts     # Formatting, validation, helpers
└── styles/          # Global styles
    └── globals.css  # Tailwind configuration and custom styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Features

### Authentication
- Login/Register forms
- JWT token management
- Automatic token refresh
- Protected routes

### Dashboard
- User welcome message
- Quick statistics cards
- Quick action buttons
- Activity feed

### Modules (Ready to Implement)
- **Employee Management** - CRUD operations for employee records
- **Salary Management** - Salary structure management
- **Payroll Processing** - Payroll generation and processing
- **Tax Declarations** - Tax management and declarations
- **Compliance** - Compliance tracking and reports
- **Reports** - Generate various reports (PDF, Excel, CSV)

## Available UI Components

### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```
Variants: `primary`, `secondary`, `danger`, `ghost`
Sizes: `sm`, `md`, `lg`

### Input
```tsx
<Input
  label="Email"
  type="email"
  error={error}
  helperText="Enter your email"
  placeholder="you@example.com"
/>
```

### Alert
```tsx
<Alert
  type="success"
  title="Success"
  message="Operation completed successfully"
  onClose={() => setAlert(null)}
/>
```
Types: `success`, `error`, `warning`, `info`

## API Integration

The frontend communicates with the backend via REST API. All API calls are made through the centralized `apiClient` which handles:

- Base URL configuration
- Request/response interceptors
- JWT token management
- Error handling

### Example Service Usage

```tsx
import { employeeService } from '@/services/api/employeeService';

const employees = await employeeService.getAll(1, 10);
const employee = await employeeService.getById('id');
await employeeService.create(employeeData);
```

## State Management

Authentication state is managed with Zustand:

```tsx
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

## Custom Hooks

### useAuth
Provides authentication state and methods:
```tsx
const { user, token, isAuthenticated, login, logout } = useAuth();
```

### useAsync
Generic async data fetching hook:
```tsx
const { data, isLoading, error, execute } = useAsync(() => fetchData());
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_AUTH_SECRET=your-generated-secret
NEXT_AUTH_URL=http://localhost:3000
```

## Styling

The project uses Tailwind CSS for styling with custom configuration for:

- Primary and secondary color schemes
- Custom spacing and sizing
- Responsive breakpoints
- Dark mode support (configured)

### Custom CSS Classes

- `.btn` - Button base styles
- `.form-input` - Input field styles
- `.form-label` - Label styles
- `.card` - Card container styles
- `.page-header`, `.page-title`, `.page-subtitle` - Page header styles

## Type Safety

All TypeScript types matching the backend API are defined in `src/types/models.ts`:

- User and authentication types
- Employee, Salary, Payroll types
- Tax and Compliance types
- API response types
- Enum values for statuses

## Next Steps

1. **Setup Backend Connection**: Ensure the backend is running on the configured API URL
2. **Create Protected Routes**: Implement route guards for authenticated pages
3. **Implement Employee Module**: Create employee list, detail, and form pages
4. **Add Data Tables**: Create reusable data table component for listings
5. **Implement Reports**: Add report generation and export functionality
6. **Testing**: Setup Jest and React Testing Library for unit and integration tests

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### API Connection Issues
- Verify backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` environment variable
- Check browser console for CORS errors
- Ensure JWT token is being sent in requests

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and formatting
4. Create a pull request

## License

This project is proprietary and confidential.
