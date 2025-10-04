# Watermark Remover

## Overview
A Next.js 15 watermark remover application built with React 19, TypeScript, and Tailwind CSS. Features a modern dark-themed UI with split-screen video preview, drag-and-drop file upload, video validation, and smooth animations. The application uses Supabase for authentication and Google Cloud Storage for video uploads.

## Recent Changes
- **Oct 4, 2025**: Payment integration with Creem.io and free tier implementation
  - **Free video limit system**: Added FREE_VIDEO_LIMIT env variable (default: 3 free videos)
  - **Beautiful pricing popup**: Created modern $5/month pricing dialog with teal theme
  - **Subscription status API**: GET /api/subscription/status checks user limits and subscription
  - **Database schema updates**:
    - `subscriptions` table created for tracking user subscriptions
    - `video_jobs.is_free` column added to track free vs paid videos
  - **Payment flow**: 
    - Remove Watermark button checks subscription status
    - Shows pricing popup when free limit exceeded
    - Integrates with existing Creem.io webhook for subscription activation
  - **Environment variables**:
    - `FREE_VIDEO_LIMIT`: Number of free videos (0 to n)
    - `NEXT_PUBLIC_CREEM_MONTHLY_PLAN_ID`: Creem product ID for $5/month plan
  - All features tested and working correctly

- **Oct 4, 2025**: Fresh GitHub import successfully configured for Replit environment
  - Installed all npm dependencies (404 packages)
  - Updated package.json scripts to run on port 5000 (dev and start commands)
  - Configured Next.js with allowedDevOrigins: "*" for Replit proxy support (already present)
  - Set up "Server" workflow running `npm run dev` on port 5000 with webview output
  - Configured autoscale deployment (build: npm run build, run: npm start)
  - Verified watermark remover landing page is fully functional
  - Dark theme with teal accents displaying correctly
  - Drag-and-drop video upload interface operational
  - Project import completed successfully

- **Oct 4, 2025**: Enhanced landing page with How It Works, FAQ, and Footer sections
  - **How It Works section**: Beautiful card-based layout showcasing AI Detection and Smart Removal features with animated icons (Sparkles and Wand2)
  - **FAQ section**: Accordion-style Frequently Asked Questions covering Sora video compatibility, video quality, processing time, and privacy/security
  - **Footer section**: Professional 3-column footer with branding, features list, and support links
  - Modern, stylish design with teal accents, backdrop blur effects, hover animations, and smooth transitions
  - Sections only display on landing page (when no video/jobs are present), maintaining clean split-view UX when working with videos
  
- **Oct 4, 2025**: Fixed split view persistence during signup flow
  - **Always split view after upload**: Once a video is uploaded, the screen remains in split view permanently
  - **No more layout shifts**: Signup no longer causes full screen transition, maintaining split view throughout
  - **Simplified logic**: Split view shows when there's a video OR when there are jobs (for returning users)
  - **Smooth user experience**: Upload → split → signup → split (no jump)
  - **Thumbnail support**: New jobs will display video thumbnails (96x96px) in job history
  - **Note**: Existing jobs created before this update won't have thumbnails, but all new jobs will
- **Oct 4, 2025**: GitHub import successfully set up in Replit environment
  - Installed all npm dependencies (397 packages)
  - Verified Next.js 15.5.2 configuration with server actions
  - Updated NEXT_PUBLIC_SITE_URL to use Replit domain dynamically
  - Confirmed dev server running on 0.0.0.0:5000 
  - Deployment configured with autoscale (build: npm run build, run: npm start)
  - App fully functional with dark theme and drag-and-drop upload interface
  - All existing features verified: authentication, Google Cloud Storage, job history
  
- **Oct 4, 2025**: Video thumbnails in job history
  - **Automatic thumbnail generation**: First frame of video captured automatically when video is uploaded
  - **Thumbnail upload to GCS**: Thumbnails uploaded to Google Cloud Storage alongside videos
  - **Job history with thumbnails**: 96x96px video thumbnails displayed in job history cards with status badge overlay
  - **Graceful fallback**: Falls back to icon-only display if thumbnail generation fails
  - **Persistent storage**: Thumbnail URLs stored in database and localStorage for consistency
  - **Database requirement**: Requires `thumbnail_url` column in Supabase `video_jobs` table

- **Oct 4, 2025**: Job creation UX improvements - Seamless flow with loading indicator
  - **Loading indicator on button**: "Remove Watermark" button shows spinner and "Starting Processing..." text while submitting
  - **No screen jump**: Video stays visible until job appears in job history (fixed split view → full screen → split view jump)
  - **Smart video clearing**: Video URL cleared only AFTER job successfully added to job history
  - **Disabled buttons during submission**: Both "Remove Watermark" and "Start Over" buttons disabled while processing
  - **Job history refresh**: Jobs list fetched immediately after job creation, then video cleared
  - **Smooth login-to-process flow**: Login → job creation → loading indicator → job appears → video cleared
  - **Progress feedback**: Toast notification shows "Processing started!" with description

- **Oct 4, 2025**: Conditional rendering logic implementation - Proper layout based on user state and content
  - **Smart layout system**: Layout automatically adjusts based on authentication status, video upload, and job history
  - **Non-authenticated users**:
    - No video → Shows drag and drop zone with hero section
    - Has video → Shows split view with video preview + demo component
  - **Authenticated users**:
    - Video + jobs → Shows video preview + job history panel
    - Video only → Shows video preview + demo component  
    - Jobs only → Shows upload zone + job history panel
    - No content → Shows upload zone with hero section
  - **Job history state lifted to Home**: Jobs fetched on login, refreshed every 10 seconds
  - **No loading screens**: Immediate content display, no blocking loaders on initial render

- **Oct 4, 2025**: Job history feature and Cloud Run API fixes
  - **Fixed Cloud Run API**: Changed from ExecutionsClient to JobsClient for proper job execution
  - **Job History API**: Created /api/jobs/list endpoint to fetch user's video jobs
  - **Modern Split View UI**: 
    - Left panel: Upload zone with drag-and-drop or video preview after upload
    - Right panel: Job history with beautiful card-based list
    - Real-time job status tracking (uploaded, processing, completed, failed)
    - Auto-refresh every 10 seconds to update job statuses
    - Download buttons for completed jobs
    - Custom scrollbar styling for smooth UX
  - **Status Badges**: Color-coded status indicators with animations (processing jobs show spinner)
  
- **Oct 4, 2025**: GitHub import successfully configured for Replit environment
  - Installed npm dependencies (397 packages)
  - Configured Next.js for Replit proxy with allowedDevOrigins: "*"
  - Made Supabase middleware resilient to missing credentials (app works without auth configured)
  - Fixed client-side Supabase client to handle missing credentials gracefully
  - Updated server.ts to handle missing Supabase credentials
  - Updated all auth actions to gracefully handle missing credentials
  - Verified dev server running on 0.0.0.0:5000
  - Configured autoscale deployment (build: npm run build, run: npm start)
  - Landing page fully operational with drag-and-drop video upload UI
  - Dark theme with teal accent colors displaying correctly
  - Project import completed successfully
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
