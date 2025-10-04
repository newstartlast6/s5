# Watermark Remover

## Overview
A Next.js 15 watermark remover application built with React 19, TypeScript, and Tailwind CSS. Features a modern UI with drag-and-drop file upload, video validation, and theme switching.

## Recent Changes
- **Oct 4, 2025**: Project created and deployed to Replit
  - Implemented watermark remover landing page with file upload functionality
  - Added theme toggle with dark/light mode support using next-themes
  - Configured for Replit deployment (server on 0.0.0.0:5000)
  - Set up file validation (100MB max, 30 seconds max duration, MP4/MOV/AVI/WebM formats)

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
- Configured for Replit deployment
- Server actions allowed from all origins for proxy compatibility
- Development server accessible via Replit web preview
