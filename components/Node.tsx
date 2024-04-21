import { INode } from "@/types";
import { useState, useEffect, useRef } from "react";
import { useEventListener } from "@/lib/hooks";
import { useDrag } from "@/lib/hooks";

export default function Node({
  node,
  setStartNodeRow,
  setStartNodeCol,
  setFinishNodeRow,
  setFinishNodeCol,
  moveStart,
  moveFinish,
  setMoveStart,
  setMoveFinish,
  freezeNode,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: {
  node: INode;
  setStartNodeRow: (row: number) => void;
  setStartNodeCol: (col: number) => void;
  setFinishNodeRow: (row: number) => void;
  setFinishNodeCol: (col: number) => void;
  moveStart: boolean;
  moveFinish: boolean;
  setMoveStart: (moveStart: boolean) => void;
  setMoveFinish: (moveFinish: boolean) => void;
  freezeNode: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onMouseUp: () => void;
}) {
  const { row, col, isStart, isFinish, isWall } = node;

  const { isDraggedOver, hoverRef } = useDrag(
    isStart,
    isFinish,
    row,
    col,
    setStartNodeRow,
    setStartNodeCol,
    setFinishNodeRow,
    setFinishNodeCol,
    moveStart,
    setMoveStart,
    moveFinish,
    setMoveFinish,
    freezeNode
  );

  const nodeColor = (() => {
    if (isStart) {
      return "bg-green-500";
    } else if (isFinish) {
      return "bg-red-500";
    } else if (isDraggedOver) {
      return "bg-gray-500";
    } else if (isWall) {
      return "bg-black";
    }
  })();

  return (
    <div className="square">
      <div
        draggable={isStart || isFinish}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
        ref={hoverRef}
        id={`node-${row}-${col}`}
        className={`square-content flex items-center justify-center outline outline-1 outline-black ${nodeColor}`}
      ></div>
    </div>
  );
}
