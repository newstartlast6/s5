"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Trash2, Plus, Copy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mask } from "@/lib/types/mask";

interface MaskControlPanelProps {
  masks: Mask[];
  selectedMaskId: string | null;
  videoDuration: number;
  currentTime: number;
  onSelectMask: (maskId: string) => void;
  onUpdateMask: (maskId: string, updates: Partial<Mask>) => void;
  onDeleteMask: (maskId: string) => void;
  onDuplicateMask: (maskId: string) => void;
  onAddMask: () => void;
  onDeleteAll: () => void;
  onProcess: () => void;
}

export function MaskControlPanel({
  masks,
  selectedMaskId,
  videoDuration,
  currentTime,
  onSelectMask,
  onUpdateMask,
  onDeleteMask,
  onDuplicateMask,
  onAddMask,
  onDeleteAll,
  onProcess,
}: MaskControlPanelProps) {
  const formatTime = (time: number) => {
    return `${time.toFixed(1)}s`;
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Button onClick={onAddMask} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Mask
          </Button>
          {masks.length > 0 && (
            <Button onClick={onDeleteAll} variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Masks List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Watermark Masks ({masks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {masks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No masks created yet</p>
              <p className="mt-2">Click &quot;Add Mask&quot; or draw on the video</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {masks.map((mask, index) => {
                const isSelected = mask.id === selectedMaskId;
                const isVisible = currentTime >= mask.startTime && currentTime <= mask.endTime;

                return (
                  <Card
                    key={mask.id}
                    className={cn(
                      "relative transition-all cursor-pointer",
                      isSelected && "ring-2 ring-primary shadow-lg"
                    )}
                    onClick={() => onSelectMask(mask.id)}
                  >
                    <CardContent className="p-3 space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Mask {index + 1}</span>
                        {isVisible && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateMask(mask.id);
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMask(mask.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Position & Size */}
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">X</Label>
                        <Input
                          type="number"
                          value={Math.round(mask.x)}
                          onChange={(e) => {
                            onUpdateMask(mask.id, { x: parseInt(e.target.value) || 0 });
                          }}
                          className="h-8 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Y</Label>
                        <Input
                          type="number"
                          value={Math.round(mask.y)}
                          onChange={(e) => {
                            onUpdateMask(mask.id, { y: parseInt(e.target.value) || 0 });
                          }}
                          className="h-8 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">W</Label>
                        <Input
                          type="number"
                          value={Math.round(mask.width)}
                          onChange={(e) => {
                            onUpdateMask(mask.id, { width: parseInt(e.target.value) || 1 });
                          }}
                          className="h-8 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">H</Label>
                        <Input
                          type="number"
                          value={Math.round(mask.height)}
                          onChange={(e) => {
                            onUpdateMask(mask.id, { height: parseInt(e.target.value) || 1 });
                          }}
                          className="h-8 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Time: {formatTime(mask.startTime)} - {formatTime(mask.endTime)}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          (Current: {formatTime(currentTime)})
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Start Time Slider */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Start</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  onUpdateMask(mask.id, {
                                    startTime: Math.max(0, mask.startTime - 3),
                                  });
                                }}
                              >
                                -3s
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  onUpdateMask(mask.id, {
                                    startTime: Math.min(mask.endTime - 0.1, mask.startTime + 3),
                                  });
                                }}
                              >
                                +3s
                              </Button>
                            </div>
                          </div>
                          <Slider
                            value={[mask.startTime]}
                            onValueChange={([value]) => {
                              onUpdateMask(mask.id, {
                                startTime: Math.min(value, mask.endTime - 0.1),
                              });
                            }}
                            min={0}
                            max={videoDuration}
                            step={0.1}
                            className="w-full"
                          />
                        </div>

                        {/* End Time Slider */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">End</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  onUpdateMask(mask.id, {
                                    endTime: Math.max(mask.startTime + 0.1, mask.endTime - 3),
                                  });
                                }}
                              >
                                -3s
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  onUpdateMask(mask.id, {
                                    endTime: Math.min(videoDuration, mask.endTime + 3),
                                  });
                                }}
                              >
                                +3s
                              </Button>
                            </div>
                          </div>
                          <Slider
                            value={[mask.endTime]}
                            onValueChange={([value]) => {
                              onUpdateMask(mask.id, {
                                endTime: Math.max(value, mask.startTime + 0.1),
                              });
                            }}
                            min={0}
                            max={videoDuration}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Help Text */}
          {masks.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-muted">
              <p className="text-xs text-muted-foreground">
                💡 <span className="font-medium">Tip:</span> Adjust the start and end time of each mask for better accuracy. The mask will only appear during its specified time range.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Button */}
      {masks.length > 0 && (
        <Button
          onClick={onProcess}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Remove Watermark
        </Button>
      )}
    </div>
  );
}
