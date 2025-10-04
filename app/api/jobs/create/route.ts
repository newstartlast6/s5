import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Storage } from "@google-cloud/storage";
import { JobsClient } from "@google-cloud/run";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gcsPath, filename, inpaintMethod = "opencv", thumbnailUrl = null } = await req.json();

    if (!gcsPath || !filename) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const uploadBucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET!;
    const inputBucket =
      process.env.GOOGLE_CLOUD_INPUT_BUCKET || "soraremover-sora-remover-input";
    const outputBucket =
      process.env.GOOGLE_CLOUD_OUTPUT_BUCKET ||
      "soraremover-sora-remover-output";
    const region = process.env.GOOGLE_CLOUD_REGION || "us-central1";

    const publicUrl = `https://storage.googleapis.com/${uploadBucket}/${gcsPath}`;

    // Create initial job record
    const { data: job, error: dbError } = await supabase
      .from("video_jobs")
      .insert({
        user_id: user.id,
        input_url: publicUrl,
        filename: filename,
        status: "uploaded",
        inpaint_method: inpaintMethod,
        gcs_input_path: gcsPath,
        thumbnail_url: thumbnailUrl,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save job to database" },
        { status: 500 },
      );
    }

    // Initialize Google Cloud Storage
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: JSON.parse(
        Buffer.from(
          process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64!,
          "base64",
        ).toString(),
      ),
    });

    try {
      // Copy file from upload bucket to input bucket
      const sourceBucket = storage.bucket(uploadBucket);
      const destBucket = storage.bucket(inputBucket);

      const sourceFile = sourceBucket.file(gcsPath);
      const destFileName = `${job.id}-${filename}`;
      const destFile = destBucket.file(destFileName);

      await sourceFile.copy(destFile);

      // Construct GCS URIs for the Cloud Run job
      const inputVideoUrl = `gs://${inputBucket}/${destFileName}`;
      const gcsOutputPath = `output-${destFileName}`;

      // Initialize Cloud Run Jobs client
      const jobsClient = new JobsClient({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentials: JSON.parse(
          Buffer.from(
            process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64!,
            "base64",
          ).toString(),
        ),
      });

      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
      const jobName = `projects/${projectId}/locations/${region}/jobs/sora-remover-service`;

      // Run the Cloud Run job with correct environment variables
      const operation: any = await jobsClient.runJob({
        name: jobName,
        overrides: {
          containerOverrides: [
            {
              env: [
                { name: "INPUT_VIDEO_URL", value: inputVideoUrl },
                { name: "GCS_OUTPUT_PATH", value: gcsOutputPath }, // ✓ Fixed variable name
                { name: "OUTPUT_BUCKET", value: outputBucket }, // ✓ Added missing variable
                { name: "INPAINT_METHOD", value: inpaintMethod },
                { name: "JOB_ID", value: job.id },
                // Pass Supabase credentials to the Cloud Run job
                { name: "SUPABASE_URL", value: process.env.SUPABASE_URL || "" },
                {
                  name: "SUPABASE_SERVICE_ROLE_KEY",
                  value: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
                },
              ],
            },
          ],
          timeout: { seconds: 3600 },
        },
      } as any);

      const executionName = operation[0]?.name || operation.name || null;

      // Update job with all info in a single query
      if (executionName) {
        await supabase
          .from("video_jobs")
          .update({
            gcs_input_path: destFileName,
            gcs_output_path: gcsOutputPath,
            job_id: executionName,
            status: "processing",
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      } else {
        // If we didn't get an execution name, just update the paths
        await supabase
          .from("video_jobs")
          .update({
            gcs_input_path: destFileName,
            gcs_output_path: gcsOutputPath,
            status: "processing",
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }

      return NextResponse.json({
        success: true,
        jobId: job.id,
        cloudJobId: executionName,
        message: "Job created and processing started",
      });
    } catch (processError: any) {
      console.error(
        "Error copying file or executing Cloud Run job:",
        processError,
      );

      // Update job status to failed with error details
      await supabase
        .from("video_jobs")
        .update({
          status: "failed",
          error_message: processError.message || "Failed to start processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      return NextResponse.json(
        {
          error: "Failed to start job processing",
          details: processError.message,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
