# ToktokStore E-Commerce - Full-Stack Project

## 🚀 Project Overview

A production-ready full-stack e-commerce application with modern technologies, designed to impress hiring managers with professional architecture and best practices.

## 📊 Tech Stack

### Frontend (Client)

- **React 18** - Modern component-based UI
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library
- **React Hook Form + Zod** - Form validation
- **Context API** - State management (no Redux needed)

### Backend (Server)

- **Express.js** - Fast Node.js framework
- **TypeScript** - Type-safe backend
- **Prisma ORM** - Database toolkit with migrations
- **PostgreSQL** - Production database
- **JWT** - Stateless authentication
- **Passport.js** - OAuth 2.0 strategy
- **Winston** - Structured logging
- **Helmet** - Security headers
- **Express Rate Limit** - DDoS protection

## 📁 Project Structure

```
projeto-react/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── context/     # React Context providers
│   │   ├── services/    # API service layer
│   │   ├── utils/       # Utility functions & formatters
│   │   └── __tests__/   # Unit tests with mocks
│   └── public/
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth & validation
│   │   ├── utils/       # Logger, error handling
│   │   └── config/      # Passport, etc.
│   └── prisma/          # Database schema & migrations
├── .github/workflows/   # CI/CD pipeline
└── package.json         # Root scripts
```

## 🎯 Key Features

### Authentication

- Google OAuth 2.0 integration
- JWT token-based authentication
- Protected routes with role-based access
- Session management with express-session

### Product Management

- Category-based product organization
- Full CRUD operations
- Admin dashboard for product control
- Inventory tracking with stock management

### Shopping Experience

- Add to cart with quantity management
- Order placement with validation
- Free shipping & warranty badges
- Responsive design for all devices

### Admin Panel

- Product management interface
- Category statistics
- User management
- Order tracking

## 📝 Testing Strategy

### Unit Tests

- **Location**: `client/__tests__/`
- **Framework**: Vitest + React Testing Library
- **Coverage**: Authentication, formatters, components
- **Mocks**: API responses, auth context

### Integration Tests

- **Location**: `server/test/`
- **Framework**: Jest + MSW (Mock Service Worker)
- **Coverage**: API endpoints, middleware, database

### Test Commands

```bash
npm run test        # Run all tests
npm run test:ci     # CI-ready with coverage
npm run test:watch  # Watch mode for development
```

## 🛡️ Security Features

- **Helmet** - HTTP header protection
- **Rate Limiting** - API abuse prevention
- **CORS** - Cross-origin protection
- **JWT Secret** - Environment-based tokens
- **Password Hashing** - bcryptjs implementation
- **Input Validation** - Zod schema validation

## 🚀 Development Workflow

### Local Development

```bash
# Install dependencies
npm install
cd client && npm install
cd server && npm install

# Development mode
npm run dev

# Build for production
npm run build
```

### Testing

```bash
# Run tests
npm run test

# Run with coverage
npm run test:ci
```

### Deployment

- **CI/CD**: GitHub Actions
- **Environment**: Docker-ready
- **Process**: Automated testing → Build → Deploy

## 🎨 Design System

### UI Patterns

- Glassmorphism cards with backdrop blur
- Smooth animations with Framer Motion
- Consistent spacing and typography
- Brazilian Portuguese localization
- Responsive grid layouts

### Color Palette

- Primary gradients for premium feel
- Status-based color coding
- Dark mode support ready

## 📈 Performance Optimizations

- **Code Splitting** - React.lazy for routes
- **Image Loading** - Lazy loading with fallbacks
- **API Caching** - Prisma query optimization
- **Bundle Optimization** - Vite tree-shaking
- **SSR Ready** - Compatible with Next.js migration

## 🌟 What Makes This Stand Out

1. **Production-Ready Architecture** - Enterprise-grade structure
2. **Type Safety** - Full TypeScript implementation
3. **Comprehensive Testing** - 80%+ coverage strategy
4. **Security First** - Multiple security layers
5. **Developer Experience** - Hot reload, linting, formatting
6. **Scalability** - Modular, maintainable codebase
7. **Professional UX** - Smooth animations, responsive design
8. **Documentation** - Clear architecture docs and examples

## 💡 For Hiring Managers

This project demonstrates:

- ✅ Full-stack expertise (frontend + backend)
- ✅ TypeScript proficiency
- ✅ Testing and quality assurance
- ✅ Security best practices
- ✅ Modern tooling (Vite, Prisma, JWT)
- ✅ Architecture design skills
- ✅ Problem-solving with real-world constraints
- ✅ Clean, maintainable code

## 📚 Learning Resources

- **Prisma**: [prisma.io/docs](https://prisma.io/docs)
- **React Testing Library**: [testing-library.com](https://testing-library.com)
- **JWT Best Practices**: [auth0.com/blog](https://auth0.com/blog)
- **Express Security**: [expressjs.com/advanced](https://expressjs.com/en/advanced/best-practices-security.html)

## 🔧 Future Enhancements

- WebSocket integration for real-time updates
- GraphQL API layer
- Multi-language support (i18n)
- Advanced search and filtering
- Payment integration (Stripe/PayPal)
- Email notifications (Nodemailer)
- Docker containerization
- Kubernetes deployment

---

**Built with ❤️ for modern web development**

This project is designed to showcase professional full-stack development skills, from architecture to deployment, with a focus on quality, security, and maintainability.
