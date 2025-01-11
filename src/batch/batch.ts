import { invoke } from '@tauri-apps/api/core';
const invoke = window.__TAURI__.core.invoke;
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById("starts");
  button?.addEventListener("click", async () => {
    try {
      let start = new Date().getMilliseconds();
      const serverTime = await invoke('count');
      let end = new Date().getMilliseconds();
      button.innerHTML = serverTime + " ms server only, " + (end - start) + "ms total";
    } catch (error) {
      console.error('Error invoking greet:', error);
    }
  });
});