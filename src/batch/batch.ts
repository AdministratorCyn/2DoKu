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
      
    } catch (error) {
      console.error('Error invoking greet:', error);
    }
  });
  
  customElements.define('show-case', Showcase);
  customElements.define('ce-ll', Cell);
  const showcaseElement = document.getElementById("showcase");
  if (showcaseElement) {
    Object.setPrototypeOf(showcaseElement, Showcase.prototype);
    (showcaseElement as any).constructor = Showcase;
  }
  showcaseElement ? (showcaseElement as Showcase).initComp() : null;
});


class Cell extends HTMLElement {
  constructor() {
    super();
    this.classList.add('cell');
  }
  sc(given: boolean, i: number, j: number): void {
    const button = document.createElement("button");
    button.classList.add('sc');
    if (given) {
      button.style.color = "67bbe5";
    }
    else {
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
          this.clear();
          this.usc(i, j);
        }
      });
    }
    button.innerHTML = char_grid[i][j].toString();
    this.appendChild(button);
  }
  usc(i: number, j: number): void {
    for (let k = 0; k < 9; k++) {
      const button = document.createElement("button");
      this.classList.add('ca');
      button.innerHTML = (k + 1).toString();
      button.classList.add("cand");
      button.addEventListener('click', () => {
        button.innerHTML !== '' ? button.innerHTML = '' : button.innerHTML = (k + 1).toString();
      });
      button.addEventListener('keydown', (event) => {
        if (event.key >= '1' && event.key <= '9') {
          char_grid[i][j] = parseInt(event.key);
          this.clear();
          this.sc(false, i, j);
        }
      });
      button.addEventListener('mouseover', () => {
        button.style.color = 'white';
      });
      button.addEventListener('mouseout', () => {
        button.style.color = 'c0b5cb';
      });
      this.appendChild(button);
    }
  }
  clear() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.classList.remove('ca', 'cand', 'sc');
  }
}


class Showcase extends HTMLElement {
  constructor() {
    super();
  }
  initComp() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = new Cell();
        
        cell.classList.add('cell');
        if (i % 3 === 2 && i != 8) {
          cell.style.borderBottom = '2px solid white';
        }
        if (j % 3 === 0 && j !== 0) {
          cell.style.borderLeft = '2px solid white';
          cell.style.padding = '0px';
        }
        if (char_grid[i][j] != 0) {
          cell.sc(true, i, j);
        } 
        else {
          cell.usc(i, j);
        }
        this.appendChild(cell as Cell);
      }
    }
  }
}
