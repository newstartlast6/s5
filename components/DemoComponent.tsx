"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

export function DemoComponent() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-primary/20">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                See how it works
              </h3>
              <p className="text-muted-foreground">
                This is a demo of what you can create with this tool. Try it yourself by creating a new task!
              </p>
            </div>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-primary/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 blur-2xl bg-primary/30 animate-pulse" />
                  <Play className="w-16 h-16 text-primary relative z-10" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Demo video coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
