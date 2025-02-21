// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[derive(serde::Serialize)]
struct Sudoku{
    char_grid: [[i8; 9]; 9],
    cand_grid: Vec<Vec<bool>>
}

impl Sudoku {
    fn generate() -> Self{
        Self::new(".............1...................................................................")
    }
    fn new(str: &str) -> Self {
        let mut char_grid = [[0; 9]; 9];
        for (i, c) in str.chars().enumerate() {
            if c != '.' {
                char_grid[i / 9][i % 9] = c.to_digit(10).unwrap() as i8;
            }
        }
        Sudoku {
            char_grid,
            cand_grid: vec![vec![true; 81]; 9],
        }
    }
    fn autocand(&mut self) {
        for i in 0..81 {
            if self.char_grid[i / 9][i % 9] != 0 {
                for j in 0..9 {
                    if j != i % 9{
                        self.cand_grid[i / 9][j % 9 * 9 + self.char_grid[i / 9][i % 9] as usize - 1] = false;
                    }
                    if j != i / 9{
                        self.cand_grid[j][i % 9 * 9 + self.char_grid[i / 9][i % 9] as usize - 1] = false;
                    }
                    //box
                    if j != (i % 3 + (i / 9) % 3 * 3) {
                        self.cand_grid[(i / 9) / 3 * 3 + j / 3][((i % 9) / 3 * 27) + (j % 3 * 9) + self.char_grid[i / 9][i % 9] as usize - 1] = false;
                    }
                    //cell
                    if j != (self.char_grid[i / 9][i % 9] as usize - 1) {
                        self.cand_grid[i / 9][i % 9 * 9 + j] = false;
                    } 
                }
            }
        }
    }
    fn ns(&mut self) {
        let mut count: i32 = 0;
        let mut i = 0;
        while i < 729 {
            if i % 9 == 0 && self.char_grid[i / 81][i % 81 / 9] != 0 {  
                count = 0;
                i += 8;
            }
            else {
                if count > 1 {
                    count = 0;
                    i = i / 9 * 9 + 8; //happening on %= 0
                }
                else {
                    if self.cand_grid[i / 81][i % 81] {
                        count += 1;
                    }
                    if i % 9 == 8 && count != 1 {
                        count = 0;
                    }
                    else if i % 9 == 8{
                        for j in 0..9 {
                            if self.cand_grid[i / 81][i % 81 - 8 + j] {
                                self.char_grid[i / 81][i % 81 / 9] = (j + 1) as i8;
                                return;
                            }
                        }
                    }
                }
            }
            i += 1;
        }
    }
}
use std::{string, time::{Duration, Instant}};
#[derive(serde::Serialize)]
struct Output{
    time: String,
    puzzle: Sudoku
}

//we only need chars for autocand, can do bitwise or something faster? after
//bitvec but more compressed
#[tauri::command]
fn solve(grid: &str) -> Output {
    let mut grid = Sudoku::new(grid);
    let start = Instant::now();
    for _ in 0..100 {
        grid.ns();
        grid.autocand();
         //autocand is 5981ms avg alone, 91.7% of total time
    }
    let time = start.elapsed().as_micros().to_string();
    return Output{time, puzzle: grid}; //struct for both grids
}

#[tauri::command]
fn generate() -> Sudoku {
    Sudoku::generate()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![solve, generate])    
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
