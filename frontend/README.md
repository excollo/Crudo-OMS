# Order Management System (OMS)

## Overview
The Order Management System (OMS) is a web-based platform that streamlines pharmacy orders via WhatsApp Sales Channel, integrating with SwilERP for inventory, billing, and fulfillment. It provides centralized order management, data security, analytics, and user efficiency.

## Key Features
- **User Authentication** (Login, Registration, Role-based Access)
- **Digital Prescription Upload & Processing**
- **Audit Logs & Data Security**
- **User Roles & Permissions** (Pharmacist, Administrator)
- **Enhanced Security**
  - Two-Factor Authentication (2FA)
  - JWT-based Authentication
  - Role-based Access Control
- **Order Management**
  - WhatsApp Order Processing
  - Digital Prescription Handling
  - Order Tracking & Updates
- **Analytics & Reports**
  - Sales Performance Metrics
  - Inventory Insights
  - Compliance Reports
- **System Integration**
  - SwilERP Integration
  - Real-time Data Sync
  - Automated Notifications


## Tech Stack
- React
- Redux Toolkit
- Material-UI (MUI)
- Axios
- Vite

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth-Component/       # Authentication components
│   │   ├── HomeComponents/       # Dashboard & home components
│   │   ├── Logo-component/       # Brand & logo components
│   │   ├── NotificationComponents/
│   │   ├── orderPageCompoents/   # Order management UI
│   │   └── Theme/               # MUI theme customization
│   ├── hooks/                   # Custom React hooks
│   ├── pages/
│   │   ├── Auth/               # Login, Register, 2FA pages
│   │   ├── Dashboard/          # Main dashboard
│   │   ├── Orders/            # Order management
│   │   ├── Reports/           # Analytics & reporting
│   │   └── Settings/          # User & system settings
│   ├── redux/
│   │   └── slices/            # Redux toolkit slices
│   ├── services/              # API service integration
│   ├── store/                 # Redux store configuration
│   └── utils/                 # Helper functions
├── public/                    # Static assets
└── vite.config.js            # Vite configuration
```

## Installation & Setup
Clone the repository:
```sh
git clone https://github.com/excollo/Crudo-OMS.git
cd oms-frontend
```

Install dependencies:
```sh
npm install
```

Create an `.env` file and configure environment variables:
```sh
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME="Crudo OMS"
```

Run the project:
```sh
npm run dev
```
## Authentication Flow
1. **Login**: Email/Password authentication
2. **2FA Setup**: Optional two-factor authentication setup
3. **2FA Verification**: 6-digit OTP verification when enabled
4. **Token Management**: JWT-based session management

## API Routes
### 1. Authentication & User Management
- `POST /api/auth/signin` - User login
- `POST /api/auth/logout` - Log out
- `POST /api/auth/signup` - Register new user (Admin only)
- `POST /api/auth/refresh-token` - Refresh authentication token
- `POST /api/auth/send-otp` - Send 2FA verification code
- `POST /api/auth/verify-otp` - Verify 2FA code
- `POST /api/auth/enable-2fa` - Enable two-factor auth
- `POST /api/auth/disable-2fa` - Disable two-factor auth

### 2. Orders Management
- `GET /api/orders` - Fetch all orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Fetch a specific order
- `PUT /api/orders/:id` - Update order details
- `DELETE /api/orders/:id` - Delete an order

### 3. Digital Prescription Management
- `POST /api/prescriptions/upload` - Upload prescription image
- `GET /api/prescriptions/:orderId` - Get prescriptions linked to an order
- `GET /api/prescriptions/pdf/:id` - Generate PDF of a prescription

### 4. Dashboard
- `GET /api/dashboard/overview` - Fetch dashboard summary
- `GET /api/dashboard/recent-orders` - Fetch recent orders
- `GET /api/dashboard/notifications` - Fetch notifications
- `GET /api/dashboard/stats` - Fetch performance metrics

### 5. Analytics & Reporting
- `GET /api/reports/orders` - Fetch order analytics
- `GET /api/reports/sales` - Fetch sales reports
- `GET /api/reports/inventory` - Fetch inventory insights
- `GET /api/reports/customers` - Fetch customer behavior insights
- `GET /api/reports/compliance` - Fetch compliance and audit logs

### 6. System Configuration & Security
- `GET /api/audit/logs` - Fetch all audit logs
- `GET /api/audit/logs/:id` - Fetch specific log details
- `GET /api/settings` - Fetch system settings
- `PUT /api/settings` - Update system configurations

### 7. User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/security` - Update security settings


## User Roles
- **Pharmacist**: Create, update, and track orders
- **Administrator**: Full access to analytics, data exports, and user management

## Tech Stack
- **Frontend**: React, Redux, MUI, Axios
- **Backend**: Node.js, Express, MongoDB/SQL (SwilERP Integration)
- **Security**: JWT Authentication, Role-based Access, OWASP Guidelines

## Contributing
1. Fork the repository
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```sh
   git push origin feature-branch
   ```
5. Create a Pull Request

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run test     # Run tests
```

## License
MIT License
