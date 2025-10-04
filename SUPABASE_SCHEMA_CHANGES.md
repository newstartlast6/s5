# Supabase Database Schema Changes

## Required Schema Updates for Payment Integration

You need to run these SQL commands in your Supabase SQL Editor to enable the payment integration features.

### 1. Create Subscriptions Table

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  product_id TEXT,
  subscription_id TEXT,
  customer_id TEXT,
  videos_limit INTEGER DEFAULT 0,
  videos_used INTEGER DEFAULT 0,
  is_lifetime BOOLEAN DEFAULT FALSE,
  lifetime_purchased_at TIMESTAMPTZ,
  webhook_data JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
```

### 2. Add is_free Column to video_jobs Table

```sql
ALTER TABLE video_jobs 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT TRUE;

-- Create index for faster counting
CREATE INDEX IF NOT EXISTS video_jobs_user_id_is_free_idx ON video_jobs(user_id, is_free);
```

### 3. Environment Variables

Make sure these environment variables are set:

- `FREE_VIDEO_LIMIT=3` (or your preferred number)
- `NEXT_PUBLIC_CREEM_MONTHLY_PLAN_ID=your_creem_product_id`

### 4. How the System Works

1. **Free Tier**: Users get FREE_VIDEO_LIMIT (default 3) free videos
2. **Tracking**: video_jobs.is_free tracks whether a video was processed for free
3. **Subscription Check**: Before processing, system checks:
   - Does user have active subscription? → Unlimited access
   - Does user have lifetime subscription? → Unlimited access
   - Free videos remaining? → Allow if under limit
4. **Payment Flow**: When limit exceeded, pricing dialog shows $5/month subscription
5. **Webhook**: Creem.io webhook updates subscriptions table on successful payment

### 5. Testing the Integration

1. Run the SQL commands above in Supabase SQL Editor
2. Restart your application
3. Upload videos to test the free tier limit
4. Try clicking "Remove Watermark" after exceeding the limit
5. Verify the pricing dialog appears correctly

### Notes

- The subscriptions table is automatically populated by the Creem.io webhook
- The is_free column is set automatically during job creation based on subscription status
- All existing video_jobs will have is_free=TRUE by default
