# PeopleNotes - Technical Interview Project

A full-stack application for managing contacts and notes, built with modern web technologies. This project is designed to assess various technical skills including code reading, architecture planning, database design, security awareness, and clean code principles.

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui components with Radix UI primitives
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod schemas
- **Authentication**: Simple cookie-based auth with bcrypt
- **Testing**: Jest with React Testing Library
- **External API**: PokeAPI integration

## 📋 Features

- **Authentication System**: Register/login with email and password
- **People Management**: Add, view, edit, and delete contacts
- **Notes System**: Add multiple notes per person
- **Pokemon Integration**: Search and assign favorite Pokemon to contacts
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Client and server-side validation with Zod
- **Database Relations**: Proper foreign key relationships

## 🛠 Local Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Clone and navigate to the project**

   ```bash
   cd via-kiro
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Create and migrate database
   npm run db:push

   # Seed with demo data
   npm run db:seed
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3333](http://localhost:3333)

### Demo Credentials

After seeding, you can log in with:

- **Email**: demo@example.com
- **Password**: password123

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 Database Schema

The application uses three main models:

- **User**: Authentication and user management
- **Person**: Contact information with optional Pokemon preference
- **Note**: Multiple notes per person with title and content

View the complete schema in `prisma/schema.prisma`.

## 🔍 Assessment Areas

This codebase is designed to evaluate:

### 1. Code Reading & Troubleshooting

- Mixed coding patterns and styles
- Some intentional issues to identify
- AI-generated code patterns

### 2. Architecture & Planning

- API route organization
- Component structure decisions
- Database relationship design

### 3. Security Awareness

- Authentication implementation
- Input validation patterns
- Potential OWASP vulnerabilities

### 4. Clean Code Principles

- Component organization
- Function decomposition opportunities
- Code reusability patterns

### 5. Database Design

- Schema normalization
- Relationship modeling
- Query optimization opportunities

## 🎯 Interview Discussion Points

### Potential Improvements

- Authentication could use JWT tokens or NextAuth.js
- Error handling could be more comprehensive
- Loading states and user feedback
- API rate limiting and caching
- Database indexing optimization
- Component prop validation with PropTypes
- Better separation of concerns

### Security Considerations

- Password hashing implementation
- SQL injection prevention
- XSS protection in user inputs
- CSRF protection
- Input sanitization

### Architecture Decisions

- Monolith vs microservices trade-offs
- Client-side vs server-side rendering
- State management approaches
- API design patterns

## 📁 Project Structure

```
via-kiro/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   └── ui/               # Shadcn UI components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── __tests__/            # Test files
└── package.json          # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo data

## 🐛 Known Issues (Intentional)

Some issues are intentionally included for assessment purposes:

1. Basic authentication without proper session management
2. Missing error boundaries in React components
3. No API rate limiting
4. Potential N+1 query issues
5. Missing input sanitization in some areas
6. No proper logging system
7. Hardcoded configuration values

## 📝 Notes for Interviewers

This project provides multiple discussion points around:

- Code quality and maintainability
- Security best practices
- Performance optimization
- User experience improvements
- Testing strategies
- Deployment considerations

The intentional issues and improvement opportunities make it ideal for assessing a candidate's ability to identify problems and propose solutions.
