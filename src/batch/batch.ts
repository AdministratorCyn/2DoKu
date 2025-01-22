import { invoke } from '@tauri-apps/api/core';
const invoke = window.__TAURI__.core.invoke;
const puzzle = "9.486.53..7...5.9.6...2......9....64....9....71....3......4...1.6.1...4..48.532.6";
let char_grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
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
      let cand_grid: boolean[][] = response.puzzle.cand_grid;
      char_grid = response.puzzle.char_grid;
      let end = new Date().getMilliseconds();
      button.innerHTML = serverTime + " µs server only, " + (end - start) + "ms total";
      const buttons = document.querySelectorAll(".cell");
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (buttons[i * 9 + j]) {
            buttons[i * 9 + j].innerHTML = char_grid[i][j].toString();
          }
        }
      }
    } catch (error) {
      console.error('Error invoking greet:', error);
    }
  });
  const showcase = document.getElementById("showcase");
  if (showcase) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const button = document.createElement("button");
        button.className = "cell";
        if (char_grid[i][j] != 0 && puzzle.charAt(i * 9 + j) != '.') {
          button.style.color = "cyan";
          button.innerHTML = char_grid[i][j].toString();
        }
        else if (char_grid[i][j] != 0) {
          button.innerHTML = char_grid[i][j].toString();
        }
        button.addEventListener("click", () => {
          console.log(`Button at row ${i}, column ${j} clicked`);
        });
        button.addEventListener("keydown", (event) => {
          const key = event.key;
          if (key >= '1' && key <= '9') {
            char_grid[i][j] = parseInt(key);
            button.innerHTML = key;
          } else if (key === 'Backspace' || key === 'Delete') {
            char_grid[i][j] = 0;
            button.innerHTML = '';
          }
        });
        showcase.appendChild(button);
      }
    }
  }
});
