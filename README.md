# 🚗 Vehicle Rental System

![Node.js](https://img.shields.io/badge/Node.js-green) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Express](https://img.shields.io/badge/Express-lightgrey) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)

A robust **Node.js + TypeScript backend API** designed to manage vehicle rentals. It features secure authentication, role-based access control (RBAC), and full CRUD operations for users, vehicles, and booking management.

---

## 🔗 Live Links

- **🚀 Live Deployment:** [https://vehicle-rental-system-pearl-five.vercel.app/](https://vehicle-rental-system-pearl-five.vercel.app/)
- **📂 GitHub Repository:** [https://github.com/jayedalnahian/Vehicle-Rental-System](https://github.com/jayedalnahian/Vehicle-Rental-System)

---

## 📑 Table of Contents
- [Features](#-features)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#%EF%B8%8F-database-schema)
- [API Endpoints](#-api-endpoints)
- [Installation & Setup](#%EF%B8%8F-installation--setup)

---

## 📌 Features

### 👤 User Management
- **Auth:** Secure User registration & login with JWT-based authentication.
- **Roles:** Strict Role-based access control (Admin & Customer).
- **Profile:** Update user profile details.
- **Safety:** Prevents deletion of users if they have active bookings.

### 🚗 Vehicle Management
- **CRUD:** Admin can Add, Update, and Delete vehicles.
- **Inventory:** View all vehicles or specific vehicle details.
- **Availability:** Real-time availability tracking.
- **Integrity:** Prevents deletion of vehicles that are currently booked.

### 📅 Booking Management
- **Calculations:** Automatic total price calculation based on duration.
- **Views:** Admins view all bookings; Customers view only their own.
- **Actions:** Customers can cancel; Admins can mark vehicles as returned.
- **Automation:** System auto-updates vehicle availability upon booking/return.

### 🔐 Security
- **Hashing:** Password hashing using `bcrypt`.
- **Protection:** Protected routes using `jsonwebtoken`.
- **Validation:** Robust error handling and input validation standards.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|------|--------------|
| **Runtime** | Node.js |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **Auth** | bcrypt, jsonwebtoken |
| **Deployment** | Vercel |

---

## 📁 Project Structure

The project follows a **modular architecture** ensuring separation of concerns and scalability.

```bash
src
├── app.ts                  # App entry point
├── config                  # Environment and DB config
│   ├── db.ts
│   └── index.ts
├── middlewares             # Custom middlewares (Auth, Validation)
│   ├── auth
│   └── users
├── modules                 # Feature-based modules
│   ├── auth                # Authentication logic
│   ├── bookings            # Booking business logic
│   ├── users               # User management logic
│   └── vehicles            # Vehicle inventory logic
├── server.ts               # Server startup
├── types                   # TypeScript type definitions
│   ├── express
│   └── jwt.ts
└── utils                   # Utility functions (Auto-return, etc.)
```

---


## 🗄️ Database Schema

### **1. Users Table**
| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID/Int | Auto-generated PK |
| `name` | String | Required |
| `email` | String | Unique, Lowercase |
| `password` | String | Hashed |
| `role` | Enum | `admin`, `customer` |

### **2. Vehicles Table**
| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID/Int | Auto-generated PK |
| `vehicle_name` | String | Required |
| `type` | String | `Car`, `Bike`, `SUV`, `Van` |
| `registration_number`| String | Unique |
| `daily_rent_price` | Float | Positive Value |
| `availability_status`| Boolean | `true` (available), `false` (booked) |

### **3. Bookings Table**
| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID/Int | Auto-generated PK |
| `customer_id` | FK | Links to Users |
| `vehicle_id` | FK | Links to Vehicles |
| `rent_start_date` | Date | Required |
| `rent_end_date` | Date | Must be > Start Date |
| `total_price` | Float | Auto-calculated |
| `status` | Enum | `active`, `cancelled`, `returned` |

---

## 🌐 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Access | Description |
|:------:|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user |
| POST | `/api/v1/auth/signin` | Public | Login & Get Token |

### 🚗 Vehicles
| Method | Endpoint | Access | Description |
|:------:|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin | Create a new vehicle |
| GET | `/api/v1/vehicles` | Public | List all vehicles |
| GET | `/api/v1/vehicles/:id` | Public | Get single vehicle details |
| PUT | `/api/v1/vehicles/:id` | Admin | Update vehicle info |
| DELETE | `/api/v1/vehicles/:id` | Admin | Delete vehicle (Soft/Hard) |

### 👥 Users
| Method | Endpoint | Access | Description |
|:------:|----------|--------|-------------|
| GET | `/api/v1/users` | Admin | List all users |
| PUT | `/api/v1/users/:id` | Admin/Own | Update profile or role |
| DELETE | `/api/v1/users/:id` | Admin | Delete user |

### 📅 Bookings
| Method | Endpoint | Access | Description |
|:------:|----------|--------|-------------|
| POST | `/api/v1/bookings` | Auth | Create a booking |
| GET | `/api/v1/bookings` | Auth | View bookings (Role based) |
| PUT | `/api/v1/bookings/:id` | Auth | Cancel (User) or Return (Admin) |

---

## 🛠️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/jayedalnahian/Vehicle-Rental-System](https://github.com/jayedalnahian/Vehicle-Rental-System)
cd Vehicle-Rental-System

```

## 🚀 Install Dependencies

```bash
npm install
```
⚙️ Environment Configuration

Create a .env file in the root directory and add your credentials:

```bash
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_rental_system
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```


## 🗄️ Database Setup

Ensure PostgreSQL is running. Create the database and run migrations (if using Prisma/Sequelize) or create tables manually.

CREATE DATABASE vehicle_rental_system;

## ▶️ Run the Server
Development Mode
```bash
npm run dev
```


Production Build
```bash
npm run build
npm start
```


The server will run at:
👉 http://localhost:5000



## 🧪 Testing

You can test the API using:

Postman

Thunder Client

Insomnia

🔐 Authenticated Routes

Add the JWT token to the headers:

Authorization: Bearer <your_token_here>