"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, FileVideo, X, Loader2, Droplets, AlertCircle, User as UserIcon, LogOut, Sparkles, Wand2, ChevronDown, MousePointerClick, Download, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DemoComponent } from "@/components/DemoComponent";
import { AuthDialog } from "@/components/AuthDialog";
import { JobHistory, type VideoJob } from "@/components/JobHistory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/auth/actions";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

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
  isSubmitting?: boolean;
}

function VideoPreview({ videoUrl, onRemove, onRemoveWatermark, isSubmitting = false }: VideoPreviewProps) {
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    
    video.onloadedmetadata = () => {
      const isPortrait = video.videoHeight > video.videoWidth;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
      setIsLoaded(true);
    };
  }, [videoUrl]);

  return (
    <div className="h-full flex items-center justify-center p-8 animate-in fade-in slide-in-from-left duration-500">
      <div className="w-full max-w-4xl space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="bg-background/20 hover:bg-background/40 backdrop-blur-sm cursor-pointer transition-all hover:scale-105"
          disabled={isSubmitting}
        >
          <X className="w-4 h-4 mr-2" />
          Start Over
        </Button>
        
        <div className="relative rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm border-2 border-primary/60"
          style={{
            boxShadow: '0 0 40px rgba(11, 165, 172, 0.25), 0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
          <div className={cn(
            "relative bg-black",
            orientation === 'portrait' ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video'
          )}>
            <video 
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="p-6 space-y-3">
            <Button
              onClick={onRemoveWatermark}
              className="w-full relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="relative z-10">Starting Processing...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Remove Watermark</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                </>
              )}
            </Button>
          </div>
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

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

function Header({ user, onSignOut }: HeaderProps) {
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
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Remove watermarks from your videos in three simple steps
        </p>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0" />
        
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <Card className="group relative overflow-hidden border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 relative text-center">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-2xl text-primary-foreground border-4 border-background shadow-lg">
                1
              </div>
              
              <div className="mt-8 mb-6 relative inline-block">
                <div className="absolute inset-0 blur-2xl bg-primary/60 animate-pulse" />
                <div className="relative bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-10 h-10 text-primary relative z-10" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-foreground">Upload Video</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drag and drop your video file or click to browse. Supports MP4, MOV, AVI, and WebM formats.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 relative text-center">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-2xl text-primary-foreground border-4 border-background shadow-lg">
                2
              </div>
              
              <div className="mt-8 mb-6 relative inline-block">
                <div className="absolute inset-0 blur-2xl bg-primary/60 animate-pulse" />
                <div className="relative bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
                  <MousePointerClick className="w-10 h-10 text-primary relative z-10" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-foreground">Remove Watermark</h3>
              <p className="text-muted-foreground leading-relaxed">
                Click the "Remove Watermark" button and our AI will process your video in seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 relative text-center">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-2xl text-primary-foreground border-4 border-background shadow-lg">
                3
              </div>
              
              <div className="mt-8 mb-6 relative inline-block">
                <div className="absolute inset-0 blur-2xl bg-primary/60 animate-pulse" />
                <div className="relative bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
                  <Download className="w-10 h-10 text-primary relative z-10" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-foreground">Download Result</h3>
              <p className="text-muted-foreground leading-relaxed">
                Once processing is complete, download your clean, watermark-free video instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-20 md:py-28 bg-card/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our watermark removal service
          </p>
        </div>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
          <AccordionItem value="item-1" className="border-2 border-primary/20 rounded-xl px-6 bg-card/50 backdrop-blur-sm">
            <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors hover:no-underline">
              Does this work with all Sora videos?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Yes! Our tool is specifically designed to detect and remove Sora watermarks from any video, regardless of resolution or length.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-2 border-primary/20 rounded-xl px-6 bg-card/50 backdrop-blur-sm">
            <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors hover:no-underline">
              Will the video quality be affected?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              No. We use advanced AI inpainting techniques that remove the watermark while preserving the original video quality. The result is indistinguishable from the original unwatermarked footage.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-2 border-primary/20 rounded-xl px-6 bg-card/50 backdrop-blur-sm">
            <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors hover:no-underline">
              How long does processing take?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Processing time varies based on video length and complexity, typically ranging from 30 seconds to 2 minutes. You'll see real-time progress updates during processing.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-2 border-primary/20 rounded-xl px-6 bg-card/50 backdrop-blur-sm">
            <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors hover:no-underline">
              Is this tool private and secure?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Absolutely. Your videos are automatically deleted after 24 hours and we don't store any personal information. The tool is completely private and safe to use.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 md:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Droplets className="w-6 h-6 text-primary" />
                <div className="absolute inset-0 blur-md bg-primary/50 -z-10" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Watermark Remover
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Remove Sora watermarks from your videos instantly with AI-powered technology.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">AI Detection</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Smart Removal</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Quality Preservation</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Fast Processing</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">FAQ</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Watermark Remover. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [gcsPath, setGcsPath] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('/api/jobs/list');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    
    const savedVideoUrl = localStorage.getItem('videoUrl');
    const savedGcsPath = localStorage.getItem('gcsPath');
    const savedFileName = localStorage.getItem('uploadedFileName');
    const savedThumbnailUrl = localStorage.getItem('thumbnailUrl');
    
    if (savedVideoUrl && savedGcsPath) {
      setVideoUrl(savedVideoUrl);
      setGcsPath(savedGcsPath);
      if (savedFileName) {
        setUploadedFileName(savedFileName);
      }
      if (savedThumbnailUrl) {
        setThumbnailUrl(savedThumbnailUrl);
      }
    }

    if (window.location.search.includes('code=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    const supabase = createClient();
    
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        setIsLoadingUser(false);
        if (user) {
          setIsLoadingJobs(true);
          fetchJobs();
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);
        if (newUser) {
          setIsLoadingJobs(true);
          fetchJobs();
        } else {
          setJobs([]);
          setIsLoadingJobs(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setIsLoadingUser(false);
    }
  }, [fetchJobs]);

  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, [user, fetchJobs]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

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

  const generateThumbnail = useCallback(async (videoFile: File): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadeddata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        video.currentTime = 0.1;
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(video.src);
            resolve(blob);
          }, 'image/jpeg', 0.8);
        } else {
          resolve(null);
        }
      };

      video.onerror = () => {
        resolve(null);
      };

      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  }, []);

  const uploadThumbnail = useCallback(async (thumbnailBlob: Blob, videoFileName: string): Promise<string | null> => {
    try {
      const thumbnailFileName = `thumbnail-${videoFileName.replace(/\.[^.]+$/, '.jpg')}`;
      
      const response = await fetch('/api/upload/generate-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: thumbnailFileName,
          contentType: 'image/jpeg',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate thumbnail upload URL');
      }

      const { uploadUrl, downloadUrl } = await response.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: thumbnailBlob,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload thumbnail');
      }

      return downloadUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
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

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          setVideoUrl(downloadUrl);
          setUploadedFileName(file.name);
          localStorage.setItem('videoUrl', downloadUrl);
          localStorage.setItem('gcsPath', path);
          localStorage.setItem('uploadedFileName', file.name);
          
          const thumbnailBlob = await generateThumbnail(file);
          if (thumbnailBlob) {
            const thumbnailUrl = await uploadThumbnail(thumbnailBlob, file.name);
            if (thumbnailUrl) {
              setThumbnailUrl(thumbnailUrl);
              localStorage.setItem('thumbnailUrl', thumbnailUrl);
            }
          }
          
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
    setUploadedFileName("");
    setThumbnailUrl("");
    localStorage.removeItem('videoUrl');
    localStorage.removeItem('gcsPath');
    localStorage.removeItem('uploadedFileName');
    localStorage.removeItem('thumbnailUrl');
  }, []);

  const createJobAndTrigger = useCallback(async () => {
    if (!gcsPath || !uploadedFileName) {
      setError("Missing video information. Please upload a video first.");
      return;
    }

    setIsSubmittingJob(true);
    setError("");

    try {
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gcsPath,
          filename: uploadedFileName,
          inpaintMethod: 'opencv',
          thumbnailUrl: thumbnailUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      toast.success('Processing started!', {
        description: 'Your video is being processed. You will be notified when it\'s ready.',
      });

      await fetchJobs();
      
      handleRemoveFile();

    } catch (err: any) {
      setError(err.message || 'Failed to start processing. Please try again.');
      toast.error('Failed to start processing', {
        description: err.message || 'Please try again.',
      });
    } finally {
      setIsSubmittingJob(false);
    }
  }, [gcsPath, uploadedFileName, thumbnailUrl, fetchJobs, handleRemoveFile]);

  const handleRemoveWatermark = useCallback(() => {
    if (user) {
      createJobAndTrigger();
    } else {
      setShowAuthDialog(true);
    }
  }, [user, createJobAndTrigger]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onSignOut={handleSignOut} />
      </div>
    );
  }

  const hasJobs = jobs.length > 0;
  const shouldShowSplitView = videoUrl || hasJobs;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} onSignOut={handleSignOut} />
      
      {!shouldShowSplitView ? (
        <>
          <main className="container mx-auto px-6 md:px-8 flex-1">
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
              {!selectedFile && !isProcessing && (
                <UploadZone onFileSelect={handleFileSelect} hasError={!!error} />
              )}
              
              {error && <ErrorMessage message={error} />}
              
              {isProcessing && selectedFile && (
                <UploadingState
                  progress={uploadProgress}
                  fileName={selectedFile.name}
                />
              )}
            </section>

            <HowItWorks />
          </main>
          
          <FAQ />
          <Footer />
        </>
      ) : (
        <main className="h-[calc(100vh-4rem)]">
          <div className="grid grid-cols-2 h-full divide-x divide-border">
            <div className="relative">
              {videoUrl ? (
                <VideoPreview
                  videoUrl={videoUrl}
                  onRemove={handleRemoveFile}
                  onRemoveWatermark={handleRemoveWatermark}
                  isSubmitting={isSubmittingJob}
                />
              ) : (
                <div className="p-8 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Upload Video
                    </h2>
                    <p className="text-muted-foreground">
                      Remove watermarks from your videos instantly
                    </p>
                  </div>

                  {!selectedFile && !isProcessing && (
                    <UploadZone onFileSelect={handleFileSelect} hasError={!!error} />
                  )}
                  
                  {error && <ErrorMessage message={error} />}
                  
                  {isProcessing && selectedFile && (
                    <UploadingState
                      progress={uploadProgress}
                      fileName={selectedFile.name}
                    />
                  )}
                </div>
              )}
            </div>
            
            <div className="relative animate-in fade-in slide-in-from-right duration-500">
              {user && hasJobs ? (
                <JobHistory jobs={jobs} isLoading={isLoadingJobs} onRefresh={fetchJobs} />
              ) : (
                <DemoComponent />
              )}
            </div>
          </div>
        </main>
      )}

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={createJobAndTrigger}
      />
    </div>
  );
}
