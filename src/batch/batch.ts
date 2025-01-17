import { invoke } from '@tauri-apps/api/core';
const invoke = window.__TAURI__.core.invoke;
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById("start");
  button?.addEventListener("click", async () => {
    try {
      let serverTime;
      let start = new Date().getMilliseconds();
      const response = await invoke('solve', { grid: "9.486.53..7...5.9.6...2......9....64....9....71....3......4...1.6.1...4..48.532.6"});
      serverTime = response.time;
      let cand_grid: boolean[][] = response.puzzle.cand_grid;
      let char_grid: boolean[][] = response.puzzle.char_grid;
      let end = new Date().getMilliseconds();
      button.innerHTML = serverTime + " µs server only, " + (end - start) + "ms total";
      console.log(cand_grid);
      console.log(char_grid);
    } catch (error) {
      console.error('Error invoking greet:', error);
    }
  });
});