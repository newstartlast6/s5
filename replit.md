# TractionPilot

## Overview
A Next.js 15 application built with React 19, TypeScript, and Tailwind CSS. Migrated from Vercel to Replit on October 4, 2025.

## Recent Changes
- **Oct 4, 2025**: Migrated from Vercel to Replit
  - Updated package.json scripts to bind server to 0.0.0.0:5000 for Replit compatibility
  - Configured Next.js to allow all origins for server actions in Replit proxy environment
  - Set up development workflow to run on port 5000
  - Removed Turbopack flags for better compatibility

## Project Architecture
- **Framework**: Next.js 15.5.2 with App Router
- **UI Framework**: React 19.1.0
- **Styling**: Tailwind CSS 4 with custom components
- **Component Library**: Radix UI components with custom styling
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: npm (using package-lock.json)

## Tech Stack
- TypeScript 5
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Radix UI components
- React Hook Form + Zod
- date-fns, recharts, lucide-react

## Development
- Dev server runs on port 5000 (Replit requirement)
- Server binds to 0.0.0.0 to work with Replit proxy
- Hot reload enabled via Next.js development mode

## Environment Configuration
- Configured for Replit deployment
- Server actions allowed from all origins for proxy compatibility
- Development server accessible via Replit web preview
