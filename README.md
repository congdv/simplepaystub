# Paystub Generator

A modern web application for generating professional paystub documents with PDF export capabilities. Built with Next.js 14, TypeScript, and Supabase.

## Features

- **Paystub Generation**: Create customized paystubs with comprehensive employee and business information
- **PDF Export**: Generate professional PDF documents from paystub data
- **Authentication**: Secure user authentication and authorization with Supabase
- **Storage Management**: Save and retrieve paystub history
- **Email Integration**: Send paystubs via email
- **Template System**: Multiple template options for paystub layouts
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Monitoring**: Sentry
- **Forms**: React Hook Form + Zod validation

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes
│   ├── (landing)/         # Public landing pages
│   ├── (protected)/       # Protected routes (dashboard, account)
│   └── api/               # API routes
├── components/            # React components
│   ├── sections/         # Form sections (employee, business, etc.)
│   ├── templates/        # Paystub templates (PDF & preview)
│   ├── ui/               # Reusable UI components
│   └── dashboard/        # Dashboard-specific components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and commands
└── schemas.ts            # Zod validation schemas
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd paystub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SENTRY_DSN=your_sentry_dsn (optional)
```

4. Install dbmate (one-time):
```bash
brew install dbmate
```

5. Run database migrations:
```bash
npm run db:up
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Migrations

Migrations are managed with [dbmate](https://github.com/amacneil/dbmate). Migration files live in `db/migrations/` and the canonical schema snapshot is in `db/schema.sql`.

**Prerequisite:** `brew install dbmate`

| Command | Description |
|---------|-------------|
| `npm run db:status` | Show pending and applied migrations |
| `npm run db:up` | Apply all pending migrations |
| `npm run db:down` | Roll back the last migration |
| `npm run db:new <name>` | Create a new migration file |

New migrations are created with `npm run db:new <name>` and include `-- migrate:up` / `-- migrate:down` sections.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Features & Components

### Paystub Form
Multi-step form with sections for:
- Employee information
- Business information
- Payment details
- Benefits and deductions

### Templates
Customizable paystub templates with PDF generation capabilities located in [src/components/templates](src/components/templates).

### Dashboard
Analytics and historical data visualization with chart components.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SENTRY_DSN` | Sentry error tracking DSN | No |

## License

Copyright © 2025. All rights reserved.

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited.

## Support

For questions or issues, please [open an issue](https://github.com/congdv/paystub/issues) on GitHub.
