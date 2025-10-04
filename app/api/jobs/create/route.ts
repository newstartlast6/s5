import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Storage } from '@google-cloud/storage';
import { JobsClient } from '@google-cloud/run';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { gcsPath, filename, inpaintMethod = 'opencv' } = await req.json();
    
    if (!gcsPath || !filename) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const uploadBucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET!;
    const inputBucket = process.env.GOOGLE_CLOUD_INPUT_BUCKET || 'soraremover-sora-remover-input';
    const outputBucket = process.env.GOOGLE_CLOUD_OUTPUT_BUCKET || 'soraremover-sora-remover-output';
    const region = process.env.GOOGLE_CLOUD_REGION || 'us-central1';

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
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save job to database' },
        { status: 500 }
      );
    }

    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: JSON.parse(
        Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64!, 'base64').toString()
      ),
    });

    try {
      const sourceBucket = storage.bucket(uploadBucket);
      const destBucket = storage.bucket(inputBucket);
      
      const sourceFile = sourceBucket.file(gcsPath);
      const destFileName = `${job.id}-${filename}`;
      const destFile = destBucket.file(destFileName);
      
      await sourceFile.copy(destFile);
      
      const inputVideoUrl = `gs://${inputBucket}/${destFileName}`;
      const outputVideoUrl = `gs://${outputBucket}/output-${destFileName}`;
      
      // Update the job with GCS paths
      await supabase
        .from('video_jobs')
        .update({ 
          gcs_input_path: destFileName,
          gcs_output_path: `output-${destFileName}`,
        })
        .eq('id', job.id);
      
      // Use Google Cloud Run SDK to trigger the job
      const jobsClient = new JobsClient({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentials: JSON.parse(
          Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64!, 'base64').toString()
        ),
      });

      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
      const jobName = `projects/${projectId}/locations/${region}/jobs/sora-remover-service`;

      // Run the job with environment variables
      const operation: any = await jobsClient.runJob({
        name: jobName,
        overrides: {
          containerOverrides: [{
            env: [
              { name: 'INPUT_VIDEO_URL', value: inputVideoUrl },
              { name: 'OUTPUT_VIDEO_URL', value: outputVideoUrl },
              { name: 'INPAINT_METHOD', value: inpaintMethod },
              { name: 'JOB_ID', value: job.id },
            ],
          }],
          timeout: { seconds: 3600 },
        },
      } as any);

      const executionName = operation[0]?.name || operation.name || null;
      
      if (executionName) {
        await supabase
          .from('video_jobs')
          .update({ 
            job_id: executionName,
            status: 'processing' 
          })
          .eq('id', job.id);
      }
      
      return NextResponse.json({
        success: true,
        jobId: job.id,
        cloudJobId: executionName,
        message: 'Job created successfully'
      });
      
    } catch (processError: any) {
      console.error('Error copying file or executing Cloud Run job:', processError);
      
      await supabase
        .from('video_jobs')
        .update({ status: 'failed' })
        .eq('id', job.id);
      
      return NextResponse.json(
        { error: 'Job failed' },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
