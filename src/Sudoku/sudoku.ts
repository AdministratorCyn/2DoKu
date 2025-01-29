import { image } from "@tauri-apps/api";

//add titled border to console

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

let techList: [string, [string, boolean][]][] = [["Subsets", [["Naked Single", true], ["Hidden Single", false], ["Naked Pair", true]]], ["Fish", [["X-Wing", true], ["Swordfish", true], ["Jellyfish", true]]], ["Intersections", []], ["Chains and Loops", []], ["Uniqueness", []], ["Single Digit Patterns", []], ["Wings", []], ["Advanced Fish", []], ["Misc", []], ["Coloring", []], ["Almost Locked Sets", []], ["Last Resort", []]];

async function autocand() { //figure out how to best do this
  
}
  
//i should add an actual sidebar to all pages
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('puz-zel', Sudoku);
    customElements.define('ce-ll', Cell);
    const sudokuElement = document.getElementById('sudoku');
    if (sudokuElement) {
      Object.setPrototypeOf(sudokuElement, Sudoku.prototype);
      (sudokuElement as any).constructor = Sudoku;
    }
    sudokuElement ? (sudokuElement as Sudoku).initComp() : null;

    
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
    const filledCells = char_grid.flat().filter(num => num !== 0).length;
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
        const image = document.createElement('img');
        image.src = `/src/assets/cand${k + 1}.png`;
        image.classList.add('sc');
        button.classList.add("cand");
        button.addEventListener('click', () => {
          if (image.src.includes('blank.png')) {
            image.src = `/src/assets/cand${k + 1}.png`;
          } else {
            image.src = '/src/assets/blank.png';
          }
        });
        button.addEventListener('keydown', (event) => {
          if (event.key >= '1' && event.key <= '9') {
            char_grid[i][j] = parseInt(event.key);
            this.clear();
            this.sc(false, i, j);
            const progressBarElement = document.getElementById('progress');
            if (progressBarElement) {
              const progressBar = progressBarElement as ProgressBar;
              const filledCells = char_grid.flat().filter(num => num !== 0).length;
              const progress = (filledCells / 81) * 100;
              progressBar.setProgress(progress);
            }
          }
        });
        button.addEventListener('mouseover', () => {
          
        });
        button.addEventListener('mouseout', () => {
          
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
      this.style.display = 'block';
      this.style.width = '100%';
      this.style.backgroundColor = '#e0e0e0';
      this.style.borderRadius = '5px';
      this.style.overflow = 'hidden';
    }

    connectedCallback() {
      const bar = document.createElement('div');
      bar.style.height = '100%';
      bar.style.width = `${this.progress}%`;
      bar.style.backgroundColor = '#B4C3EA';
      bar.style.borderTopRightRadius = '5px';
      bar.style.borderBottomRightRadius = '5px';
      bar.style.transition = 'width 0.25s';
      this.appendChild(bar);
    }

    setProgress(value: number) {
      this.progress = Math.max(0, Math.min(100, value));
      if (this.firstChild) {
        (this.firstChild as HTMLElement).style.width = `${this.progress}%`;
      }
    }
  }