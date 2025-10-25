# Conway's game of life in Angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

# To start locally use

npm start

# Technical Architecture & Decisions

For a person coming from React, I chose to use Angular Signals over traditional state management because they provide fine-grained reactivity and eliminate the complexity of RxJS observables for simple state updates.

Another factor was standalone components, because they offer better modularity and don't require NgModules, making the component architecture cleaner and more self-contained.

# Implementation highlights

Game rules for each "tick":

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

# Features

- Play/Pause the game
- Reset the grid with a new randomized pattern
