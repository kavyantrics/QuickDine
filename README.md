# QuickDine - QR-based Restaurant Ordering System

A modern restaurant ordering system that allows customers to place orders via QR codes and restaurants to manage orders in real-time.

---

## 🚀 Features
- QR code-based menu access
- Real-time order tracking
- Admin dashboard for order management
- Menu management system
- Real-time notifications using Pusher

## 🧰 Tech Stack
### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- tRPC
- React Hook Form + Zod
- ShadCN UI

### Backend
- Express.js
- tRPC
- Prisma
- PostgreSQL
- Pusher for real-time updates

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
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
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

## 📡 API Documentation
### Authentication
- All admin routes require JWT authentication
- Rate limit: 100 requests per 15 minutes

### Endpoints
#### Public Endpoints
- **getMenuItems** (GET) → Fetch available menu items
- **createOrder** (POST) → Submit new order

#### Protected Endpoints (Admin Only)
- **getOrders** (GET) → Fetch all orders
- **updateOrderStatus** (PATCH) → Update order status

---

## 🔒 Security Measures
- Input validation using Zod
- SQL injection protection via Prisma
- XSS protection
- Rate limiting on all endpoints
- CORS configuration for specified origins
- Secure session management

---

## 🧪 Testing Strategy
### Frontend Testing
- Unit tests: Jest + React Testing Library
- E2E tests: Cypress
- Component testing: Storybook

### Backend Testing
- Unit tests: Jest
- Integration tests: Supertest
- API tests: Postman collection

### Test Coverage Goals
- Frontend: 80% coverage
- Backend: 90% coverage

---

## 📈 Monitoring & Logging
### Error Tracking
- Sentry integration for error monitoring
- Custom error boundaries in React

### Performance Monitoring
- Next.js Analytics
- Custom performance metrics tracking
- API response time monitoring

### Logging
- Winston for backend logging
- Log rotation setup
- Structured logging format

---

## 🧰 Backup & Recovery
### Database Backup
- Daily automated backups
- Point-in-time recovery capability
- 30-day backup retention

### Recovery Procedures
- Database restore from backup
- Environment configuration backup
- Application state recovery

---

## 🧭 Future Roadmap
### Phase 1 (Next 3 months)
- Analytics dashboard
- Customer feedback system
- Kitchen display system
- Mobile app version

### Phase 2 (6 months)
- Multi-restaurant support
- POS system integration
- Inventory management
- Staff management

### Phase 3 (12 months)
- AI-powered demand prediction
- Loyalty program
- Advanced analytics
- Multi-language support

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

