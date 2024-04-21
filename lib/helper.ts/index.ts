import { INode } from "@/types";

function getInitialGrid(
  startCoordinates: number[],
  finishCoordinates: number[]
) {
  const initialGrid: INode[][] = [];
  for (let row = 0; row < 20; row++) {
    const currentRow: INode[] = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(
        createNode(row, col, startCoordinates, finishCoordinates)
      );
    }
    initialGrid.push(currentRow);
  }

  return initialGrid;
}

function createNode(
  row: number,
  col: number,
  startCoordinates: number[],
  finishCoordinates: number[]
) {
  return {
    col,
    row,
    isStart: row === startCoordinates[0] && col === startCoordinates[1],
    isFinish: row === finishCoordinates[0] && col === finishCoordinates[1],
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
}

function getNewGridWithWallToggled(grid: INode[][], row: number, col: number) {
  const newGrid = grid.slice();
  const node = grid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function getNodesInShortestPathOrder(finishNode: INode): INode[] {
  const nodesInShortestPathOrder: INode[] = [];

  let currentNode: INode | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}

export {
  getInitialGrid,
  getNewGridWithWallToggled,
  getNodesInShortestPathOrder,
};
