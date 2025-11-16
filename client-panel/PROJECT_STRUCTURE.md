# LINKSY - Project Structure

## Overview
LINKSY is a comprehensive communication platform built with React, TypeScript, and Tailwind CSS.

## Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4 with PostCSS & Autoprefixer
- **Routing**: React Router DOM 6
- **Icons**: Lucide React & React Icons
- **Animations**: Framer Motion
- **Package Manager**: npm (pnpm removed)

## Project Structure

```
LINKSY/
├── src/
│   ├── components/           # Reusable components organized by feature
│   │   ├── api/             # API documentation & management (4 files)
│   │   ├── common/          # Shared UI components (1 file)
│   │   ├── configuration/   # Configuration components (1 file)
│   │   ├── contacts/        # Contact management (2 files)
│   │   ├── domains/         # Domain management (2 files)
│   │   ├── facturation/     # Billing & payments (13 files)
│   │   │   └── components/  # Payment flow components (11 files)
│   │   ├── helpdesk/        # Support ticket system (4 files)
│   │   ├── hosting/         # Hosting management (1 file)
│   │   ├── invoice/         # Invoice handling (1 file)
│   │   ├── navigation/      # Navigation components (5 files)
│   │   ├── reports/         # Reports & analytics (1 file)
│   │   ├── sms/             # SMS campaign management (5 files)
│   │   │   └── utils/       # SMS utilities (1 file)
│   │   └── ui/              # Generic UI components (7 files)
│   │
│   ├── pages/               # Page-level components (11 files)
│   │   ├── Domains/         # Domain management pages (1 file)
│   │   ├── Facturation/     # Billing pages (1 file)
│   │   └── Hosting/         # Hosting pages (1 file)
│   │
│   ├── hooks/               # Custom React hooks (1 file)
│   ├── types/               # TypeScript type definitions (1 file)
│   ├── utils/               # Utility functions (3 files)
│   │
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles with Tailwind directives
│   └── vite-env.d.ts        # Vite TypeScript declarations
│
├── public/                  # Static assets (if needed)
│
├── index.html               # HTML entry point
├── package.json             # Project dependencies & scripts
├── package-lock.json        # npm lock file
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration (required by Tailwind)
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node-specific TypeScript config
├── eslint.config.js         # ESLint configuration
├── .gitignore               # Git ignore patterns
└── README.md                # Project documentation

```

## Key Features

### Authentication & Registration
- Multi-step registration with email/phone verification
- OTP verification system
- Login with remember me functionality
- Password reset flow

### Core Services
1. **SMS Pro**: Campaign creation, contact management, message preview
2. **Email Marketing**: Campaign management and analytics
3. **Domain Management**: Registration, DNS, and renewal
4. **Hosting Services**: Server and hosting control panel
5. **Contact Management**: Import/export, CSV handling
6. **API Access**: Comprehensive API documentation and management
7. **Help Desk**: Ticket creation and management
8. **Billing System**: Subscriptions, payments, invoicing

### UI Components
- **Navigation**: Responsive navbar with dynamic routes
- **Forms**: Validated form fields with error handling
- **Modals**: Reusable modal system
- **Loading States**: Spinner and loading button components
- **Status Indicators**: Badges for various states
- **Empty States**: Placeholder components
- **Search**: Debounced search inputs

## Build & Development

### Available Scripts
```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Build Output
- **index.html**: ~0.74 kB
- **CSS Bundle**: ~75.48 kB (11.09 kB gzipped)
- **JS Bundle**: ~598.20 kB (145.70 kB gzipped)

## Code Organization Principles

### Component Structure
- Feature-based organization (domain-driven)
- Reusable UI components in `components/ui/`
- Page-level components in `pages/`
- Shared utilities in `utils/`

### Naming Conventions
- **Components**: PascalCase (e.g., `DomainTable.tsx`)
- **Utilities**: camelCase (e.g., `mockDomainData.ts`)
- **Types**: PascalCase interfaces/types (e.g., `DomainEntry`)
- **Hooks**: camelCase with `use` prefix (e.g., `useNotifications.ts`)

### State Management
- Local component state with useState
- Context API for global state (when needed)
- Custom hooks for reusable logic

## Styling

### Tailwind Configuration
- Primary color: `#DC0032` (primary-red)
- Font family: Heebo with fallbacks
- Custom utilities and components in `index.css`
- Responsive breakpoints: sm, md, lg, xl, 2xl

### Custom CSS Classes
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.card`, `.card-header`
- `.table` with styled th/td
- `.form-input`, `.form-select`
- Animation utilities: `.animate-fade-in`, `.animate-slide-in`

## Type Safety
- Strict TypeScript configuration
- Type definitions in `src/types/`
- Interface definitions co-located with components when specific

## Browser Support
- Modern browsers (ES6+)
- Autoprefixer for CSS compatibility
- Browserslist configuration up-to-date

## Clean Code Practices
✅ No empty folders
✅ No temporary files
✅ No unused dependencies
✅ Organized by feature
✅ Consistent naming conventions
✅ Type-safe with TypeScript
✅ Comprehensive .gitignore

## Removed During Cleanup
- ❌ `pnpm-lock.yaml` (switched to npm only)
- ❌ `src/components/auth/` (empty folder)
- ❌ `src/tmp_rovodev_test_logo.tsx` (temporary test file)
- ❌ `acli.exe` (attempted removal, permission denied)

## Notes
- PostCSS is **required** by Tailwind CSS for processing `@tailwind` and `@apply` directives
- All mock data is intentionally kept for development purposes
- Project successfully builds without errors
- All dependencies are up-to-date
