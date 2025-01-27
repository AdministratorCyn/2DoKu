import { invoke } from '@tauri-apps/api/core';
const invoke = window.__TAURI__.core.invoke;
const puzzle = "9.486.53..7...5.9.6...2......9....64....9....71....3......4...1.6.1...4..48.532.6";
let char_grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
let cand_grid: boolean[][];
for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (puzzle.charAt(i * 9 + j) == '.') {
      char_grid[i][j] = 0;
    }
    else {
      char_grid[i][j] = parseInt(puzzle.charAt(i * 9 + j));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById("start");
  button?.addEventListener("click", async () => {
    try {
      let serverTime;
      let start = new Date().getMilliseconds();
      const response = await invoke('solve', { grid: "9.486.53..7...5.9.6...2......9....64....9....71....3......4...1.6.1...4..48.532.6"});
      serverTime = response.time;
      cand_grid = response.puzzle.cand_grid;
      char_grid = response.puzzle.char_grid;
      let end = new Date().getMilliseconds();
      button.innerHTML = serverTime + " µs server only, " + (end - start) + "ms total";
      const buttons = document.querySelectorAll(".cell");
      
    } catch (error) {
      console.error('Error invoking greet:', error);
    }
  });
  const showcase = document.getElementById("showcase");
  showcase ? initComp(showcase) : null;
});
async function initComp(parent: HTMLElement) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("div");
      cell.classList.add('cell');
      if (i % 3 === 2 && i != 8) {
        cell.style.borderBottom = '2px solid white';
      }
      if (j % 3 === 0 && j !== 0) {
        cell.style.borderLeft = '2px solid white';
        cell.style.padding = '0px';
      }
      if (char_grid[i][j] != 0) {
        sc(cell, puzzle.charAt(i * 9 + j) != '.', i, j);
      } else {
        usc(cell, i, j);
      }
      parent.appendChild(cell);
    }
  }
}
//cell extends html element {}
function sc(cell: HTMLDivElement, given: boolean, i: number, j: number) {
  const button = document.createElement("button");
  cell.classList.remove("sc", "ca");
  button.classList.add('sc');
  if (given) {
    button.style.color = "67bbe5";
  }
  else {
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        clearDiv(cell);
        usc(cell, i, j);
      }
    });
  }
  button.innerHTML = char_grid[i][j].toString();
  cell.appendChild(button);
}
function usc(cell: HTMLDivElement, i: number, j: number) {
  cell.classList.remove("sc", "ca");
  cell.classList.add("ca");
  for (let i = 0; i < 9; i++) {
    const button = document.createElement("button");
    button.innerHTML = (i + 1).toString();
    button.classList.add("cand");
    button.addEventListener('click', () => {
      button.innerHTML !== '' ? button.innerHTML = '' : button.innerHTML = (i + 1).toString();
    });
    button.addEventListener('keydown', (event) => {
      if (event.key >= '1' && event.key <= '9') {
        char_grid[i][j] = parseInt(event.key);
        clearDiv(cell);
        sc(cell, false, i, j);
      }
    });
    button.addEventListener('mouseover', () => {
      button.style.color = 'white';
    });
    button.addEventListener('mouseout', () => {
      button.style.color = 'c0b5cb'
    });
    cell.appendChild(button);
  }
}
function clearDiv(cell: HTMLDivElement) {
  while(cell.firstChild) {
    cell.removeChild(cell.firstChild);
  }
}
