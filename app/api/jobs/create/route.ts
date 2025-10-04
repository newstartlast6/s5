import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Storage } from '@google-cloud/storage';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
        url: publicUrl,
        filename: filename,
        status: 'uploaded',
        inpaint_method: inpaintMethod,
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
      
      const cloudRunCommand = `gcloud run jobs execute sora-remover-service --region ${region} --set-env-vars INPUT_VIDEO_URL=${inputVideoUrl},OUTPUT_VIDEO_URL=${outputVideoUrl},INPAINT_METHOD=${inpaintMethod},JOB_ID=${job.id}`;
      
      const { stdout, stderr } = await execAsync(cloudRunCommand);
      
      const jobIdMatch = stdout.match(/Job execution created: (.+)/);
      const cloudJobId = jobIdMatch ? jobIdMatch[1] : null;
      
      if (cloudJobId) {
        await supabase
          .from('video_jobs')
          .update({ 
            job_id: cloudJobId,
            status: 'processing' 
          })
          .eq('id', job.id);
      }
      
      return NextResponse.json({
        success: true,
        jobId: job.id,
        cloudJobId: cloudJobId,
        message: 'Job created and Cloud Run job triggered successfully'
      });
      
    } catch (copyError: any) {
      console.error('Error copying file or executing Cloud Run job:', copyError);
      
      await supabase
        .from('video_jobs')
        .update({ status: 'failed' })
        .eq('id', job.id);
      
      return NextResponse.json(
        { 
          error: 'Failed to process job',
          details: copyError.message 
        },
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
