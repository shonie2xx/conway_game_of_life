import { Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pattern, PatternsService } from '../../services/patterns.service';

@Component({
  selector: 'app-patterns',
  imports: [CommonModule],
  templateUrl: `./patterns.component.html`,
  styleUrl: './patterns.component.css',
  standalone: true,
})
export class PatternsModal {
  isOpen = input<boolean>(false);
  patternSelected = output<Pattern>();
  modalClosed = output<void>();

  patterns = signal<Pattern[]>([]);

  constructor(private patternsService: PatternsService) {
    effect(() => {
      if (this.isOpen()) {
        this.loadPatterns();
      }
    });
  }

  loadPatterns(): void {
    this.patternsService.getAll().subscribe({
      next: (data) => this.patterns.set(data),
      error: (err) => {
        alert('Failed to load patterns');
        console.error('Failed to load patterns', err);
      },
    });
  }

  selectPattern(pattern: Pattern): void {
    this.patternSelected.emit(pattern);
    this.close();
  }

  close(): void {
    this.modalClosed.emit();
  }
}
