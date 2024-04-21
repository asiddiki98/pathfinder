"use client";
import { useState, useEffect, useRef } from "react";
import Node from "./Node";
import {
  getInitialGrid,
  getNewGridWithWallToggled,
  getNodesInShortestPathOrder,
} from "@/lib/helper.ts";
import { INode } from "@/types";
import { Dijkstra } from "@/lib/algorithms";

export default function Grid() {
  const [grid, setGrid] = useState<INode[][]>([]);
  const [moveStart, setMoveStart] = useState<boolean>(false);
  const [moveFinish, setMoveFinish] = useState<boolean>(false);
  const [startNodeRow, setStartNodeRow] = useState<number>(10);
  const [startNodeCol, setStartNodeCol] = useState<number>(5);
  const [finishNodeRow, setFinishNodeRow] = useState<number>(10);
  const [finishNodeCol, setFinishNodeCol] = useState<number>(45);
  const [freezeGrid, setFreezeGrid] = useState<boolean>(false);
  const [mouseIsPressed, setMouseIsPressed] = useState<boolean>(false);

  const timeoutIds = useRef<(number | NodeJS.Timeout)[]>([]);

  const handleReset = () => {
    // Clear all timeouts to stop ongoing animations
    timeoutIds.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutIds.current = [];
    // Reset the grid to its initial state
    const initialGrid = getInitialGrid(
      [startNodeRow, startNodeCol],
      [finishNodeRow, finishNodeCol]
    );

    setGrid(initialGrid);
    setFreezeGrid(false);

    // setStartNodeRow(10);
    // setStartNodeCol(5);
    // setFinishNodeRow(10);
    // setFinishNodeCol(45);

    // Optionally, reset visual state of each node
    initialGrid.flat().forEach((node) => {
      const nodeElement = document.getElementById(
        `node-${node.row}-${node.col}`
      );
      if (nodeElement) {
        nodeElement.classList.remove("bg-blue-300", "bg-yellow-300");
      }
    });
  };

  const handleStartVisualizing = () => {
    // handleReset();
    const visitedNodesInOrder = Dijkstra(
      grid,
      grid[startNodeRow][startNodeCol],
      grid[finishNodeRow][finishNodeCol]
    );

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(
      grid[finishNodeRow][finishNodeCol]
    );
    // if path is blocked or no path exists alert the user
    if (nodesInShortestPathOrder.length === 1) {
      alert("No path found");
      return;
    }

    animate(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const animate = (
    visitedNodesInOrder: INode[],
    nodesInShortestPathOrder: INode[]
  ) => {
    setFreezeGrid(true);
    visitedNodesInOrder.forEach((node, i) => {
      const timeoutId = setTimeout(() => {
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        if (nodeElement && !node.isStart && !node.isFinish) {
          nodeElement.classList.add("bg-blue-300");
        }
        if (i === visitedNodesInOrder.length - 1) {
          animateShortestPath(nodesInShortestPathOrder);
        }
      }, 10 * i);
      timeoutIds.current.push(timeoutId);
    });
  };

  const animateShortestPath = (nodesInShortestPathOrder: INode[]) => {
    nodesInShortestPathOrder.forEach((node, i) => {
      const timeoutId = setTimeout(() => {
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        if (nodeElement && !node.isStart && !node.isFinish) {
          nodeElement.classList.add("bg-yellow-300");
        }
      }, 50 * i);
      timeoutIds.current.push(timeoutId);
    });
  };

  useEffect(() => {
    const initialGrid: INode[][] = getInitialGrid(
      [startNodeRow, startNodeCol],
      [finishNodeRow, finishNodeCol]
    );
    setGrid(initialGrid);
  }, [startNodeRow, startNodeCol, finishNodeRow, finishNodeCol]);

  const handleMouseDown = (row: number, col: number) => {
    if (freezeGrid) return;
    if (row === startNodeRow && col === startNodeCol) {
      return;
    }

    if (row === finishNodeRow && col === finishNodeCol) {
      return;
    }
    const newGrid = getNewGridWithWallToggled(grid, row, col);

    setGrid(newGrid);
    setMouseIsPressed(true);
  };
  console.log("grid", grid);

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || freezeGrid) return;
    if (row === startNodeRow && col === startNodeCol) {
      return;
    }
    if (row === finishNodeRow && col === finishNodeCol) {
      return;
    }
    const newGrid = getNewGridWithWallToggled(grid, row, col);

    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  return (
    <>
      <div className="mt-4 grid grid-cols-50 w-4/5">
        {grid.map((row, rowIdx) => {
          return (
            <div className="flex flex-row" key={rowIdx}>
              {row.map((node, nodeIdx) => {
                return (
                  <Node
                    setStartNodeRow={setStartNodeRow}
                    setStartNodeCol={setStartNodeCol}
                    setFinishNodeRow={setFinishNodeRow}
                    setFinishNodeCol={setFinishNodeCol}
                    moveStart={moveStart}
                    moveFinish={moveFinish}
                    setMoveStart={setMoveStart}
                    setMoveFinish={setMoveFinish}
                    freezeNode={freezeGrid}
                    node={node}
                    key={nodeIdx}
                    onMouseDown={() => handleMouseDown(node.row, node.col)}
                    onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                    onMouseUp={handleMouseUp}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex flex-row gap-1">
        <button
          onClick={handleReset}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          reset
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleStartVisualizing}
        >
          start
        </button>
      </div>
    </>
  );
}
