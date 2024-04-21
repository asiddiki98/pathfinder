import { useState, useRef, useEffect } from "react";
import { useEventListener } from "@/lib/hooks";
function useDrag(
  isStart: boolean,
  isFinish: boolean,
  row: number,
  col: number,
  setStartNodeRow: (row: number) => void,
  setStartNodeCol: (col: number) => void,
  setFinishNodeRow: (row: number) => void,
  setFinishNodeCol: (col: number) => void,
  moveStart: boolean,
  setMoveStart: (moveStart: boolean) => void,
  moveFinish: boolean,
  setMoveFinish: (moveFinish: boolean) => void,
  freezeNode: boolean
) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const hoverRef = useRef<HTMLDivElement>(null);
  const resetMove = () => {
    if (moveStart) {
      setMoveStart(false);
    }
    if (moveFinish) {
      setMoveFinish(false);
    }
  };

  const dragStart = (e: DragEvent) => {
    if (freezeNode) return;
    if (isStart) {
      setMoveStart(true);
    }
    if (isFinish) {
      setMoveFinish(true);
    }
  };
  const dragOver = (e: DragEvent) => {
    e.preventDefault();
    if (freezeNode) return;
    if (!isStart && !isFinish) {
      setIsDraggedOver(true);
    }
  };

  const dragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (freezeNode) return;
    if (!isStart && !isFinish) {
      setIsDraggedOver(true);
    }
  };

  const dragLeave = (e: DragEvent) => {
    e.preventDefault();
    if (freezeNode) return;
    setIsDraggedOver(false);
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    if (freezeNode) return;
    setIsDraggedOver(false);

    if (moveStart) {
      setMoveStart(false);
      if (isFinish) return;
      setStartNodeRow(row);
      setStartNodeCol(col);
    }
    if (moveFinish) {
      setMoveFinish(false);
      if (isStart) return;
      setFinishNodeRow(row);
      setFinishNodeCol(col);
    }

    setMoveFinish(false);
    setMoveStart(false);
  };
  useEventListener("dragstart", dragStart, hoverRef);
  useEventListener("dragover", dragOver, hoverRef);
  useEventListener("dragenter", dragEnter, hoverRef);
  useEventListener("dragleave", dragLeave, hoverRef);
  useEventListener("drop", drop, hoverRef);

  // Setup a global event listener for dragend
  useEffect(() => {
    window.addEventListener("dragend", resetMove);
    return () => {
      window.removeEventListener("dragend", resetMove);
    };
  }); // Dependencies to ensure updates if these values change

  return { hoverRef, isDraggedOver };
}

export default useDrag;
