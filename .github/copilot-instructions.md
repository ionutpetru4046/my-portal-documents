# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js 15+ app using the App Router, TypeScript, and Tailwind CSS.
- Main entry: `src/app/layout.tsx` wraps all pages with context providers and a global navbar.
- Authentication uses NextAuth.js with Supabase as the credentials provider (`src/app/api/auth/[...nextauth]/route.ts`).
- User and file state are managed via React Contexts (`src/context/UserContext.tsx`, `src/context/UploadedFilesContext.tsx`).
- UI components are in `src/components/` and `src/components/ui/` (Radix UI, shadcn/ui, custom).

## Key Patterns & Conventions
- All pages live under `src/app/`, each in its own folder (e.g., `about/page.tsx`).
- API routes are in `src/app/api/`, grouped by feature (e.g., `auth`, `checkout`, `documents`, `upload`).
- Context providers are nested in `layout.tsx` for global access.
- Use `"use client"` for client components and contexts.
- LocalStorage is used for persisting user and uploaded files state.
- Use `SessionProviderWrapper` for NextAuth session context.
- UI follows Tailwind CSS utility classes and Radix primitives.

## Developer Workflows
- **Start dev server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Deploy:** Vercel recommended; see Next.js docs for details.
- No custom test scripts detected; add tests in `src/__tests__/` if needed.

## Integration Points
- **Supabase:** Initialized in `src/lib/supabaseClient.ts` using env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **NextAuth:** Configured in `src/app/api/auth/[...nextauth]/route.ts`.
- **Stripe:** Used for checkout (see dependencies, check `src/app/api/checkout/route.ts`).
- **Prisma:** Used for database access (see dependencies).

## Examples
- To add a new page: create `src/app/newpage/page.tsx`.
- To add a new API route: create `src/app/api/feature/route.ts`.
- To add a new context: create in `src/context/` and wrap in `layout.tsx`.

## References
- See `README.md` for Next.js basics and deployment.
- See `package.json` for scripts and dependencies.
- See `src/app/layout.tsx` for provider nesting and global layout.

---
If any conventions or workflows are unclear, ask the user for clarification or examples before proceeding.
