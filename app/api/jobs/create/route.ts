import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Storage } from '@google-cloud/storage';
import { GoogleAuth } from 'google-auth-library';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gcsPath, filename, inpaintMethod = "opencv", thumbnailUrl = null } = await req.json();
    
    if (!gcsPath || !filename) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const FREE_VIDEO_LIMIT = parseInt(process.env.FREE_VIDEO_LIMIT || '3');

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      return NextResponse.json({ error: 'Failed to check subscription' }, { status: 500 });
    }

    const { count: freeVideosUsed, error: countError } = await supabase
      .from('video_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_free', true);

    if (countError) {
      console.error('Error counting free videos:', countError);
      return NextResponse.json({ error: 'Failed to check video count' }, { status: 500 });
    }

    const hasActiveSubscription = subscription?.status === 'active' || subscription?.is_lifetime === true;
    const freeVideosCount = freeVideosUsed || 0;
    
    if (!hasActiveSubscription && freeVideosCount >= FREE_VIDEO_LIMIT) {
      return NextResponse.json({ error: 'Free video limit exceeded. Please subscribe to continue.' }, { status: 403 });
    }

    const isFreeVideo = !hasActiveSubscription;

    const uploadBucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET!;
    const inputBucket = 'soraremover-sora-remover-input';
    const outputBucket = 'soraremover-sora-remover-output';
    const region = 'us-central1';
    const projectId = 'soraremover';

    const publicUrl = `https://storage.googleapis.com/${uploadBucket}/${gcsPath}`;
    
    const { data: job, error: dbError } = await supabase
      .from('video_jobs')
      .insert({
        user_id: user.id,
        input_url: publicUrl,
        filename: filename,
        status: 'uploaded',
        inpaint_method: inpaintMethod,
        gcs_input_path: gcsPath,
        thumbnail_url: thumbnailUrl,
        is_free: isFreeVideo,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
    }

    const storage = new Storage({
      projectId: projectId,
      credentials: JSON.parse(
        Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64!, 'base64').toString()
      ),
    });

    try {
      // Copy file to input bucket
      const sourceBucket = storage.bucket(uploadBucket);
      const destBucket = storage.bucket(inputBucket);
      
      const sourceFile = sourceBucket.file(gcsPath);
      const gcsInputPath = `${job.id}-${filename}`;
      const gcsOutputPath = `output-${job.id}-${filename}`;
      const destFile = destBucket.file(gcsInputPath);
      
      await sourceFile.copy(destFile);
      
      // Update database with paths
      await supabase
        .from('video_jobs')
        .update({ 
          gcs_input_path: gcsInputPath,
          gcs_output_path: gcsOutputPath,
        })
        .eq('id', job.id);
      
      const inputVideoUrl = `gs://${inputBucket}/${gcsInputPath}`;
      
      // Get access token
      const auth = new GoogleAuth({
        credentials: JSON.parse(
          Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64!, 'base64').toString()
        ),
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();
      
      if (!accessToken.token) {
        throw new Error('Failed to get access token');
      }

      // Execute Cloud Run Job via REST API
      const jobUrl = `https://${region}-run.googleapis.com/v2/projects/${projectId}/locations/${region}/jobs/sora-remover-service:run`;
      
      const response = await fetch(jobUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          overrides: {
            containerOverrides: [{
              env: [
                { name: 'JOB_ID', value: job.id },
                { name: 'INPUT_VIDEO_URL', value: inputVideoUrl },
                { name: 'GCS_OUTPUT_PATH', value: gcsOutputPath },
                { name: 'OUTPUT_BUCKET', value: outputBucket },
                { name: 'INPAINT_METHOD', value: inpaintMethod },
              ],
            }],
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloud Run error:', errorText);
        throw new Error(`Cloud Run API failed: ${response.status}`);
      }

      const execution = await response.json();
      const executionName = execution.name;
      
      await supabase
        .from('video_jobs')
        .update({ 
          job_id: executionName,
          status: 'processing' 
        })
        .eq('id', job.id);
      
      return NextResponse.json({
        success: true,
        jobId: job.id,
        cloudJobId: executionName,
        message: 'Processing started'
      });
      
    } catch (processError: any) {
      console.error('Processing error:', processError);
      
      await supabase
        .from('video_jobs')
        .update({ 
          status: 'failed',
          error_message: processError.message 
        })
        .eq('id', job.id);
      
      return NextResponse.json(
        { error: 'Failed to process', details: processError.message },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}