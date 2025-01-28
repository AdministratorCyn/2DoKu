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

let techList: [string, [string, boolean][]][] = [["Subsets", [["Naked Single", true], ["Hidden Single", false], ["Naked Pair", true]]], ["Fish", [["X-Wing", true], ["Swordfish", true], ["Jellyfish", true]]]];

  
//i should add an actual sidebar to all pages
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('puz-zel', Sudoku);
    customElements.define('ce-ll', Cell);
    customElements.define('pro-gress', ProgressBar);
    const sudokuElement = document.getElementById('sudoku');
    const progressContainer = document.getElementById('progress');
    const progressBar = new ProgressBar();
    progressContainer?.appendChild(progressBar);
    progressBar.update(90);
    if (sudokuElement) {
      Object.setPrototypeOf(sudokuElement, Sudoku.prototype);
      (sudokuElement as any).constructor = Sudoku;
    }
    sudokuElement ? (sudokuElement as Sudoku).initComp() : null;

    //have to write open/close
    const toggle = document.getElementById('techniques');

    for (let type in techList) {
      const button = document.createElement('button');
      button.classList.add('folder');
      const file = document.createElement('img');
      file.src = '/src/assets/folder_icon.png';
      file.style.resize = 'both';
      file.style.width = '2vw';
      file.alt = 'Folder Icon';
      button.style.cursor = 'pointer';
      button?.appendChild(file);
      const text = document.createElement('a');
      text.innerHTML = `- ${techList[type][0]}`;
      button.addEventListener('click', () => {
        for (let tech of techList[type][1]) {
          const button = document.createElement('button');
          button.classList.add('subfolder');
          button.style.cursor = 'pointer';
          button.appendChild(file.cloneNode());
          const text = document.createElement('a');
            text.innerHTML = `- ${tech[0]}`
          button.appendChild(text);
          toggle?.appendChild(button); //different icon for files and folders
        }
      });
      button.appendChild(text);
      toggle?.appendChild(button);
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
        img.src = `/src/assets/${char_grid[i][j]}.png`;
        img.alt = `${char_grid[i][j]}`;
        img.style.width = '100%';
        img.style.height = '100%';
        button.appendChild(img);
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
  
  
  class Sudoku extends HTMLElement {
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
  class ProgressBar extends HTMLElement {
    private progress: number;
    constructor() {
      super();
      this.progress = 19;
    }
    update(percent: number) {
      this.progress = percent;
      this.style.width = `${this.progress}%`;
      this.style.color = 'green';
    }
  }

  
  
  