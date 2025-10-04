# Watermark Remover

## Overview
A Next.js 15 application designed to remove watermarks from videos. It features a modern, dark-themed UI with a split-screen video preview, drag-and-drop file uploads, video validation, and smooth animations. The application integrates Supabase for user authentication and Google Cloud Storage for video handling, aiming to provide a seamless and efficient watermark removal service with a focus on user experience and monetized through a subscription model. Key capabilities include AI-powered detection and smart removal, along with a free tier limit and a $5/month subscription plan.

## Recent Changes
- **Oct 4, 2025**: Fixed video clearing, Pro badge refresh, and hardcoded plan IDs
  - Fixed video clearing on signup: Video now only clears after the job appears in job history with indefinite polling using exponential backoff (300ms to 1000ms)
  - Job history properly refreshes before video clearing, ensuring users see their job immediately after signup
  - Pro badge now appears after subscribing: Added 5-second subscription status polling and checkout return detection
  - Fixed hardcoded plan_id values: Replaced all hardcoded IDs with NEXT_PUBLIC_CREEM_MONTHLY_PLAN_ID and NEXT_PUBLIC_CREEM_LIFETIME_PLAN_ID environment variables in webhook and checkout session
- **Oct 4, 2025**: Configured for Replit environment
  - Successfully imported from GitHub and configured for Replit
  - Installed all npm dependencies (404 packages)
  - Verified Next.js dev server running on port 5000 with 0.0.0.0 host
  - Confirmed proxy compatibility with allowedDevOrigins: ["*"] in next.config.ts
  - Set up deployment configuration for autoscale (build: npm run build, start: npm start)
  - Application running successfully with all features functional
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