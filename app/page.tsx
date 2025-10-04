"use client";

import { useState, useCallback } from "react";
import { Upload, FileVideo, X, Loader2, Droplets, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ThemeToggle from "@/components/ThemeToggle";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_DURATION = 30;
const ALLOWED_FORMATS = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  hasError: boolean;
}

function UploadZone({ onFileSelect, hasError }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="relative">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative min-h-96 border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden bg-card/30 backdrop-blur-sm",
          isDragging && "border-primary bg-primary/10 scale-[1.02]",
          hasError && "border-destructive bg-destructive/5 animate-shake",
          !isDragging && !hasError && "border-primary/60 hover:border-primary hover:bg-card/50"
        )}
        style={{
          boxShadow: isDragging 
            ? '0 0 60px rgba(11, 165, 172, 0.4), 0 0 120px rgba(11, 165, 172, 0.2)' 
            : '0 0 40px rgba(11, 165, 172, 0.25), 0 10px 40px rgba(0, 0, 0, 0.3)'
        }}
        data-testid="dropzone-upload"
      >
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          data-testid="input-file"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 pointer-events-none">
          <div className={cn(
            "relative transition-all duration-300",
            isDragging && "scale-110"
          )}>
            {isDragging ? (
              <>
                <FileVideo className="w-20 h-20 text-primary relative z-10" />
                <div className="absolute inset-0 blur-xl bg-primary/50 animate-pulse" />
              </>
            ) : (
              <>
                <Upload className="w-20 h-20 text-muted-foreground relative z-10" />
                <div className="absolute inset-0 blur-xl bg-primary/30" />
              </>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-foreground mb-2" data-testid="text-upload-instruction">
              Drag and drop your video
            </p>
            <p className="text-base text-muted-foreground" data-testid="text-upload-subtext">
              or click to browse
            </p>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span data-testid="badge-max-30-seconds">Max 30 seconds</span>
            <span className="text-border">•</span>
            <span data-testid="badge-up-to-100mb">Up to 100MB</span>
            <span className="text-border">•</span>
            <span data-testid="badge-mp4-mov-avi-webm">MP4, MOV, AVI, WebM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface VideoPreviewProps {
  videoUrl: string;
  onRemove: () => void;
  onRemoveWatermark: () => void;
}

function VideoPreview({ videoUrl, onRemove, onRemoveWatermark }: VideoPreviewProps) {
  return (
    <div className="relative">
      <div className="relative min-h-96 border-2 border-primary/60 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm"
        style={{
          boxShadow: '0 0 40px rgba(11, 165, 172, 0.25), 0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="absolute top-4 right-4 z-20 bg-background/80 hover:bg-background"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <div className="relative w-full aspect-video bg-black">
          <video 
            src={videoUrl}
            controls
            className="w-full h-full"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="p-6 space-y-3">
          <Button
            onClick={onRemoveWatermark}
            className="w-full relative overflow-hidden"
            size="lg"
          >
            Remove Watermark
          </Button>
          
          <Button
            onClick={() => window.open(videoUrl, '_blank')}
            variant="outline"
            className="w-full"
          >
            Download Original
          </Button>
        </div>
      </div>
    </div>
  );
}

interface UploadingStateProps {
  progress: number;
  fileName: string;
}

function UploadingState({ progress, fileName }: UploadingStateProps) {
  return (
    <div className="relative">
      <div className="relative min-h-96 border-2 border-primary rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm flex items-center justify-center"
        style={{
          boxShadow: '0 0 60px rgba(11, 165, 172, 0.4), 0 0 120px rgba(11, 165, 172, 0.2)'
        }}>
        <div className="text-center space-y-6 p-8">
          <div className="relative inline-block">
            <Loader2 className="w-20 h-20 text-primary animate-spin" />
            <div className="absolute inset-0 blur-xl bg-primary/50" />
          </div>
          
          <div>
            <p className="text-xl font-semibold mb-2">Uploading your video...</p>
            <p className="text-sm text-muted-foreground truncate max-w-md">{fileName}</p>
          </div>
          
          <div className="w-full max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="mt-4" data-testid="alert-error">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription data-testid="text-error-message">{message}</AlertDescription>
    </Alert>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Droplets className="w-6 h-6 text-primary" />
            <div className="absolute inset-0 blur-md bg-primary/50 -z-10" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Watermark Remover
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [gcsPath, setGcsPath] = useState<string>("");

  const validateFile = useCallback(async (file: File): Promise<string | null> => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 100MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`;
    }

    if (!ALLOWED_FORMATS.includes(file.type)) {
      return "Invalid file format. Please upload MP4, MOV, AVI, or WebM files.";
    }

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > MAX_DURATION) {
          resolve(`Video duration exceeds 30 seconds. Your video is ${Math.round(video.duration)} seconds long.`);
        } else {
          resolve(null);
        }
      };

      video.onerror = () => {
        resolve("Unable to read video file. Please try another file.");
      };

      video.src = URL.createObjectURL(file);
    });
  }, []);

  const startUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError("");
    
    try {
      const response = await fetch('/api/upload/generate-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate upload URL');
      }

      const { uploadUrl, downloadUrl, gcsPath: path } = await response.json();
      setGcsPath(path);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setVideoUrl(downloadUrl);
          setIsProcessing(false);
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed. Please try again.');
        setIsProcessing(false);
      });

      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);

    } catch (err) {
      setError('Upload failed. Please try again.');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setError("");
    setSelectedFile(null);
    setVideoUrl("");
    setUploadProgress(0);

    const validationError = await validateFile(file);
    
    if (validationError) {
      setError(validationError);
    } else {
      setSelectedFile(file);
      startUpload(file);
    }
  }, [validateFile, startUpload]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError("");
    setVideoUrl("");
    setUploadProgress(0);
    setGcsPath("");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 md:px-8">
        <section className="py-16 md:py-24 text-center relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-4" data-testid="heading-hero">
            <span className="text-foreground">Free </span>
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">Watermark Remover</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            <span className="text-primary font-medium">Remove watermarks instantly</span> with our advanced technology. Upload your video and get a clean, watermark-free version in seconds.
          </p>
        </section>

        <section className="max-w-3xl mx-auto pb-16">
          {!selectedFile && !isProcessing && !videoUrl && (
            <UploadZone onFileSelect={handleFileSelect} hasError={!!error} />
          )}
          
          {error && <ErrorMessage message={error} />}
          
          {isProcessing && selectedFile && !videoUrl && (
            <UploadingState
              progress={uploadProgress}
              fileName={selectedFile.name}
            />
          )}
          
          {videoUrl && (
            <VideoPreview
              videoUrl={videoUrl}
              onRemove={handleRemoveFile}
              onRemoveWatermark={() => alert('Watermark removal feature coming soon!')}
            />
          )}
        </section>
      </main>
    </div>
  );
}
