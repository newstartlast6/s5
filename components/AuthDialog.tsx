"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { login, signup, signInWithGoogle } from "@/app/auth/actions";
import { toast } from "sonner";
import posthog from 'posthog-js';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        toast.error("Login failed", {
          description: result.error,
        });
        posthog.capture('auth_submitted', { type: 'login', method: 'email', success: false, error: result.error });
      } else {
        toast.success("Login successful", {
          description: "Welcome back! You've been signed in.",
        });
        onOpenChange(false);
        onSuccess?.();
        posthog.capture('auth_submitted', { type: 'login', method: 'email', success: true });
      }
    } catch (err) {
      const errorMsg = "An error occurred. Please try again.";
      setError(errorMsg);
      toast.error("Login failed", {
        description: errorMsg,
      });
      posthog.capture('auth_submitted', { type: 'login', method: 'email', success: false, error: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
        toast.error("Signup failed", {
          description: result.error,
        });
        posthog.capture('auth_submitted', { type: 'signup', method: 'email', success: false, error: result.error });
      } else {
        toast.success("Account created successfully", {
          description: "Welcome! Your account has been created. Please check your email to verify your account.",
        });
        onOpenChange(false);
        onSuccess?.();
        posthog.capture('auth_submitted', { type: 'signup', method: 'email', success: true });
      }
    } catch (err) {
      const errorMsg = "An error occurred. Please try again.";
      setError(errorMsg);
      toast.error("Signup failed", {
        description: errorMsg,
      });
      posthog.capture('auth_submitted', { type: 'signup', method: 'email', success: false, error: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    posthog.capture('auth_provider_clicked', { provider: 'google' });
    try {
      const result = await signInWithGoogle();
      if (result?.error) {
        setError(result.error);
        toast.error("Google sign-in failed", {
          description: result.error,
        });
        setIsLoading(false);
      }
    } catch (err) {
      const errorMsg = "Google sign-in failed. Please try again.";
      setError(errorMsg);
      toast.error("Google sign-in failed", {
        description: errorMsg,
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Sign in to remove watermarks from your videos
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleLogin(formData);
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSignup(formData);
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-primary/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-primary/20 hover:bg-primary/10 hover:border-primary/40"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
