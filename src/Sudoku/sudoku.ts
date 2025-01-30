import { image } from "@tauri-apps/api";
//import { invoke } from "@tauri-apps/api";
//add titled border to console

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});
//index based comms

const puzzle = "9.486.53..7...5.9.6...2......9....64....9....71....3......4...1.6.1...4..48.532.6";
let temp_grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle.charAt(i * 9 + j) == '.') {
        temp_grid[i][j] = 0;
      }
      else {
        temp_grid[i][j] = parseInt(puzzle.charAt(i * 9 + j));
      }
    }
  }

let techList: [string, [string, boolean][]][] = [["Subsets", [["Naked Single", true], ["Hidden Single", false], ["Naked Pair", true]]], ["Fish", [["X-Wing", true], ["Swordfish", true], ["Jellyfish", true]]], ["Intersections", []], ["Chains and Loops", []], ["Uniqueness", []], ["Single Digit Patterns", []], ["Wings", []], ["Advanced Fish", []], ["Misc", []], ["Coloring", []], ["Almost Locked Sets", []], ["Last Resort", []]];

class Sudoku {
  char_grid: number[][];
  cand_grid: boolean[][];
  constructor(char_grid: number[][]) {
    this.char_grid = char_grid;
    this.cand_grid = this.autocand();
  }
  autocand(): boolean[][] {
    let temp_bool: boolean[][] = Array.from({ length: 9 }, () => Array(81).fill(true));

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.char_grid[i][j] != 0) {
          for (let k = 0; k < 9; k++) {
            temp_bool[i][k * 9 + this.char_grid[i][j] - 1] = false;
            temp_bool[k][j * 9 + this.char_grid[i][j] - 1] = false;
            temp_bool[Math.floor(i / 3) * 3 + Math.floor(k / 3)][Math.floor(j / 3) * 27 + (k % 3) * 9 + this.char_grid[i][j] - 1] = false;
          }
        }
      }
    }
    return temp_bool;
  }
}

let sudoku = new Sudoku(temp_grid);

