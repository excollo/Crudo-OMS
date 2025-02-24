# Crudo Platform Backend

## 📌 Project Overview
Crudo Platform Backend is a **Node.js & Express** powered API that provides authentication, order management, and integration with SwilERP. It follows a modular architecture for scalability and maintainability.

---

## 🏗️ Tech Stack
- **Backend Framework**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Validation**: express-validator, Joi
- **Logging & Monitoring**: Winston, Morgan
- **Security**: Helmet, CORS, express-rate-limit

---

## 📂 Folder Structure
```
crudo-backend/
├── src/
│   ├── config/            # Configurations (env, database, logging)
│   │   ├── db.js
│   │   ├── logger.js
│   │   ├── env.js
│   ├── controllers/       # Handle HTTP requests
│   │   ├── authController.js
│   │   ├── orderController.js
│   ├── middleware/        # Authentication, logging, validation
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Order.js
│   ├── routes/            # Define API routes
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   ├── services/          # Business logic
│   │   ├── authService.js
│   │   ├── orderService.js
│   ├── utils/             # Utility functions
│   │   ├── generateToken.js
│   ├── workers/             # Background jobs, queues
│   │   ├── 
│   ├── app.js             # Express app setup
│   ├── server.js          # Server entry point
├── .env                   # Environment variables
├── .gitignore             # Ignore node_modules, .env, etc.
├── package.json
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/excollo/Crudo-OMS.git
cd backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Start the Server
```sh
npm start
```
Or for development mode with auto-restart:
```sh
npm run dev
```

---

## 🔑 Authentication (JWT Based)
| Endpoint       | Method | Description |
|--------------|--------|------------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |

### 🔐 **Protected Routes**
All routes that require authentication must include an `Authorization: Bearer <token>` header.

---

## 📦 Order Management
| Endpoint       | Method | Description |
|--------------|--------|------------------|
| `/api/orders/` | POST | Create an order (Protected) |
| `/api/orders/:id` | GET | Get order details (Protected) |

---

## 🔍 Logging & Error Handling
- **Winston & Morgan** used for logging API requests.
- Centralized **error handling middleware** for structured error responses.

---

## 🛡️ Security Best Practices Implemented
✅ **Helmet** for setting security-related HTTP headers.  
✅ **CORS** enabled for cross-origin resource sharing.  
✅ **Rate Limiting** to prevent brute force attacks.  
✅ **Input Validation** using express-validator.  

---

## 🛠️ Development Tools & Scripts
| Command | Description |
|--------------|------------------|
| `npm run dev` | Start development server with Nodemon |
| `npm start` | Start production server |
| `npm test` | Run tests |

---

## 📢 Future Enhancements
- **RBAC (Role-Based Access Control)** for user permissions
- **SwilERP Integration** for seamless order management

---

## 📄 License
This project is licensed under the **MIT License**.

---

## 👨‍💻 Author


