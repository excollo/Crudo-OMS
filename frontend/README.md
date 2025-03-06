# Order Management System (OMS)

## Overview
The Order Management System (OMS) is a web-based platform that streamlines pharmacy orders via WhatsApp Sales Channel, integrating with SwilERP for inventory, billing, and fulfillment. It provides centralized order management, data security, analytics, and user efficiency.

## Features
- **User Authentication** (Login, Registration, Role-based Access)
- **Order Management** (Create, Update, Track Orders)
- **Digital Prescription Upload & Processing**
- **Analytics & Reporting** (Order Stats, Sales Reports, Inventory Insights)
- **Audit Logs & Data Security**
- **User Roles & Permissions** (Pharmacist, Administrator)
- **Integration with SwilERP** for real-time data sync

## Folder Structure
```
oms-frontend/
│── public/                      # Static assets
│── src/
│   ├── components/               # Reusable UI components
│   │    ├──Auth-component/
│   │    ├──Logo-component/
│   │    ├──Theme/
│   ├── hooks/                    # Custom React hooks
│   ├── pages/                     # Pages
│   │	 ├──Auth/
│   │    ├──Audit/
│   │    ├──Dashboard/
│   │    ├──Orders/
│   │    ├──Prescriptions/
│   │    ├──Reports/
│   │    ├──Settings/
│   │    ├──Users/
│   ├── services/                  # API service calls
│   ├── store/                     # Redux state management
│   ├── utils/                      # Utility functions
│   ├── App.jsx
│   ├── main.jsx
│   ├── router.js                   # React Router setup
│── .env                             # Environment variables
│── package.json
│── vite.config.js
│── README.md

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
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the project:
```sh
npm run dev
```

## API Routes
### 1. Authentication & User Management
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Log out
- `POST /api/auth/register` - Register new user (Admin only)
- `POST /api/auth/refresh-token` - Refresh authentication token

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

## License
MIT License
