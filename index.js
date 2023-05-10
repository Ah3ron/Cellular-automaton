const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d", { alpha: false });

const CELL_SIZE = 8;
const COLORS = ["#11111b", "#313244", "#f5c2e7"];
const COLORS_LENGTH = COLORS.length;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scaleX = window.innerWidth / canvas.width;
const scaleY = window.innerHeight / canvas.height;
const scaleToCover = Math.max(scaleX, scaleY);

canvas.style.transformOrigin = "0 0"; //scale from top left
canvas.style.transform = "scale(" + scaleToCover + ")";

const GRID_WIDTH = Math.ceil(window.innerWidth / CELL_SIZE);
const GRID_HEIGHT = Math.ceil(window.innerHeight / CELL_SIZE);

function createGrid(rows, cols) {
  const grid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
    }
  }
  return grid;
}
let grid = createGrid(GRID_HEIGHT, GRID_WIDTH);

function randomizeGrid() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      grid[y][x] = Math.floor(Math.random() * COLORS_LENGTH);
    }
  }
}
randomizeGrid();

function drawGrid() {
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      ctx.fillStyle = COLORS[grid[y][x]];
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function colorFromNeighbors(x, y) {
  const currentColor = grid[y][x];
  const colorCounts = new Array(COLORS_LENGTH).fill(0);

  let newColor;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }

      const neighborRow = y + i;
      const neighborCol = x + j;

      if (
        neighborRow < 0 ||
        neighborRow >= GRID_HEIGHT ||
        neighborCol < 0 ||
        neighborCol >= GRID_WIDTH
      ) {
        continue;
      }

      colorCounts[grid[neighborRow][neighborCol]]++;
    }
  }

  if (colorCounts[(currentColor + 1) % COLORS_LENGTH] >= 3) {
    newColor = (currentColor + 1) % COLORS_LENGTH;
  } else {
    newColor = currentColor;
  }

  return newColor;
}

function updateGrid() {
  const newGrid = createGrid(GRID_HEIGHT, GRID_WIDTH);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      newGrid[y][x] = colorFromNeighbors(x, y);
    }
  }

  grid = newGrid;
  drawGrid(grid);
}

function animate() {
  requestAnimationFrame(animate);
  updateGrid();
}

drawGrid();
animate();