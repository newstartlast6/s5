This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

Create a `.env.local` file in the root directory and add your PostHog credentials:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

To get your PostHog credentials:
1. Sign up at [PostHog](https://app.posthog.com) (free tier available)
2. Create a new project or use an existing one
3. Go to Project Settings to find your API key
4. Use `https://app.posthog.com` as the host (or your self-hosted URL)

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## PostHog Analytics

This project includes [PostHog](https://posthog.com) for product analytics, feature flags, and session recording.

### Features Enabled:
- **Pageview Tracking**: Automatic tracking of page navigation
- **Event Tracking**: Track custom events using the `usePostHog()` hook
- **User Identification**: Track authenticated users
- **Session Recording**: Optional - can be enabled in PostHog settings

### Using PostHog in Components:

```tsx
'use client'
import { usePostHog } from 'posthog-js/react'

export function MyComponent() {
  const posthog = usePostHog()

  const handleClick = () => {
    posthog?.capture('button_clicked', {
      button_name: 'my_button'
    })
  }

  return <button onClick={handleClick}>Click me</button>
}
```

### Identifying Users:

```tsx
const posthog = usePostHog()

// When user logs in
posthog?.identify(userId, {
  email: user.email,
  name: user.name
})

// When user logs out
posthog?.reset()
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

**Note**: Don't forget to add your `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables in your Vercel project settings.
