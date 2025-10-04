# Watermark Remover

## Overview
A Next.js 15 application designed to remove watermarks from videos. It features a modern, dark-themed UI with a split-screen video preview, drag-and-drop file uploads, video validation, and smooth animations. The application integrates Supabase for user authentication and Google Cloud Storage for video handling, aiming to provide a seamless and efficient watermark removal service with a focus on user experience and monetized through a subscription model. Key capabilities include AI-powered detection and smart removal, along with a free tier limit and a $5/month subscription plan.

## User Preferences
I prefer iterative development with small, focused changes.
Please provide clear and concise explanations.
I prefer detailed explanations.
Ask before making major changes.
I value a clean and modern aesthetic in the UI/UX.
I prefer that the agent focuses on completing tasks efficiently.

## System Architecture
The application is built with Next.js 15 (App Router), React 19, and styled using Tailwind CSS 4, emphasizing a dark-theme only design with teal accents. Radix UI components are used for enhanced UI elements. Form handling is managed by React Hook Form with Zod validation.

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