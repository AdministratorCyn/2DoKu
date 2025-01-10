import { invoke } from '@tauri-apps/api/core';
const invoke = window.__TAURI__.core.invoke;
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById("starts");
  button?.addEventListener("click", async () => {
    try {
      invoke('greet', { name: 'help' }).then((response) => button.innerHTML = response as string);
    } catch (error) {
      console.error('Error invoking greet:', error);
    }
  });
});