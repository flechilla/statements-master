# Statement Master

A Next.js application for visualizing and managing credit card statements and expenses.

## Features

- Track and visualize expenses across multiple credit cards and banks
- Search and filter transactions
- AI-powered statement parsing and data extraction
- Upload and process credit card statements automatically
- RESTful API for accessing statement data
- PostgreSQL database with Drizzle ORM

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database

### Environment Setup

1. Copy the example environment file and fill in your database connection details:

```bash
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL connection string and Anthropic API key:

```
DATABASE_URL="postgres://username:password@hostname:port/database"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

### Database Setup

This application uses Drizzle ORM with PostgreSQL. To set up the database:

1. Generate the SQL migration files:

```bash
pnpm db:generate
```

2. Apply the migrations to your database:

```bash
pnpm db:push
```

3. (Optional) Seed the database with sample data from JSON files:

```bash
pnpm db:seed
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Management

- `pnpm db:generate` - Generate migration files from schema
- `pnpm db:push` - Push schema changes to the database
- `pnpm db:studio` - Open Drizzle Studio to view/edit data
- `pnpm db:migrate` - Run migrations
- `pnpm db:seed` - Seed database with sample data

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
