// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
use std::time::{Instant};
#[tauri::command]
fn count() -> i32 {
    let mut count = 0;
    let start = Instant::now();
    for _ in 0..1000000 {
        count += 1;
    }
    let elapsed = start.elapsed();
    return (elapsed.as_micros() as i32);
}
struct Batch;

impl Batch {
    pub fn new() -> Self {
        Batch
    }
    
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, count])    
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
