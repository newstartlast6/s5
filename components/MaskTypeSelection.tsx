"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaskTypeSelectionProps {
  onSelect: (type: "manual" | "ai") => void;
}

export function MaskTypeSelection({ onSelect }: MaskTypeSelectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
          Choose Mask Creation Method
        </h2>
        <p className="text-muted-foreground">
          Select how you'd like to create masks for watermark removal
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
          onClick={() => onSelect("manual")}
        >
          <CardContent className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MousePointerClick className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-3">Manual</h3>
            <p className="text-muted-foreground mb-6">
              Draw and position masks precisely where you want them. Full control over size, position, and duration.
            </p>
            <ul className="text-sm text-left space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Draw masks with click and drag
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Resize and reposition easily
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Set precise time ranges
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Add multiple masks
              </li>
            </ul>
            <Button className="w-full" size="lg">
              Select Manual
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 relative"
          onClick={() => onSelect("ai")}
        >
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold">
            Coming Soon
          </div>
          <CardContent className="p-8 text-center opacity-60">
            <div className="mb-6 flex justify-center">
              <div className="p-6 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Wand2 className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-3">AI Assisted</h3>
            <p className="text-muted-foreground mb-6">
              Let AI automatically detect and mask watermarks. Quick and effortless processing.
            </p>
            <ul className="text-sm text-left space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Automatic watermark detection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Smart mask generation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                One-click processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Time-saving automation
              </li>
            </ul>
            <Button className="w-full" size="lg" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
