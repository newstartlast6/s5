export interface Mask {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  startTime: number;
  endTime: number;
  isActive: boolean;
}

export interface MaskEditorState {
  masks: Mask[];
  selectedMaskId: string | null;
  isDrawing: boolean;
  videoDuration: number;
  currentTime: number;
}
