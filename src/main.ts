import { invoke } from "@tauri-apps/api/core";
//React! 

async function calcParts(){

}
window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("tsInput");
  if (button) {
    button.addEventListener("click", async () => {
      button.innerHTML = "Clicked";
    });
  }
});