# LINKSY

## Features
LINKSY is a comprehensive communication platform that provides SMS marketing, email campaigns, hosting services, and domain management solutions.
- **SMS Pro**: Send targeted SMS campaigns with delivery tracking
- **Email Marketing**: Create and manage email campaigns
- **Hosting Management**: Manage web hosting services and server configurations
- **Domain Management**: Register and manage domain names
- **Contact Management**: Organize and import contact lists
- **API Access**: Programmatic access to all services
- **OTP Services**: One-time password generation and verification
- **Help Desk**: Integrated support ticket system
- **Billing & Payments**: Comprehensive billing management
## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm
## Getting Started
### Prerequisites
- Node.js 18+ 
- npm (recommended package manager)

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd linksy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```
The optimized production build will be output to the `dist/` directory.
## Project Structure
```
src/
├── components/          # Feature-based components
│   ├── api/            # API documentation & management
│   ├── common/         # Shared components
│   ├── configuration/  # Configuration UI
│   ├── contacts/       # Contact management
│   ├── domains/        # Domain management
│   ├── facturation/    # Billing & payments
│   ├── helpdesk/       # Support tickets
│   ├── hosting/        # Hosting management
│   ├── navigation/     # Navigation components
│   ├── sms/            # SMS campaigns
│   └── ui/             # Generic UI components
├── pages/              # Page-level components
│   ├── Domains/        # Domain pages
│   ├── Facturation/    # Billing pages
│   └── Hosting/        # Hosting pages
├── hooks/              # Custom React hooks
├── utils/              # Utility functions & helpers
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind

See PROJECT_STRUCTURE.md for detailed documentation.
```
## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
## Key Components
### UI Components
- **LoadingButton**: Button with loading state
- **Modal**: Reusable modal component
- **FormField**: Form field with validation
- **StatusBadge**: Status indicator component
- **SearchInput**: Search input with clear functionality
- **EmptyState**: Empty state placeholder
### Services
- **SMS Interface**: Campaign creation and management
- **Contact Management**: Import/export and organization
- **Domain Management**: Registration and DNS management
- **Hosting Control**: Server and hosting management
## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
## License
This project is proprietary software. All rights reserved.