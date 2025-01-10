document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('sudoku-grid');
    
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.gridRow = row + 1;  
        cell.style.gridColumn = col + 1;  
        
        //make border for box

        // Attach a click event listener to the cell
        cell.addEventListener('click', function() {
          console.log(`Cell clicked: Row ${row}, Col ${col}`);
          if (this.innerHTML !== 'x') {
            this.innerHTML = 'x';
          }
          else {
            this.innerHTML = '';
          }
        });
        gridContainer.appendChild(cell);
      }
    }
  });
  