//i should add an actual sidebar to all pages
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('puz-zel', SudokuGrid);
    customElements.define('ce-ll', Cell);
    const sudokuElement = document.getElementById('sudoku');
    if (sudokuElement) {
      Object.setPrototypeOf(sudokuElement, SudokuGrid.prototype);
      (sudokuElement as any).constructor = Sudoku;
    }
    sudokuElement ? (sudokuElement as SudokuGrid).initComp() : null;

    
    const toggle = document.getElementById('techniques');

    for (let type in techList) {
      const div = document.createElement('div');
      div.style.border = '1px solid grey';
      const button = document.createElement('button');
      button.classList.add('folder');
      button.style.borderBottom = '1px solid #353546'
      const file = document.createElement('img');
      file.src = '/src/assets/folder_icon.png';
      file.classList.add('noResize');
      file.style.resize = 'both';
      file.style.width = '2vw';
      file.alt = 'Folder Icon';
      button.style.cursor = 'pointer';
      button?.appendChild(file);
      const text = document.createElement('a');
      text.innerHTML = `- ${techList[type][0]}`;
      button.addEventListener('click', () => {
        if (div.children.length > 1) {
          while (div.children[1]) {
            div.removeChild(div.children[1]);
          }
        }
        else {
          for (let tech of techList[type][1]) {
            const button = document.createElement('button');
            button.classList.add('subfolder');
            button.style.cursor = 'pointer';
            const first = document.createElement('a');
            first.innerHTML = '┕';
            button.appendChild(first);
            button.appendChild(file.cloneNode());
            const text = document.createElement('a');
            text.innerHTML = `- ${tech[0]}`
            button.appendChild(text);
            button.addEventListener('click', () => {
              tech[1] = !tech[1];
              text.style.color = tech[1] ? 'white' : 'gray';
              first.style.color = tech[1] ? 'white' : 'gray';
            });
            div.appendChild(button);
             //different icon for files and folders
          }
        }
      });
      button.appendChild(text);
      div.appendChild(button);
      toggle?.appendChild(div);
    }
    
  customElements.define('progress-bar', ProgressBar);

  const progressBarElement = document.getElementById('progress');
  if (progressBarElement) {
    Object.setPrototypeOf(progressBarElement, ProgressBar.prototype);
    (progressBarElement as any).constructor = ProgressBar;
    (progressBarElement as ProgressBar).connectedCallback();
    const filledCells = sudoku.char_grid.flat().filter(num => num !== 0).length;
    const progress = (filledCells / 81) * 100;
    (progressBarElement as ProgressBar).setProgress(progress);
  }
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
      const img = document.createElement('img');
        img.src = `/src/assets/${sudoku.char_grid[i][j]}.png`;
        img.alt = `${sudoku.char_grid[i][j]}`;
        img.style.width = '100%';
        img.style.height = '100%';
        button.appendChild(img);
      this.appendChild(button);
    }
    usc(i: number, j: number): void {
      for (let k = 0; k < 9; k++) {
        const button = document.createElement("button");
        this.classList.add('ca');
        const image = document.createElement('img');
        if (sudoku.cand_grid[i][j * 9 + k]) {
          image.src = `/src/assets/cand${k + 1}.png`;
        }
        else {
          image.src = '/src/assets/blank.png';
        }
        image.classList.add('sc');
        button.classList.add("cand");
        button.addEventListener('mousedown', (event) => {
          if (event.button === 2) {
            if (image.src.includes('blank.png')) {
              image.src = `/src/assets/cand${k + 1}.png`;
            } else {
              image.src = '/src/assets/blank.png';
            }
          }
        });
        button.addEventListener('keydown', (event) => {
          if (event.key >= '1' && event.key <= '9') {
            sudoku.char_grid[i][j] = parseInt(event.key);
            this.clear();
            this.sc(false, i, j);
            const progressBarElement = document.getElementById('progress');
            if (progressBarElement) {
              const progressBar = progressBarElement as ProgressBar;
              const filledCells = sudoku.char_grid.flat().filter(num => num !== 0).length;
              const progress = (filledCells / 81) * 100;
              progressBar.setProgress(progress);
            }
            //sudoku.autocand();
          }
        });
        button.addEventListener('mouseover', () => {
          image.style.filter = 'brightness(1.5)';
        });
        button.addEventListener('mouseout', () => {
          image.style.filter = 'brightness(1)';
        });
        button.appendChild(image);
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
  
  
  class SudokuGrid extends HTMLElement {
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
          if (sudoku.char_grid[i][j] != 0) {
            cell.sc(true, i, j);
          } 
          else {
            cell.usc(i, j);
          }
          this.appendChild(cell);
        }
      }
    }
  }

  
  
  class ProgressBar extends HTMLElement {
    private progress: number;
    constructor() {
      super();
      this.progress = 0;
    }

    connectedCallback() {
      this.style.display = 'flex';
      this.style.height = '20px';
      this.style.width = `${this.progress}%`;
      this.style.backgroundColor = '#000000';
    }

    setProgress(progress: number) {
      this.progress = progress;
      this.updateProgressBar();
    }

    updateProgressBar() {
      const container = document.createElement('div');
      this.innerHTML = '';
      const filledWidth = (this.progress / 100) * this.clientWidth;

      const middleBar = document.createElement('img');
      middleBar.src = '/src/assets/bar.png';
      middleBar.style.height = '100%';
      middleBar.style.width = `${filledWidth}px`;
      middleBar.style.flexGrow = '1';
      container.appendChild(middleBar);

      const endCap = document.createElement('img');
      endCap.src = '/src/assets/cap.png';
      endCap.style.height = '100%';
      endCap.style.width = 'auto';
      container.appendChild(endCap);
      this.appendChild(container);
    }
  }