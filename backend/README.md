# Crudo Platform - WhatsApp Sales Order Management

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-90%25-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

# **Crudo Platform**

## Overview
The **Crudo Platform** is an advanced **Order Management System** built for the **WhatsApp Sales Channel**, integrating seamlessly with **SwilERP** for inventory, billing, and fulfillment. It provides a structured and efficient way to manage orders, process payments, and track customer interactions via WhatsApp.

### Key Features
### **Authentication & Security**
- JWT & OAuth authentication with **Role-Based Access Control (RBAC)**.
- Secure token storage, rate limiting, brute-force prevention.
- **SwilERP Single Sign-On (SSO)** support.

### **Order Management & Tracking**
- **WhatsApp-based order placement** and tracking.
- Real-time **inventory syncing with SwilERP**.
- Digital prescription management with **PDF generation & secure storage**.

### **Customer Chat & Interaction**
- **Session-based chat storage** (Redis for short-term, MongoDB for long-term).
- WhatsApp API integration for **order inquiries and tracking**.
- **Automated chatbot support** for common customer queries.

### **Background Jobs & Workers**
- **Order synchronization** with SwilERP.
- **Chat session management** for returning customers.
- **Notification system** (Email/SMS/WhatsApp alerts).

### **Logging & Monitoring**
- Request logging, error tracking, authentication logs.
- **Background job monitoring** using BullMQ.
- **Database & API performance tracking**.

---

## **Tech Stack**

### **Backend**
- **Node.js with Express.js**
- **MongoDB + Mongoose ORM**
- **Redis for caching & session storage**
- **BullMQ for background jobs**
- **SwilERP & WhatsApp API integrations**

### **Frontend**
- **React.js** with **MUI + Tailwind CSS**
- **React Query** for state management
- **Axios** for API handling
- **React Hook Form + Zod** for validation

### **DevOps & Security**
- **Docker & Kubernetes (AKS)** for containerization
- **CI/CD with GitHub Actions & ArgoCD**
- **Reverse Proxy: NGINX + Traefik**
- **Monitoring: Prometheus, Grafana, Loki**
- **Security: Vault by HashiCorp, Cloudflare DDoS Protection**

---

## **Installation & Setup**
### **1. Clone the Repository**
```sh
  git clone https://github.com/excollo/Crudo-OMS.git
  cd crudo-platform
```

### **2. Install Dependencies**
```sh
  cd backend && npm install  # Backend dependencies
  cd frontend && npm install  # Frontend dependencies
```

### **3. Configure Environment Variables**
Copy `.env.example` to `.env` and update required values.
```sh
  cp .env.example .env
```

### **4. Start Development Servers**
```sh
  npm run dev  # Start backend server
  cd frontend && npm start  # Start frontend server
```

### **5. Run Background Workers**
```sh
  npm run start:order-worker  # Start order processing worker
  npm run start:chat-worker  # Start chat session worker
```

### **6. Run Tests**
```sh
  npm test
```

---

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

## **API Documentation**
Refer to [API-Specs.md](./docs/API-Specs.md) for detailed API endpoints.

### **Sample API Response**
```json
{
  "orderId": "12345",
  "status": "Processing",
  "customer": {
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

---

## **Database Schema Overview**

### **Orders Collection**
```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId",
  "items": [
    { "medicine": "Paracetamol", "quantity": 2 }
  ],
  "status": "Processing",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### **Chat Sessions Collection**
```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId",
  "messages": [
    { "text": "Do you have aspirin?", "timestamp": "ISODate" }
  ],
  "sessionActive": true
}
```

---

## **System Requirements**
- **Node.js 18+**
- **MongoDB 5.x**
- **Redis 7.x**
- **SwilERP API access**
- **WhatsApp Business API setup**
- **SMTP credentials for email notifications**

---

## **Contributing**
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with detailed changes.

---

## **License**
This project is licensed under the **MIT License**.

---

## **Contact**
- **Support Email:** support@crudoplatform.com
- **GitHub Issues:** [Report an issue](https://github.com/excollo/Crudo-OMS/issues)

