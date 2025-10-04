# Watermark Remover

## Overview
A Next.js 15 watermark remover application built with React 19, TypeScript, and Tailwind CSS. Features a modern dark-themed UI with split-screen video preview, drag-and-drop file upload, video validation, and smooth animations.

## Recent Changes
- **Oct 4, 2025**: Authentication improvements with user menu and video persistence
  - **User menu in header**: Shows user icon when signed in, dropdown with email and sign-out button
  - **Authentication state management**: Real-time auth state updates with Supabase
  - **Toast notifications**: Added success/error feedback for login and signup
  - **Loading states**: Visual feedback with spinners on all auth buttons (immediate feedback)
  - **Proper error handling**: Detailed error messages for authentication failures
  - **Supabase integration**: Email/password and Google OAuth authentication
  - **User feedback**: Toast messages show in top-right corner for all auth actions
  - **Video persistence**: Videos saved to localStorage and restored after Google OAuth redirect
  - **Clean URLs**: OAuth code parameter automatically removed from URL after authentication
  - **Seamless flow**: Auth dialog closes on success, no page navigation needed
  - **Hydration fix**: Proper client-side mounting to prevent hydration mismatches
  - **No flash on refresh**: Video state loads before rendering to prevent drag-drop area flash
  
- **Oct 4, 2025**: Split-screen interface with dark theme implementation
  - **Dark theme only**: Forced dark theme, removed light mode and theme toggle
  - **Split-screen layout**: After upload, screen splits into two columns
    - Left: Video preview with orientation detection (landscape/portrait)
    - Right: Demo component with teal-themed design
  - **Video orientation detection**: Automatically detects and displays landscape or portrait videos correctly
  - **Smooth animations**: Slide-in and fade-in transitions for split-screen view
  - **Modern teal design**: Clean, beautiful UI with consistent teal accent colors
  - **"Start Over" button**: Replace uploaded video with new upload
  
- **Oct 4, 2025**: GitHub import successfully configured for Replit
  - Installed npm dependencies (276 packages including @google-cloud/storage, uuid)
  - Configured Next.js for Replit proxy (allowedDevOrigins: "*")
  - Verified dev server running on 0.0.0.0:5000
  - Configured autoscale deployment (build: npm run build, run: npm start)
  - Watermark remover landing page with drag-and-drop file upload operational
  - File validation configured (100MB max, 30 seconds max duration, MP4/MOV/AVI/WebM formats)
  - **Google Cloud Storage integration implemented**:
    - Secure presigned URL upload with XMLHttpRequest for progress tracking
    - Single API endpoint generates both upload and download signed URLs
    - Real-time upload progress bar (0-100%)
    - Video preview component displays uploaded videos
    - Download functionality for uploaded videos

## Project Architecture
- **Framework**: Next.js 15.5.2 with App Router
- **UI Framework**: React 19.1.0
- **Styling**: Tailwind CSS 4 with custom components
- **Component Library**: Radix UI components with custom styling
- **Forms**: React Hook Form with Zod validation
- **Theme**: next-themes configured for dark mode only
- **Package Manager**: npm (using package-lock.json)

## Features
- **Authentication System**:
  - Email/password signup and login with Supabase
  - Google OAuth sign-in
  - Toast notifications for success/error feedback
  - Loading states with spinners on buttons
  - Email verification support
- Drag and drop video upload interface
- File validation (size, format, duration)
- Real-time error handling
- **Dark theme only** - modern, clean design with teal accents
- **Split-screen layout** after video upload
- **Automatic video orientation detection** (landscape/portrait)
- **Smooth animations** - slide-in and fade-in transitions
- Responsive design
- Animated UI elements with teal glow effects
- **Google Cloud Storage upload with presigned URLs**
- **Real-time upload progress tracking**
- **Video preview after successful upload**
- **Demo component** showing example output
- **Start over functionality** to upload new videos

## Tech Stack
- TypeScript 5
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Radix UI components
- React Hook Form + Zod
- next-themes
- lucide-react icons
- @google-cloud/storage
- @supabase/ssr (authentication)
- @supabase/supabase-js (authentication)
- sonner (toast notifications)
- uuid

## Development
- Dev server runs on port 5000 (Replit requirement)
- Server binds to 0.0.0.0 to work with Replit proxy
- Hot reload enabled via Next.js development mode
- Theme provider configured for dark mode only (system detection disabled)

## Environment Configuration
- **Dev Server**: Runs on 0.0.0.0:5000 (Replit requirement)
- **Proxy Config**: allowedDevOrigins set to "*" for Replit iframe support
- **Server Actions**: Allowed from all origins for proxy compatibility
- **Deployment**: Autoscale deployment configured with npm build/start
- **Workflow**: Single "Server" workflow running `npm run dev`

## Google Cloud Storage Configuration
- **Required Secrets** (configured in Replit Secrets):
  - GOOGLE_CLOUD_PROJECT_ID
  - GOOGLE_CLOUD_STORAGE_BUCKET
  - GOOGLE_CLOUD_CREDENTIALS_BASE64

## API Endpoints
- **POST /api/upload/generate-url**: Generates secure presigned URLs for upload and download
  - Input: fileName, contentType
  - Output: uploadUrl, downloadUrl, gcsPath, fileId
  - Security: Uses service account credentials, generates time-limited signed URLs (15min upload, 1hr download)

## Setup Instructions
1. Dependencies are already installed via `npm install`
2. Configure Google Cloud Storage secrets in Replit Secrets
3. Dev server starts automatically via workflow
4. Access app through Replit web preview
5. For deployment, click "Publish" button in Replit UI
