# QuickDine - QR-based Restaurant Ordering System

A modern restaurant ordering system that allows customers to place orders via QR codes and restaurants to manage orders in real-time.

---

## 🚀 Features
- QR code-based menu access
- Real-time order tracking
- Admin dashboard for order management
- Menu management system
- Real-time notifications using Pusher
- Role-based access control (SUPER_ADMIN, RESTAURANT_OWNER, RESTAURANT_ADMIN, STAFF)
- Analytics dashboard with sales and order metrics
- Multi-restaurant support

## 🧰 Tech Stack
### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- tRPC
- React Hook Form + Zod
- ShadCN UI
- Context API for state management
- JWT-based authentication

### Backend
- Express.js
- tRPC
- Prisma
- PostgreSQL
- Pusher for real-time updates
- JWT for authentication
- bcrypt for password hashing
- Zod for input validation

---

## 💻 Technical Requirements
### System Requirements
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- NPM (v8 or higher)
- Git

### Environment Variables
#### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quickdine?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"


#### Frontend (.env.local)
```env
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

---

## ⚙️ Setup Instructions
### Clone the repository:
```bash
git clone <repository-url>
cd quickdine
```

### Set up the frontend:
```bash
cd frontend
npm install
```

### Set up the backend:
```bash
cd ../backend
npm install
```

### Set up environment variables as specified above

### Initialize the database:
```bash
cd backend
npx prisma migrate dev
```

### Start the development servers:
#### Frontend:
```bash
cd frontend
npm run dev
```

#### Backend:
```bash
cd backend
npm run dev
```

---

## 🗂 Project Structure
```plaintext
quickdine/
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   └── components/# React components
│   │   └── lib/       # Utility functions
│   └── public/        # Static assets
└── backend/           # Express.js backend server
    ├── src/
    │   ├── trpc/     # tRPC router and context
    │   └── server.ts # Main server file
    └── prisma/       # Database schema and migrations
```

---
### Environment Variables
#### Backend (.env)
```env
DATABASE_URL="postgresql://
postgres:postgres@localhost:5432/quickdine?
schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key
"
``` Frontend (.env.local)
```
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster
"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```


### 📡 API Endpoints
### Authentication
- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh - Refresh access token
- PATCH /api/auth/users/:id - Update user profile
### Restaurant Management
- GET /api/restaurants/menu - Get restaurant menu (customer view)
- GET /api/restaurants/admin-menu/:restaurantId - Get restaurant menu (admin view)
- POST /api/restaurants/:restaurantId/menu - Create menu item
- PATCH /api/restaurants/:restaurantId/menu/:id - Update menu item
- DELETE /api/restaurants/:restaurantId/menu/:id - Delete menu item
- POST /api/restaurants/user/:userId/restaurant - Create restaurant
- GET /api/restaurants/user/:userId/restaurant/:restaurantId - Get restaurant details
- PATCH /api/restaurants/user/:userId/restaurant/:restaurantId - Update restaurant
### Order Management
- POST /api/orders - Create new order
- GET /api/orders/restaurant/:restaurantId - Get restaurant orders
- GET /api/orders/:id - Get specific order
- PATCH /api/orders/:id/status - Update order status
### Analytics
- GET /api/analytics/:restaurantId - Get restaurant analytics

---


🏗 Frontend Structure
Core Components
AdminNavbar - Navigation for admin dashboard
CartDrawer - Shopping cart sidebar
CheckoutForm - Order payment form
MenuCard - Menu item display
OrderRow - Order list item
StatusBadge - Order status indicator
Context Providers
AuthProvider - Authentication state and methods
CartProvider - Shopping cart state management
PusherProvider - Real-time updates configuration
Custom Hooks
useAuth - Authentication utilities
useCart - Cart management
useMenu - Menu operations
useOrders - Order management
useAnalytics - Analytics data fetching
usePusher - Real-time updates



🗃 Database Schema
Core Models
Restaurant - Restaurant details and relationships
User - User authentication and profile
MenuItem - Menu items with categories
Order - Order tracking and details
Table - Table management with QR codes
Session - Authentication session management



Enums
UserRole - User access levels
OrderStatus - Order progress tracking
PaymentStatus - Payment state tracking
TableStatus - Table availability status
MenuCategory - Menu item categorization




## ⚙️ Setup Instructions
[Previous setup instructions remain the same...]

## 🔒 Authentication Flow
1. User registers/logs in via /api/auth/login or /api/auth/signup
2. Server validates credentials and returns access & refresh tokens
3. Frontend stores tokens in localStorage
4. Access token used for API requests (15-minute expiry)
5. Refresh token used to obtain new access tokens (7-day expiry)
6. AuthContext manages token refresh and user state

## 🔄 Real-time Updates
- Pusher channels used for order notifications
- Restaurant-specific channels ( restaurant-${restaurantId} )
- Events: new-order , order-status-updated
- PusherContext manages subscriptions and event handling

## 🛡️ Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- Role-based access control
- Input validation with Zod
- SQL injection prevention with Prisma

## 🔒 Security Measures
- Input validation using Zod
- SQL injection protection via Prisma
- XSS protection
- Rate limiting on all endpoints
- CORS configuration for specified origins
- Secure session management

---

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

