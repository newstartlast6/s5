"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Plus, Trash2, Play, Pause, Copy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mask } from "@/lib/types/mask";
import { v4 as uuidv4 } from "uuid";
import { MaskControlPanel } from "./MaskControlPanel";

interface VideoMaskEditorProps {
  videoUrl: string;
  onClose: () => void;
  onProcessMasks: (masks: Mask[]) => void;
}

export function VideoMaskEditor({ videoUrl, onClose, onProcessMasks }: VideoMaskEditorProps) {
  const [masks, setMasks] = useState<Mask[]>([]);
  const [selectedMaskId, setSelectedMaskId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentMask, setCurrentMask] = useState<Partial<Mask> | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragMode, setDragMode] = useState<"none" | "move" | "resize">("none");
  const [dragStart, setDragStart] = useState<{ x: number; y: number; maskState: Mask } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<"se" | "ne" | "sw" | "nw" | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCanvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Draw canvas overlay
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw active masks
    masks.forEach((mask) => {
      if (currentTime >= mask.startTime && currentTime <= mask.endTime) {
        const isSelected = mask.id === selectedMaskId;
        
        // Draw mask rectangle
        ctx.strokeStyle = isSelected ? "#0ba5ac" : "#0ba5ac80";
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.fillStyle = isSelected ? "#0ba5ac20" : "#0ba5ac10";
        ctx.fillRect(mask.x, mask.y, mask.width, mask.height);
        ctx.strokeRect(mask.x, mask.y, mask.width, mask.height);

        // Draw resize handles
        if (isSelected) {
          const handleSize = 8;
          ctx.fillStyle = "#0ba5ac";
          
          // Corner handles
          const corners = [
            { x: mask.x, y: mask.y }, // NW
            { x: mask.x + mask.width, y: mask.y }, // NE
            { x: mask.x, y: mask.y + mask.height }, // SW
            { x: mask.x + mask.width, y: mask.y + mask.height }, // SE
          ];
          
          corners.forEach((corner) => {
            ctx.fillRect(
              corner.x - handleSize / 2,
              corner.y - handleSize / 2,
              handleSize,
              handleSize
            );
          });
        }

        // Draw delete button (X) in top-right corner
        const deleteButtonSize = 24;
        const deleteButtonX = mask.x + mask.width - deleteButtonSize - 5;
        const deleteButtonY = mask.y + 5;
        
        // Draw delete button background
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(deleteButtonX + deleteButtonSize / 2, deleteButtonY + deleteButtonSize / 2, deleteButtonSize / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw X icon
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        const xOffset = 6;
        ctx.beginPath();
        ctx.moveTo(deleteButtonX + xOffset, deleteButtonY + xOffset);
        ctx.lineTo(deleteButtonX + deleteButtonSize - xOffset, deleteButtonY + deleteButtonSize - xOffset);
        ctx.moveTo(deleteButtonX + deleteButtonSize - xOffset, deleteButtonY + xOffset);
        ctx.lineTo(deleteButtonX + xOffset, deleteButtonY + deleteButtonSize - xOffset);
        ctx.stroke();

        // Draw label
        ctx.fillStyle = isSelected ? "#0ba5ac" : "#0ba5accc";
        ctx.font = "12px sans-serif";
        const maskLabel = `Mask ${masks.indexOf(mask) + 1}`;
        ctx.fillText(maskLabel, mask.x + 5, mask.y - 5);
      }
    });

    // Draw current drawing mask
    if (isDrawing && drawStart && currentMask) {
      ctx.strokeStyle = "#0ba5ac";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.fillStyle = "#0ba5ac20";
      ctx.fillRect(currentMask.x!, currentMask.y!, currentMask.width!, currentMask.height!);
      ctx.strokeRect(currentMask.x!, currentMask.y!, currentMask.width!, currentMask.height!);
      ctx.setLineDash([]);
    }
  }, [masks, selectedMaskId, currentTime, isDrawing, drawStart, currentMask]);

  // Initialize video and handle dimension syncing
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!video || !canvas || !container) return;

    const syncDimensions = () => {
      // Get the video's actual displayed dimensions
      const videoRect = video.getBoundingClientRect();
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      const newWidth = videoRect.width;
      const newHeight = videoRect.height;
      
      // Position canvas to match video position
      canvas.style.left = `${videoRect.left - container.getBoundingClientRect().left}px`;
      canvas.style.top = `${videoRect.top - container.getBoundingClientRect().top}px`;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
      
      // Update canvas dimensions (for drawing resolution)
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Scale masks if dimensions changed significantly
      if (oldWidth > 0 && oldHeight > 0 && (Math.abs(oldWidth - newWidth) > 1 || Math.abs(oldHeight - newHeight) > 1)) {
        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;
        
        setMasks((prevMasks) =>
          prevMasks.map((mask) => ({
            ...mask,
            x: mask.x * scaleX,
            y: mask.y * scaleY,
            width: mask.width * scaleX,
            height: mask.height * scaleY,
          }))
        );
      }
      
      // Store new size
      lastCanvasSizeRef.current = { width: newWidth, height: newHeight };
      
      // Redraw canvas
      drawCanvas();
    };

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      syncDimensions();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Use ResizeObserver to keep canvas synced with container
    const resizeObserver = new ResizeObserver(() => {
      syncDimensions();
    });
    resizeObserver.observe(container);

    // Initial sync
    if (video.readyState >= 2) {
      setVideoDuration(video.duration);
      syncDimensions();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      resizeObserver.disconnect();
    };
  }, [drawCanvas]);

  // Redraw canvas on changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Get mouse position relative to canvas
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Check if mouse is over resize handle
  const getResizeHandle = (x: number, y: number, mask: Mask): "se" | "ne" | "sw" | "nw" | null => {
    const handleSize = 8;
    const tolerance = 5;

    const corners = {
      nw: { x: mask.x, y: mask.y },
      ne: { x: mask.x + mask.width, y: mask.y },
      sw: { x: mask.x, y: mask.y + mask.height },
      se: { x: mask.x + mask.width, y: mask.y + mask.height },
    };

    for (const [handle, corner] of Object.entries(corners)) {
      if (
        Math.abs(x - corner.x) < handleSize + tolerance &&
        Math.abs(y - corner.y) < handleSize + tolerance
      ) {
        return handle as "se" | "ne" | "sw" | "nw";
      }
    }

    return null;
  };

  // Check if point is inside mask
  const isPointInMask = (x: number, y: number, mask: Mask): boolean => {
    return x >= mask.x && x <= mask.x + mask.width && y >= mask.y && y <= mask.y + mask.height;
  };

  // Check if point is on delete button
  const isPointOnDeleteButton = (x: number, y: number, mask: Mask): boolean => {
    const deleteButtonSize = 24;
    const deleteButtonX = mask.x + mask.width - deleteButtonSize - 5;
    const deleteButtonY = mask.y + 5;
    const centerX = deleteButtonX + deleteButtonSize / 2;
    const centerY = deleteButtonY + deleteButtonSize / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    return distance <= deleteButtonSize / 2;
  };

  // Mouse down handler
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    // Check if clicking on delete button first
    const maskToDelete = masks
      .filter((m) => currentTime >= m.startTime && currentTime <= m.endTime)
      .reverse()
      .find((m) => isPointOnDeleteButton(pos.x, pos.y, m));
    
    if (maskToDelete) {
      deleteMask(maskToDelete.id);
      return;
    }
    
    // Check if clicking on existing mask
    const clickedMask = masks
      .filter((m) => currentTime >= m.startTime && currentTime <= m.endTime)
      .reverse()
      .find((m) => {
        const handle = getResizeHandle(pos.x, pos.y, m);
        if (handle) {
          setDragMode("resize");
          setResizeHandle(handle);
          setSelectedMaskId(m.id);
          setDragStart({ x: pos.x, y: pos.y, maskState: { ...m } });
          return true;
        }
        if (isPointInMask(pos.x, pos.y, m)) {
          setDragMode("move");
          setSelectedMaskId(m.id);
          setDragStart({ x: pos.x, y: pos.y, maskState: { ...m } });
          return true;
        }
        return false;
      });

    if (clickedMask) return;

    // Start drawing new mask
    setIsDrawing(true);
    setDrawStart(pos);
    setSelectedMaskId(null);
    setCurrentMask({
      id: uuidv4(),
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      startTime: Math.max(0, currentTime - 3),
      endTime: Math.min(videoDuration, currentTime + 3),
      isActive: true,
    });
  };

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update cursor
    const hoveredMask = masks
      .filter((m) => currentTime >= m.startTime && currentTime <= m.endTime)
      .reverse()
      .find((m) => {
        // Check delete button first
        if (isPointOnDeleteButton(pos.x, pos.y, m)) {
          canvas.style.cursor = "pointer";
          return true;
        }
        const handle = getResizeHandle(pos.x, pos.y, m);
        if (handle) {
          const cursors = { se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize", nw: "nwse-resize" };
          canvas.style.cursor = cursors[handle];
          return true;
        }
        if (isPointInMask(pos.x, pos.y, m)) {
          canvas.style.cursor = "move";
          return true;
        }
        return false;
      });

    if (!hoveredMask && !isDrawing && dragMode === "none") {
      canvas.style.cursor = "crosshair";
    }

    // Handle drawing
    if (isDrawing && drawStart && currentMask) {
      const width = pos.x - drawStart.x;
      const height = pos.y - drawStart.y;
      
      setCurrentMask({
        ...currentMask,
        width: Math.abs(width),
        height: Math.abs(height),
        x: width < 0 ? pos.x : drawStart.x,
        y: height < 0 ? pos.y : drawStart.y,
      });
      drawCanvas();
    }

    // Handle moving
    if (dragMode === "move" && dragStart && selectedMaskId) {
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;
      
      setMasks((prev) =>
        prev.map((m) =>
          m.id === selectedMaskId
            ? {
                ...m,
                x: Math.max(0, Math.min(canvas.width - m.width, dragStart.maskState.x + deltaX)),
                y: Math.max(0, Math.min(canvas.height - m.height, dragStart.maskState.y + deltaY)),
              }
            : m
        )
      );
    }

    // Handle resizing
    if (dragMode === "resize" && dragStart && selectedMaskId && resizeHandle) {
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;
      const originalMask = dragStart.maskState;

      setMasks((prev) =>
        prev.map((m) => {
          if (m.id !== selectedMaskId) return m;

          let newX = m.x;
          let newY = m.y;
          let newWidth = m.width;
          let newHeight = m.height;

          switch (resizeHandle) {
            case "se":
              newWidth = Math.max(20, originalMask.width + deltaX);
              newHeight = Math.max(20, originalMask.height + deltaY);
              break;
            case "sw":
              newX = Math.min(originalMask.x + originalMask.width - 20, originalMask.x + deltaX);
              newWidth = Math.max(20, originalMask.width - deltaX);
              newHeight = Math.max(20, originalMask.height + deltaY);
              break;
            case "ne":
              newY = Math.min(originalMask.y + originalMask.height - 20, originalMask.y + deltaY);
              newWidth = Math.max(20, originalMask.width + deltaX);
              newHeight = Math.max(20, originalMask.height - deltaY);
              break;
            case "nw":
              newX = Math.min(originalMask.x + originalMask.width - 20, originalMask.x + deltaX);
              newY = Math.min(originalMask.y + originalMask.height - 20, originalMask.y + deltaY);
              newWidth = Math.max(20, originalMask.width - deltaX);
              newHeight = Math.max(20, originalMask.height - deltaY);
              break;
          }

          return { ...m, x: newX, y: newY, width: newWidth, height: newHeight };
        })
      );
    }
  };

  // Mouse up handler
  const handleMouseUp = () => {
    if (isDrawing && currentMask && currentMask.width! > 10 && currentMask.height! > 10) {
      setMasks((prev) => [...prev, currentMask as Mask]);
      setSelectedMaskId(currentMask.id!);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentMask(null);
    setDragMode("none");
    setDragStart(null);
    setResizeHandle(null);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const addNewMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2 - 100;
    const centerY = canvas.height / 2 - 75;

    const newMask: Mask = {
      id: uuidv4(),
      x: centerX,
      y: centerY,
      width: 200,
      height: 150,
      startTime: Math.max(0, currentTime - 3),
      endTime: Math.min(videoDuration, currentTime + 3),
      isActive: true,
    };

    setMasks((prev) => [...prev, newMask]);
    setSelectedMaskId(newMask.id);
  };

  const deleteMask = (maskId: string) => {
    setMasks((prev) => prev.filter((m) => m.id !== maskId));
    if (selectedMaskId === maskId) {
      setSelectedMaskId(null);
    }
  };

  const deleteAllMasks = () => {
    setMasks([]);
    setSelectedMaskId(null);
  };

  const duplicateMask = (maskId: string) => {
    const mask = masks.find((m) => m.id === maskId);
    if (!mask) return;

    const newMask: Mask = {
      ...mask,
      id: uuidv4(),
      x: mask.x + 20,
      y: mask.y + 20,
    };

    setMasks((prev) => [...prev, newMask]);
    setSelectedMaskId(newMask.id);
  };

  const updateMask = (maskId: string, updates: Partial<Mask>) => {
    setMasks((prev) => prev.map((m) => (m.id === maskId ? { ...m, ...updates } : m)));
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-auto">
      <div className="container mx-auto p-6 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Mask Editor
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Video and Canvas */}
          <div className="space-y-4">
            <Card className="relative overflow-hidden bg-black">
              <div ref={containerRef} className="relative flex items-center justify-center max-h-[70vh]">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="max-w-full max-h-[70vh] object-contain"
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ cursor: "crosshair" }}
                />
              </div>
            </Card>

            {/* Video Controls */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Button onClick={togglePlayPause} size="icon" variant="outline">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={videoDuration}
                    step={0.01}
                    value={currentTime}
                    onChange={(e) => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = parseFloat(e.target.value);
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <span className="text-sm text-muted-foreground min-w-24 text-right">
                  {currentTime.toFixed(1)}s / {videoDuration.toFixed(1)}s
                </span>
              </div>
            </Card>
          </div>

          {/* Mask Controls */}
          <MaskControlPanel
            masks={masks}
            selectedMaskId={selectedMaskId}
            videoDuration={videoDuration}
            currentTime={currentTime}
            onSelectMask={setSelectedMaskId}
            onUpdateMask={updateMask}
            onDeleteMask={deleteMask}
            onDuplicateMask={duplicateMask}
            onAddMask={addNewMask}
            onDeleteAll={deleteAllMasks}
            onProcess={() => onProcessMasks(masks)}
          />
        </div>
      </div>
    </div>
  );
}
