# Remove Sora Watermark

## Overview
A Next.js 15 application designed to remove Sora watermarks from videos. It features a modern, dark-themed UI with a split-screen video preview, drag-and-drop file uploads, video validation, and smooth animations. The application integrates Supabase for user authentication and Google Cloud Storage for video handling, aiming to provide a seamless and efficient watermark removal service with a focus on user experience and monetized through a subscription model. Key capabilities include AI-powered detection and smart removal, along with a free tier limit and a $5/month subscription plan.

## Recent Changes
- **Oct 6, 2025**: Reorganized mask editor UI with full-screen overlay layout
  - Modified VideoMaskEditor to display as full-screen overlay with 2-column grid layout
  - Video preview with canvas overlay positioned on left side
  - Mask control panel positioned on right side for easy access
  - Added "Edit Logo Manually" button to VideoPreview component that triggers mask editor
  - Implemented video playback controls: Play/pause button and ±3 second jump buttons integrated directly in video controls
  - Video controls properly wired to shared togglePlayPause and jumpTime functions for consistent playback behavior
  - Remove Watermark button available in mask control panel for processing from editing mode
  - Layout maintains proper grid structure across different viewport sizes
  - Closing overlay properly restores background state
  - All changes architect-reviewed and approved for code quality and UX
- **Oct 6, 2025**: Implemented comprehensive mask editing feature for manual watermark removal
  - Added mask type selection (Manual/AI) that appears after video upload
  - Created VideoMaskEditor component with canvas overlay for drawing masks on videos
  - Implemented mask drawing: Click and drag to create rectangular masks on video
  - Implemented mask manipulation: Drag to move masks, resize handles on all corners, delete functionality
  - Created MaskControlPanel below video with mask list showing all masks with properties (X, Y, Width, Height)
  - Implemented timeline controls: Each mask has start/end time sliders with +3/-3 second adjustment buttons
  - Added visual feedback: Masks only appear during their active time ranges, selected masks highlight in teal
  - Integrated responsive canvas sizing with ResizeObserver for proper alignment across viewport changes
  - Canvas dimensions sync with video container, mask coordinates scale proportionally during resize
  - Added "Add Mask", "Delete All", and "Remove Watermark" buttons with proper styling
  - Complete workflow: Upload video → Select mask type → Draw/edit masks → Set durations → Remove watermark
  - All changes architect-reviewed and tested for code quality, performance, and UX
- **Oct 4, 2025**: UI/UX improvements for download, layout, and support access
  - Enhanced download button with loading indicator: Shows "Downloading..." with spinner for 1 second when download is initiated, provides immediate visual feedback to users
  - Removed numbered step circles (1, 2, 3) from "How It Works" section for cleaner, more modern appearance
  - Added "Contact Us" button to footer Legal section that opens Crisp chat widget for instant support access
  - Download button now uses simplified anchor-based approach for reliability, avoiding CORS issues while maintaining security with target="_blank" and rel="noopener noreferrer"
  - All changes reviewed and approved by architect, ensuring code quality and best practices
- **Oct 4, 2025**: Added Crisp Chat and rebranded application
  - Integrated Crisp live chat support widget with ID: 4c10a0ef-83bc-4be3-b669-8ffc08f36885
  - Rebranded app from "Watermark Remover" to "Remove Sora Watermark" (standard name: RemoveSoraWatermark)
  - Updated all branding throughout the app including header, footer, page title, and meta description
  - Simplified footer: Removed Features section, kept only Legal links (Privacy Policy, Terms of Service, Refund Policy)
  - Updated footer links to point to actual pages (/privacy, /terms, /refunds)
- **Oct 4, 2025**: Multiple UX improvements
  - Fixed download button: Videos now download directly instead of opening in a new tab
  - Fixed video preview alignment: Large videos now align to the top instead of center (matching drag-and-drop area)
  - Added subscription status badge in header: Shows "Pro: Unlimited Videos" for Pro users or "Free: X Videos Left" for free users
  - Subscription status badge appears immediately after login alongside user profile icon
- **Oct 4, 2025**: Fixed user profile and job history not updating immediately after login
  - Issue: User profile icon and job history didn't update immediately after login; required tab switching to see changes
  - Root cause: Auth state change listener wasn't firing immediately when tab didn't have focus
  - Solution: Added `refreshUserState()` function that manually fetches user, jobs, and subscription status immediately after successful login
  - The auth dialog's onSuccess callback now calls refreshUserState() to force an immediate UI update
  - User profile icon and job history now appear instantly after login without needing to switch tabs
- **Oct 4, 2025**: Successfully re-imported and configured project for Replit environment
  - Imported fresh clone from GitHub repository
  - Installed all npm dependencies (404 packages) successfully
  - Configured Next.js dev server on port 5000 with host 0.0.0.0 (pre-configured in package.json)
  - Updated next.config.ts to properly support Replit's iframe proxy with allowedDevOrigins: ["*"]
  - Verified application running successfully with main UI visible and functional
  - Set up autoscale deployment configuration (build: npm run build, run: npm start)
  - Server workflow running without errors, application ready for use
