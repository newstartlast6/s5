# Watermark Remover

## Overview
A Next.js 15 watermark remover application built with React 19, TypeScript, and Tailwind CSS. Features a modern UI with drag-and-drop file upload, video validation, and theme switching.

## Recent Changes
- **Oct 4, 2025**: GitHub import successfully configured for Replit
  - Installed npm dependencies (276 packages including @google-cloud/storage, uuid)
  - Configured Next.js for Replit proxy (allowedDevOrigins: "*")
  - Verified dev server running on 0.0.0.0:5000
  - Configured autoscale deployment (build: npm run build, run: npm start)
  - Watermark remover landing page with drag-and-drop file upload operational
  - Theme toggle with dark/light mode support working
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
- **Theme**: next-themes for dark/light mode switching
- **Package Manager**: npm (using package-lock.json)

## Features
- Drag and drop video upload interface
- File validation (size, format, duration)
- Real-time error handling
- Theme toggle (dark/light mode)
- Responsive design
- Animated UI elements
- **Google Cloud Storage upload with presigned URLs**
- **Real-time upload progress tracking**
- **Video preview after successful upload**
- **Download uploaded videos**

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
- uuid

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
