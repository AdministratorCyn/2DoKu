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
function initComp(parent: HTMLElement) {
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          const cell = document.createElement("div");
          if (char_grid[i][j] != 0) {
            const button = document.createElement("button");
            button.classList.add('sc');
            button.addEventListener('click', () => {

            });
            cell.appendChild(button);
          }
          else {
            for (let k = 0; k < 9; k++) {
              const button = document.createElement("button");
              cell.classList.add('ca');
              button.classList.add('cand');
              button.innerHTML = (k + 1).toString();
              button.addEventListener('click', () => {
                button.innerHTML ? button.innerHTML = '' : button.innerHTML = (k + 1).toString();
              });
                button.addEventListener('keydown', (event) => {
                if (event.key >= '1' && event.key <= '9') {
                  while (cell.firstChild) {
                    cell.removeChild(cell.firstChild);
                  }
                  cell.classList.remove('ca');
                  const button = document.createElement("button");
                  button.classList.add('sc');
                  cell.appendChild(button); 
                }
                });
              cell.appendChild(button);
            }
          }
          parent.appendChild(cell);
      }
    }
}
function update(parent: HTMLElement, pos: number) {

}
