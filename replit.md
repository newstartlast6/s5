# Watermark Remover

## Overview
A Next.js 15 watermark remover application built with React 19, TypeScript, and Tailwind CSS. Features a modern UI with drag-and-drop file upload, video validation, and theme switching.

## Recent Changes
- **Oct 4, 2025**: GitHub import successfully configured for Replit
  - Installed npm dependencies (192 packages)
  - Configured Next.js for Replit proxy (allowedDevOrigins: "*")
  - Verified dev server running on 0.0.0.0:5000
  - Configured autoscale deployment (build: npm run build, run: npm start)
  - Watermark remover landing page with drag-and-drop file upload operational
  - Theme toggle with dark/light mode support working
  - File validation configured (100MB max, 30 seconds max duration, MP4/MOV/AVI/WebM formats)

## Project Architecture
- **Framework**: Next.js 15.5.2 with App Router
- **UI Framework**: React 19.1.0
- **Styling**: Tailwind CSS 4 with custom components
- **Component Library**: Radix UI components with custom styling
- **Forms**: React Hook Form with Zod validation
- **Theme**: next-themes for dark/light mode switching
- **Package Manager**: npm (using package-lock.json)

## Features
- Drag and drop video upload interface
- File validation (size, format, duration)
- Real-time error handling
- Theme toggle (dark/light mode)
- Responsive design
- Animated UI elements

## Tech Stack
- TypeScript 5
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Radix UI components
- React Hook Form + Zod
- next-themes
- lucide-react icons

## Development
- Dev server runs on port 5000 (Replit requirement)
- Server binds to 0.0.0.0 to work with Replit proxy
- Hot reload enabled via Next.js development mode
- Theme provider configured for system preference detection

## Environment Configuration
- **Dev Server**: Runs on 0.0.0.0:5000 (Replit requirement)
- **Proxy Config**: allowedDevOrigins set to "*" for Replit iframe support
- **Server Actions**: Allowed from all origins for proxy compatibility
- **Deployment**: Autoscale deployment configured with npm build/start
- **Workflow**: Single "Server" workflow running `npm run dev`

## Setup Instructions
1. Dependencies are already installed via `npm install`
2. Dev server starts automatically via workflow
3. Access app through Replit web preview
4. For deployment, click "Publish" button in Replit UI
