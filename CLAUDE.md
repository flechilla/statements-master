# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `pnpm dev` - Start dev server with turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Code Style Guidelines

- **TypeScript**: Use strict typing, prefer explicit types over `any`
- **Types**: Define types in `/lib/types/` directory, one type per file, avoid using interfaces
- **React**: Use functional components with TypeScript props interfaces
- **Imports**: Group imports (React/Next.js, 3rd-party, local) with a blank line between groups
- **Naming**: Use PascalCase for components, camelCase for variables/functions
- **CSS**: Use Tailwind classes for styling
- **Error Handling**: Use try/catch blocks for async operations
- **Path Aliases**: Use `@/*` path aliases to reference files from the root
- **Code Organization**: Keep components focused on single responsibilities
- **JSON Data**: Use monthly statement files in data/chase-freedom/ for expense tracking
- **Code Complexity**: Avoid complex logic, break down files into multiple ones:
  - For pages: extract functionality into separate components
  - For files with logic: split into smaller, focused modules

## UI Components and Styling Guidelines

### Architecture Principles

- Check if shadcn components can be used before implementing custom ones: `npx shadcn@latest add <COMPONENT>`
- Group related components in directories with an index.ts barrel file
- Break complex views into smaller, reusable components

### UI Framework and Styling

- Use Shadcn UI with Tailwind CSS for styling with a mobile-first approach
- Always use `next/image` for image optimization
- Implement proper loading and error states with LoadingContent component

### Accessibility and Performance

- Use semantic HTML and appropriate ARIA attributes
- Maintain proper heading hierarchy
- Lazy load components below the fold with next/dynamic
- Implement virtualization for long lists
- Ensure color contrast meets WCAG standards (minimum 4.5:1 ratio)
