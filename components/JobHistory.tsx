"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, Loader2, Download, Play, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import posthog from 'posthog-js';

export interface VideoJob {
  id: string;
  filename: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  input_url: string;
  output_url?: string;
  gcs_output_path?: string;
  thumbnail_url?: string;
}

interface JobHistoryProps {
  jobs: VideoJob[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export function JobHistory({ jobs, isLoading, onRefresh }: JobHistoryProps) {

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          label: 'Completed',
        };
      case 'processing':
        return {
          icon: Loader2,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          label: 'Processing',
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          label: 'Failed',
        };
      default:
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          label: 'Uploaded',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading job history...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="relative inline-block">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto" />
            <div className="absolute inset-0 blur-xl bg-primary/20" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No jobs yet</h3>
          <p className="text-muted-foreground">
            Upload a video to get started. Your watermark removal jobs will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 space-y-4 custom-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Job History</h2>
        <p className="text-muted-foreground">Track your watermark removal jobs</p>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => {
          const statusConfig = getStatusConfig(job.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card
              key={job.id}
              className={cn(
                "p-5 border-2 transition-all duration-300 hover:scale-[1.01] bg-card/50 backdrop-blur-sm",
                statusConfig.borderColor
              )}
              style={{
                boxShadow: '0 0 20px rgba(11, 165, 172, 0.15)'
              }}
            >
              <div className={cn("flex justify-between gap-4", job.thumbnail_url ? "items-center" : "items-start")}>
                <div className={cn("flex gap-4 flex-1 min-w-0", job.thumbnail_url ? "items-center" : "items-start")}>
                  {job.thumbnail_url ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/30">
                    <img 
                      src={job.thumbnail_url} 
                      alt={job.filename}
                      className="block w-full h-full object-cover"
                    />
                    <div className={cn(
                      "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-lg",
                      statusConfig.bgColor
                    )}>
                      <StatusIcon className={cn("w-4 h-4", statusConfig.color, job.status === 'processing' && "animate-spin")} />
                    </div>
                  </div>
                  
                  ) : (
                    <div className={cn(
                      "p-3 rounded-xl flex-shrink-0",
                      statusConfig.bgColor
                    )}>
                      <StatusIcon className={cn("w-6 h-6", statusConfig.color, job.status === 'processing' && "animate-spin")} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">{job.filename}</h3>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "border-2",
                          statusConfig.borderColor,
                          statusConfig.color
                        )}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(job.created_at), 'MMM dd, yyyy • h:mm a')}</span>
                    </div>

                    {job.status === 'processing' && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing your video...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {job.status === 'completed' && job.output_url && (
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        posthog.capture('job_download_clicked', { job_id: job.id, filename: job.filename });
                        const link = document.createElement('a');
                        link.href = job.output_url;
                        link.download = job.filename || 'video.mp4';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                  
                  {job.status === 'failed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={() => {
                        posthog.capture('job_retry_clicked', { job_id: job.id, filename: job.filename });
                        toast.error('Job failed', {
                          description: 'Please try uploading your video again.'
                        });
                      }}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
