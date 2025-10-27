import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
import { Pattern, PatternsService } from './services/patterns.service';
import { of } from 'rxjs';

describe('App Component - Gameboard Conway Game Of Life', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let mockPatternsService: jasmine.SpyObj<PatternsService>;
  beforeEach(async () => {
    mockPatternsService = jasmine.createSpyObj('PatternsService', ['create', 'getAll']);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: PatternsService, useValue: mockPatternsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;

    component.gridRows = 3;
    component.gridCols = 3;
  });

  describe('Game logic', () => {
    it('should initialize grid on ngOnInit', () => {
      component.ngOnInit();
      const grid = component.grid();
      expect(grid.length).toBe(3);
      expect(grid[0].length).toBe(3);

      expect(typeof grid[0][0]).toBe('boolean');
    });

    it('should compute next generation correctly', () => {
      component.grid.set([
        [false, true, false],
        [false, true, false],
        [false, true, false],
      ]);

      const nextGen = component.getNextGeneration();
      expect(nextGen).toEqual([
        [false, false, false],
        [true, true, true],
        [false, false, false],
      ]);
    });

    it('should count neightbors correctly', () => {
      component.grid.set([
        [true, false, false],
        [false, true, false],
        [false, false, true],
      ]);

      expect(component.countNeighbors(1, 1)).toBe(2);
      expect(component.countNeighbors(0, 0)).toBe(1);
      expect(component.countNeighbors(2, 2)).toBe(1);
      expect(component.countNeighbors(0, 1)).toBe(2);
    });
  });

  describe('Game controls', () => {
    beforeEach(() => {
      jasmine.clock().install();
      component.ngOnInit();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
      component.stop();
    });

    it('should start the game', () => {
      expect(component.isRunning()).toBeFalse();

      component.start();

      expect(component.isRunning()).toBeTrue();
      expect(component['intervalId']).not.toBeNull();
    });
    it('should create an interval that ticks the game', () => {
      spyOn(component, 'tick');

      component.start();
      jasmine.clock().tick(component.tickSpeed);

      expect(component.tick).toHaveBeenCalled();
    });
    it('should not start if already running', () => {
      component.start();
      const intervalId = component['intervalId'];

      component.start();

      expect(component['intervalId']).toBe(intervalId);
    });
    it('should stop the game', () => {
      component.start();
      expect(component.isRunning()).toBeTrue();

      component.stop();
      expect(component.isRunning()).toBeFalse();
      expect(component['intervalId']).toBeNull();
    });
    it('should toggle start/stop', () => {
      expect(component.isRunning()).toBeFalse();

      component.toggleStartStop();
      expect(component.isRunning()).toBeTrue();

      component.toggleStartStop();
      expect(component.isRunning()).toBeFalse();
    });

    it('should reset the game', () => {
      component.grid.set([
        [true, true, true],
        [true, true, true],
        [true, true, true],
      ]);
      component.start();

      spyOn(component, 'initializeGrid').and.callThrough();

      component.reset();

      expect(component.initializeGrid).toHaveBeenCalled();
      expect(component.isRunning()).toBeFalse();
    });
  });

  describe('Loading patterns modal', () => {
    it('should open the patterns modal', () => {
      component.openPatternsModal();
      expect(component.showPatternsModal()).toBeTrue();
    });

    it('should close the patterns modal', () => {
      component.showPatternsModal.set(true);
      component.closePatternsModal();
      expect(component.showPatternsModal()).toBeFalse();
    });

    it('should load and apply a pattern from the modal', () => {
      const pattern = {
        name: 'Test Pattern',
        grid: [
          [true, false, true],
          [false, true, false],
          [true, false, true],
        ],
      };

      component.loadPattern(pattern);

      const grid = component.grid();
      expect(grid).toEqual(pattern.grid);
    });

    it('should load and apply a out-of-bounds pattern from the modal', () => {
      const pattern = {
        name: 'Large Pattern',
        grid: [
          [true, false, true, false],
          [false, true, false, true],
          [true, false, true, false],
          [false, true, false, true],
        ],
      };

      component.loadPattern(pattern);

      const grid = component.grid();
      expect(grid).toEqual([
        [true, false, true],
        [false, true, false],
        [true, false, true],
      ]);
    });
    it('should load and apply a pattern with empty grid', () => {
      const pattern = {
        name: 'Empty Pattern',
        grid: [],
      };

      component.loadPattern(pattern);

      const grid = component.grid();
      expect(grid).toEqual([
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ]);
    });
  });

  describe('Publishing patterns', () => {
    it('should publish a new pattern successfully', () => {
      const mockSavedPattern: Pattern = {
        _id: '123',
        name: 'Test Pattern',
        grid: [[true, false]],
        createdAt: new Date(),
      };

      mockPatternsService.create.and.returnValue(of(mockSavedPattern));
      component.patternName.set('Test Pattern');
      spyOn(window, 'alert');

      component.publish();

      expect(mockPatternsService.create).toHaveBeenCalledWith({
        name: 'Test Pattern',
        grid: component.grid(),
      });
      expect(window.alert).toHaveBeenCalledWith('Pattern "Test Pattern" published successfully!');
      expect(component.patternName()).toBe('');
    });

    it('should show an alert if pattern name is empty', () => {
      spyOn(window, 'alert');
      component.patternName.set('   ');

      component.publish();

      expect(window.alert).toHaveBeenCalledWith('Please enter a pattern name');
      expect(mockPatternsService.create).not.toHaveBeenCalled();
    });
  });
});
