# Crudo OMS Backend

## Overview
Crudo Order Management System (OMS) Backend is a service that integrates with SwilERP for pharmacy order management, authentication, and inventory tracking.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/Pharmacist)
- Two-factor authentication support
- Password reset functionality

### 📦 Order Management
- Create and track orders
- SwilERP integration for inventory sync
- Order status tracking
- Real-time pricing calculations

### 📊 Inventory Management
- Product listing and details
- Real-time stock updates
- SwilERP inventory sync

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT & bcrypt
- **Email**: Nodemailer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Integration**: SwilERP API

## Prerequisites
- Node.js 18+
- MongoDB 5.x
- SMTP server access
- SwilERP API credentials

## **Folder Structure**

```
crudo-platform/
│-- backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── workers/
│   │   ├── utils/
│   │   ├── logs/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── sanitization/
│   │   ├── app.js
│   ├── package.json
│   ├── server.js
│-- frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   ├── package.json
│-- deploy/
│   ├── k8s/
│   ├── terraform/
│-- docs/
│   ├── API-Specs.md
│-- README.md
```

---


## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file and add the following configuration:

```ini
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# MongoDB Configuration
MONGO_URI=mongodb://root:rootpassword@localhost:27017/crudo_db?authSource=admin
MONGO_DB_NAME=crudo_db

# Authentication Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# SwilERP Configuration
SWILERP_BASE_URL=https://api-test.swilerp.com/erp/v1/
SWIL_API_KEY=your_swil_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## API Routes

### 🔑 Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-2fa` - Verify 2FA code

### 📦 Orders
- `POST /api/order/create-order` - Create new order
- `GET /api/order/orders` - Get all orders
- `GET /api/order/orders/:orderId` - Get order by ID

### 📊 Inventory
- `GET /api/inventory/products` - Get product list
- `GET /api/inventory/products/:id` - Get product by ID

## 🛡️ Security Features
- CORS protection
- Rate limiting
- Helmet security headers
- Request sanitization
- XSS protection
- MongoDB injection prevention

## ⚠️ Error Handling
The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error information"]
}
```

## 📜 Logging
- Request logging with Winston
- Authentication activity logging
- Error logging with stack traces

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License.

---

This README provides a structured overview of your backend setup, including installation instructions, environment configuration, API routes, and security features. Let me know if you'd like any modifications!

