"use client";

import { useState } from "react";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import posthog from 'posthog-js';

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
  userId?: string;
}

export default function PricingDialog({ open, onOpenChange, userEmail, userId }: PricingDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!userId || !userEmail) {
      toast.error("Please sign in to subscribe");
      return;
    }

    posthog.capture('subscription_initiated', { price: 5, currency: 'USD', interval: 'month' });
    setIsProcessing(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pId: process.env.NEXT_PUBLIC_CREEM_MONTHLY_PLAN_ID,
          userId,
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkout?.checkout_url) {
        window.location.href = data.checkout.checkout_url;
      } else {
        toast.error("Failed to create checkout session");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-primary/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            You've reached your free video limit. Upgrade to continue removing watermarks!
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-6 mb-6">
          <div className={cn(
            "relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 transition-all duration-300",
            "hover:border-primary/60 hover:shadow-[0_0_40px_rgba(11,165,172,0.3)]"
          )}>
            <div className="absolute top-4 right-4">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>

            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-foreground">$5</span>
                <span className="text-xl text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Unlimited watermark removal</p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Unlimited video processing",
                "AI-powered watermark detection",
                "High-quality output",
                "Fast processing speed",
                "Priority support",
                "No watermarks on output"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className={cn(
                "w-full h-12 text-base font-semibold",
                "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                "shadow-[0_0_20px_rgba(11,165,172,0.3)] hover:shadow-[0_0_30px_rgba(11,165,172,0.5)]",
                "transition-all duration-300"
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Subscribe Now
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Maybe later
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Secure payment powered by Creem
        </p>
      </DialogContent>
    </Dialog>
  );
}
