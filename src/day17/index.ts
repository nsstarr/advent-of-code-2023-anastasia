import MinHeap from "./heap";
import { Day } from "../day";

type GridNode = { x: number; y: number; repeat: number; dx: number; dy: number };

class Day17 extends Day {
  constructor() {
    super(17);
  }

  solveForPartOne(input: string): string {
    const gridData = input.split("\n");

    const answer = this.findShortestPath(gridData);

    return answer.toString();
  }

  solveForPartTwo(input: string): string {
    const gridData = input.split("\n");

    const answerPartTwo = this.findShortestPathWithRepeats(gridData, 3, 10);

    return answerPartTwo.toString();
  }

  private generateNeighborsWithRepeats(
    node: GridNode,
    gridData: string[],
    repeatThreshold: number
  ): [GridNode, number][] {
    const neighbors: [GridNode, number][] = [];
    const { x, y, repeat, dx, dy } = node;

    if (
      repeat < repeatThreshold &&
      x + dx >= 0 &&
      x + dx < gridData.length &&
      y + dy >= 0 &&
      y + dy < gridData[0].length
    ) {
      neighbors.push([
        { x: x + dx, y: y + dy, repeat: repeat + 1, dx, dy },
        parseInt(gridData[x + dx][y + dy]),
      ]);
    }

    const leftRightShifts = [
      { dx: -dy, dy: dx },
      { dx: dy, dy: -dx },
    ];

    leftRightShifts.forEach(({ dx, dy }) => {
      // Allow generating neighbors with a repeat count greater than 1
      if (
        x + dx >= 0 &&
        x + dx < gridData.length &&
        y + dy >= 0 &&
        y + dy < gridData[0].length
      ) {
        neighbors.push([
          { x: x + dx, y: y + dy, repeat: repeat + 1, dx, dy },
          parseInt(gridData[x + dx][y + dy]),
        ]);
      }
    });

    return neighbors;
  }

  private findShortestPathWithRepeats(
    gridData: string[],
    repeatThresholdPartOne: number,
    repeatThresholdPartTwo: number
  ): number {
    const visitedNodes = new Set<string>();

    const startNode1: GridNode = { x: 0, y: 0, repeat: 0, dx: 1, dy: 0 };
    const startNode2: GridNode = { x: 0, y: 0, repeat: 0, dx: 0, dy: 1 };

    const distanceMap: { [key: string]: number } = {};
    distanceMap[JSON.stringify(startNode1)] = 0;
    distanceMap[JSON.stringify(startNode2)] = 0;

    // Create a min heap with a custom comparator
    const priorityQueue = new MinHeap<[number, GridNode]>((a, b) => a[0] - b[0]);

    // Add both starting nodes to the heap
    priorityQueue.add([0, startNode1]);
    priorityQueue.add([0, startNode2]);

    // Define the target node
    const targetNode: [number, number] = [gridData.length - 1, gridData[0].length - 1];

    // Main loop for Dijkstra's algorithm
    while (!priorityQueue.isEmpty()) {
      const [_, currentNode] = priorityQueue.pop()!;
      const currentNodeKey = JSON.stringify(currentNode);

      // Skip if the node has been visited
      if (visitedNodes.has(currentNodeKey)) continue;

      // Mark the node as visited
      visitedNodes.add(currentNodeKey);

      // Check if the target node is reached
      if (
        currentNode.x === targetNode[0] &&
        currentNode.y === targetNode[1]
      ) {
        return distanceMap[currentNodeKey];
      }

      // Generate neighbors for the current node
      const neighbors = this.generateNeighborsWithRepeats(
        currentNode,
        gridData,
        repeatThresholdPartOne
      );

      // Process neighbors
      neighbors.forEach(([neighborNode, cost]) => {
        const neighborNodeKey = JSON.stringify(neighborNode);
        // Skip if the neighbor has been visited
        if (visitedNodes.has(neighborNodeKey)) return;

        // Calculate the tentative distance to the neighbor
        const tentativeDistance = distanceMap[currentNodeKey] + cost;

        // Update the distance if the new path is shorter
        if (!distanceMap[neighborNodeKey] || tentativeDistance < distanceMap[neighborNodeKey]) {
          distanceMap[neighborNodeKey] = tentativeDistance;
          // Add the neighbor to the heap
          priorityQueue.add([tentativeDistance, neighborNode]);
        }
      });
    }

    return -1;
  }

