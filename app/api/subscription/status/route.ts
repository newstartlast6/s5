import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const FREE_VIDEO_LIMIT = parseInt(process.env.FREE_VIDEO_LIMIT || '3');

export async function GET() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    const { count: jobCount, error: countError } = await supabase
      .from('video_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_free', true);

    if (countError) {
      console.error('Error counting free videos:', countError);
      return NextResponse.json(
        { error: 'Failed to count videos' },
        { status: 500 }
      );
    }

    const freeVideosUsed = jobCount || 0;
    const freeVideosRemaining = Math.max(0, FREE_VIDEO_LIMIT - freeVideosUsed);
    const hasActiveSubscription = subscription?.status === 'active' || subscription?.is_lifetime === true;
    const hasUnlimitedAccess = hasActiveSubscription;

    return NextResponse.json({
      hasSubscription: hasActiveSubscription,
      isLifetime: subscription?.is_lifetime || false,
      videosLimit: subscription?.videos_limit || FREE_VIDEO_LIMIT,
      videosUsed: subscription?.videos_used || 0,
      freeVideosUsed,
      freeVideosRemaining,
      hasUnlimitedAccess,
      canProcessVideo: hasUnlimitedAccess || freeVideosRemaining > 0,
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
