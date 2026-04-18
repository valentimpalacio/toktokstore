// .prettierignore
node_modules
dist
build
coverage
\*.log
.env
.env.local
.DS_Store

// .gitignore (supplemental additions)
\*.tsbuildinfo
next.config.js
types/

// AGENTS.md - Project configuration for future sessions

# ToktokStore E-Commerce Project

## Tech Stack

- Frontend: React 18 + TypeScript + Vite + Framer Motion
- Backend: Express.js + Prisma ORM + PostgreSQL
- Authentication: JWT + Passport.js (Google OAuth)
- Testing: Jest + React Testing Library + Vitest
- Logging: Winston
- Security: Helmet, express-rate-limit, CORS

## Project Structure

- client/ - React frontend
- server/ - Express backend with Prisma ORM
- Shared documentation in ARCHITECTURE.md

## Running the Project

- Install: npm install (root), cd client && npm install, cd server && npm install
- Dev: npm run dev (root)
- Test: npm run test (root)
- Build: npm run build (root)

## Testing

- Unit tests: client/**tests**/
- Integration tests: server/test/
- Coverage: npm run test:ci

## Key Features

- JWT authentication with Google OAuth
- Product catalog with categories
- Shopping cart functionality
- Admin dashboard for product management
- Rate limiting and security headers
- Responsive design with animations