  private generateNeighbors(node: GridNode, gridData: string[]): [GridNode, number][] {
    const neighbors: [GridNode, number][] = [];
    const { x, y, repeat, dx, dy } = node;

    if (
      repeat < 3 &&
      x + dx >= 0 &&
      x + dx < gridData.length &&
      y + dy >= 0 &&
      y + dy < gridData[0].length
    ) {
      neighbors.push([
        { x: x + dx, y: y + dy, repeat: repeat + 1, dx, dy },
        parseInt(gridData[x + dx][y + dy]),
      ]);
    }

    const leftRightShifts = [
      { dx: -dy, dy: dx },
      { dx: dy, dy: -dx },
    ];

    leftRightShifts.forEach(({ dx, dy }) => {
      if (
        x + dx >= 0 &&
        x + dx < gridData.length &&
        y + dy >= 0 &&
        y + dy < gridData[0].length
      ) {
        neighbors.push([
          { x: x + dx, y: y + dy, repeat: 1, dx, dy },
          parseInt(gridData[x + dx][y + dy]),
        ]);
      }
    });

    return neighbors;
  }

  private findShortestPath(gridData: string[]): number {
    const visitedNodes = new Set<string>();

    const startNode1: GridNode = { x: 0, y: 0, repeat: 0, dx: 1, dy: 0 };
    const startNode2: GridNode = { x: 0, y: 0, repeat: 0, dx: 0, dy: 1 };

    // Initialize the distance map
    const distanceMap: { [key: string]: number } = {};
    distanceMap[JSON.stringify(startNode1)] = 0;
    distanceMap[JSON.stringify(startNode2)] = 0;

    // Create a min heap with a custom comparator
    const priorityQueue = new MinHeap<[number, GridNode]>((a, b) => a[0] - b[0]);

    // Add both starting nodes to the heap
    priorityQueue.add([0, startNode1]);
    priorityQueue.add([0, startNode2]);

    const targetNode: [number, number] = [gridData.length - 1, gridData[0].length - 1];

    // Main loop for Dijkstra's algorithm
    while (!priorityQueue.isEmpty()) {
      const [_, currentNode] = priorityQueue.pop()!;
      const currentNodeKey = JSON.stringify(currentNode);

      // Skip if the node has been visited
      if (visitedNodes.has(currentNodeKey)) continue;

      // Mark the node as visited
      visitedNodes.add(currentNodeKey);

      // Check if the target node is reached
      if (currentNode.x === targetNode[0] && currentNode.y === targetNode[1]) {
        return distanceMap[currentNodeKey];
      }

      // Generate neighbors for the current node
      const neighbors = this.generateNeighbors(currentNode, gridData);

      // Process neighbors
      neighbors.forEach(([neighborNode, cost]) => {
        const neighborNodeKey = JSON.stringify(neighborNode);
        // Skip if the neighbor has been visited
        if (visitedNodes.has(neighborNodeKey)) return;

        // Calculate the tentative distance to the neighbor
        const tentativeDistance = distanceMap[currentNodeKey] + cost;

        // Update the distance if the new path is shorter
        if (!distanceMap[neighborNodeKey] || tentativeDistance < distanceMap[neighborNodeKey]) {
          distanceMap[neighborNodeKey] = tentativeDistance;
          // Add the neighbor to the heap
          priorityQueue.add([tentativeDistance, neighborNode]);
        }
      });
    }

    return -1;
  }
}

export default new Day17();
