import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GRID_CONFIG } from './constants';
import { PatternsModal } from './components/patterns/patterns.component';
import { Pattern, PatternsService } from './services/patterns.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PatternsModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  grid = signal<boolean[][]>([]);
  gridRows: number = GRID_CONFIG.ROWS;
  gridCols: number = GRID_CONFIG.COLS;
  tickSpeed = GRID_CONFIG.TICK_SPEED;
  initialDensity = GRID_CONFIG.INITIAL_DENSITY;
  intervalId: any;
  isRunning = signal<boolean>(false);
  showPatternsModal = signal<boolean>(false);
  patternName = signal<string>('');

  constructor(private patternsService: PatternsService) {}

  ngOnInit() {
    this.initializeGrid();
  }

  initializeGrid() {
    const grid: boolean[][] = [];
    for (let row = 0; row < this.gridRows; row++) {
      grid[row] = [];
      for (let col = 0; col < this.gridCols; col++) {
        grid[row][col] = Math.random() < this.initialDensity;
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

    for (let row = 0; row < this.gridRows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < this.gridCols; col++) {
        const neighbours = this.countNeighbors(row, col);
        const isAlive = currentGrid[row][col];

        // shortened conway's rules
        if (isAlive) {
          newGrid[row][col] = neighbours === 2 || neighbours === 3;
        } else {
          newGrid[row][col] = neighbours === 3;
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

        if (newRow >= 0 && newRow < this.gridRows && newCol >= 0 && newCol < this.gridCols) {
          if (currentGrid[newRow][newCol]) {
            count++;
          }
        }
      }
    }

    return count;
  }

  toggleStartStop() {
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

  openPatternsModal() {
    this.showPatternsModal.set(true);
  }

  closePatternsModal() {
    this.showPatternsModal.set(false);
  }

  loadPattern(pattern: Omit<Pattern, '_id' | 'createdAt'>) {
    this.stop();

    const newGrid: boolean[][] = [];
    for (let row = 0; row < this.gridRows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < this.gridCols; col++) {
        newGrid[row][col] = false;
      }
    }

    for (let row = 0; row < pattern.grid.length; row++) {
      for (let col = 0; col < pattern.grid[row].length; col++) {
        if (row >= 0 && row < this.gridRows && col >= 0 && col < this.gridCols) {
          newGrid[row][col] = pattern.grid[row][col];
        }
      }
    }

    this.grid.set(newGrid);
  }

  publish() {
    const name = this.patternName().trim();
    if (!name) {
      alert('Please enter a pattern name');
      return;
    }

    this.patternsService
      .create({
        name: name,
        grid: this.grid(),
      })
      .subscribe({
        next: (savedPattern) => {
          alert(`Pattern "${savedPattern.name}" published successfully!`);
          this.patternName.set('');
        },
        error: (error) => {
          console.error('Failed to publish pattern:', error);
          alert('Failed to publish pattern. Please try again.');
        },
      });
  }
}