- **Oct 4, 2025**: Fixed video clearing, Pro badge refresh, and hardcoded plan IDs
  - Fixed video clearing on signup: Video now only clears after the job appears in job history with indefinite polling using exponential backoff (300ms to 1000ms)
  - Job history properly refreshes before video clearing, ensuring users see their job immediately after signup
  - Pro badge now appears after subscribing: Subscription status refreshes on page load and after checkout return (no polling)
  - Pro badge location: Displays in the user dropdown menu (click user icon in top-right corner)
  - Fixed hardcoded plan_id values: Replaced all hardcoded IDs with NEXT_PUBLIC_CREEM_MONTHLY_PLAN_ID and NEXT_PUBLIC_CREEM_LIFETIME_PLAN_ID environment variables in webhook and checkout session
- **Oct 4, 2025**: Fixed webhook to correctly handle monthly subscriptions and added Pro User badge
  - Fixed webhook handler to treat monthly subscriptions correctly in test mode (removed prod_1FVYSkTv3ur6jDliBI2Mt from lifetime plans)
  - Monthly subscription (prod_1FVYSkTv3ur6jDliBI2Mt) now grants 1000 videos, not unlimited
  - Added "Pro User" badge in Header component that displays for users with active subscriptions
  - Added subscription status tracking that fetches on user login and persists throughout the session
  - Subscription status displayed in user menu with badge indicating premium membership
- **Oct 4, 2025**: Fixed pricing dialog not showing after signup/login when free limit exceeded
  - Modified error handling in createJobAndTrigger function to detect "Free video limit exceeded" error
  - When free limit error occurs, pricing dialog now opens automatically instead of just showing error toast
  - Added PostHog event tracking for 'free_limit_reached' with context when triggered from job creation
  - Ensures users see subscription options immediately after hitting their free video limit
  - Tested and verified working with server logs showing successful pricing dialog and checkout flow

## User Preferences
I prefer iterative development with small, focused changes.
Please provide clear and concise explanations.
I prefer detailed explanations.
Ask before making major changes.
I value a clean and modern aesthetic in the UI/UX.
I prefer that the agent focuses on completing tasks efficiently.

## System Architecture
The application is built with Next.js 15 (App Router), React 19, and styled using Tailwind CSS 4, emphasizing a dark-theme only design with teal accents. Radix UI components are used for enhanced UI elements. Form handling is managed by React Hook Form with Zod validation.

**Replit Configuration:**
- **Dev Server:** Runs on port 5000 with host 0.0.0.0 (configured in package.json)
- **Proxy Compatibility:** Next.js configured with allowedDevOrigins: ["*"] and serverActions.allowedOrigins: ["*"] for Replit iframe proxy
- **Deployment:** Autoscale deployment configured with build (npm run build) and start (npm start) commands
- **Environment:** All required environment variables in .env.local (Supabase, Google Cloud, Creem.io, PostHog)
- **Workflow:** Single "Server" workflow running `npm run dev`

**UI/UX Decisions:**
- **Dark Theme Only:** A forced dark theme with teal accents for a modern and clean aesthetic.
- **Split-Screen Layout:** After video upload, the interface transitions to a split-screen view, displaying the video preview on the left and a demo/job history panel on the right.
- **Drag-and-Drop:** Intuitive file upload interface.
- **Responsive Design:** Ensures optimal viewing across various devices.
- **Animated UI:** Smooth slide-in, fade-in transitions, and animated icons enhance user interaction.
- **Conditional Rendering:** Dynamic layout adjustments based on authentication status, video presence, and job history.

**Technical Implementations:**
- **Authentication:** Supabase for email/password and Google OAuth, with real-time auth state management and robust error handling.
- **Video Processing:** Presigned URLs for secure and efficient Google Cloud Storage uploads, real-time progress tracking, and automatic thumbnail generation for uploaded videos.
- **Job Management:** A job history feature displays video processing statuses (uploaded, processing, completed, failed) with real-time updates and download options for completed jobs.
- **Payment Integration:** A free video limit system with a pricing popup and Creem.io integration for subscription management.
- **Client-Side Storage:** Video state and job history are persisted using localStorage.

**Feature Specifications:**
- **Authentication System:** Email/password and Google OAuth with toast notifications and loading states.
- **File Validation:** Enforces limits on size (100MB), duration (30 seconds), and format (MP4, MOV, AVI, WebM).
- **Video Preview:** Displays uploaded videos with automatic orientation detection.
- **Mask Editing:** Interactive canvas-based editor for manual watermark removal with mask type selection, draw/move/resize/delete operations, timeline controls with duration sliders, and responsive design that maintains alignment across viewport changes.
- **Job History:** Card-based list of user's video jobs with status badges and download buttons.
- **"How It Works" & FAQ:** Informative sections on the landing page explaining features and answering common questions.
- **Subscription Management:** Free tier limit and a $5/month subscription plan managed via Creem.io.

## External Dependencies
- **Supabase:** User authentication and database for storing user data, subscriptions, and video job metadata.
- **Google Cloud Storage:** Secure storage for video files and generated thumbnails.
- **Creem.io:** Payment gateway for subscription management and handling of premium features.
- **PostHog:** Product analytics for usage tracking.
- **`@google-cloud/storage`:** Google Cloud Storage client library.
- **`@supabase/ssr` & `@supabase/supabase-js`:** Supabase client libraries for authentication and database interaction.
- **`sonner`:** For toast notifications.
- **`uuid`:** For generating unique identifiers.