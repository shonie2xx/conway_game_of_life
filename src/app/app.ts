import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  grid = signal<boolean[][]>([]);
  gridSize = 50;
  tickSpeed = 500; // ms
  initialDensity = 0.25; // %
  intervalId: any;
  isRunning = signal<boolean>(false);

  ngOnInit() {
    this.initializeGrid();
  }

  initializeGrid() {
    const grid: boolean[][] = [];
    for (let i = 0; i < this.gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        grid[i][j] = Math.random() < this.initialDensity;
      }
    }
    this.grid.set(grid);
  }

  tick() {
    const nextGeneration = this.getNextGeneration();
    this.grid.set(nextGeneration);
  }

  getNextGeneration() {
    const currentGrid = this.grid();
    const newGrid: boolean[][] = [];

    for (let i = 0; i < this.gridSize; i++) {
      newGrid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        const neighbours = this.countNeighbors(i, j);
        const isAlive = currentGrid[i][j];

        // shortened conway's rules
        if (isAlive) {
          newGrid[i][j] = neighbours === 2 || neighbours === 3;
        } else {
          newGrid[i][j] = neighbours === 3;
        }
      }
    }

    return newGrid;
  }

  countNeighbors(row: number, col: number) {
    const currentGrid = this.grid();
    let count = 0;

    for (let newRow = row - 1; newRow <= row + 1; newRow++) {
      for (let newCol = col - 1; newCol <= col + 1; newCol++) {
        if (newRow === row && newCol === col) continue;

        if (newRow >= 0 && newRow < this.gridSize && newCol >= 0 && newCol < this.gridSize) {
          if (currentGrid[newRow][newCol]) {
            count++;
          }
        }
      }
    }

    return count;
  }

  togglePlayPause() {
    if (this.isRunning()) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    if (this.intervalId) return;

    this.isRunning.set(true);
    this.intervalId = setInterval(() => {
      this.tick();
    }, this.tickSpeed);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning.set(false);
    }
  }

  reset() {
    this.stop();
    this.initializeGrid();
  }
}
