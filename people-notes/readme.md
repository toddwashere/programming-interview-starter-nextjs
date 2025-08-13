# PeopleNotes - Technical Interview Project

A full-stack application for managing contacts and notes.

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

Within the `people-notes` folder:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Create and migrate database
   npm run db:push

   # Seed with demo data
   npm run db:seed
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
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
