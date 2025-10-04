"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchase: () => void;
}

export default function PricingDialog({ open, onOpenChange, onPurchase }: PricingDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    await onPurchase();
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Remove Watermarks
          </DialogTitle>
          <DialogDescription className="text-center">
            Get unlimited watermark removal for just $5
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="relative rounded-xl border-2 border-primary bg-primary/5 p-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                BEST VALUE
              </span>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-foreground">
                $5
              </div>
              <div className="text-muted-foreground mt-1">
                one-time payment
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">Unlimited watermark removals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">Lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">HD quality output</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">No subscription required</span>
              </div>
            </div>

            <Button 
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? "Processing..." : "Get Unlimited Access"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment powered by Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
