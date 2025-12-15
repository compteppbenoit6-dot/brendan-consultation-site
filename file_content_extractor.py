import os
import tkinter as tk
from tkinter import filedialog, messagebox
from pathlib import Path

def read_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except (UnicodeDecodeError, PermissionError, IOError):
        return f"[Error: Could not read file {file_path}]"

def extract_files_to_txt(folder_paths, file_paths, output_file, output_text):
    content = []
    
    # Process files from selected folders, skipping "node_modules"
    for folder_path in folder_paths:
        for root, dirs, files in os.walk(folder_path):
            # Skip "node_modules" directories
            if 'node_modules' in dirs:
                dirs.remove('node_modules')
            for file_name in files:
                file_path = Path(root) / file_name
                relative_path = file_path.relative_to(folder_path)
                file_content = read_file_content(file_path)
                content.append(f"File: {relative_path} (from {folder_path})\nContent:\n{file_content}\n{'-'*50}\n")
    
    # Process individually selected files
    for file_path in file_paths:
        file_path = Path(file_path)
        file_content = read_file_content(file_path)
        content.append(f"File: {file_path.name} (from {file_path.parent})\nContent:\n{file_content}\n{'-'*50}\n")
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("".join(content))
        output_text.insert(tk.END, f"Output written to {output_file}\n")
    except Exception as e:
        output_text.insert(tk.END, f"Error writing output file: {e}\n")

def select_folders(output_text, folder_list):
    folder_path = filedialog.askdirectory(title="Select Folder")
    if folder_path:
        folder_list.append(folder_path)
        output_text.insert(tk.END, f"Added folder: {folder_path}\n")
    return folder_list

def select_files(output_text, file_list):
    files = filedialog.askopenfilenames(title="Select Files")
    if files:
        file_list.extend(files)
        for file in files:
            output_text.insert(tk.END, f"Added file: {file}\n")
    return file_list

def select_output_file(output_text):
    output_file = filedialog.asksaveasfilename(
        defaultextension=".txt",
        filetypes=[("Text files", "*.txt")],
        title="Select Output File Location"
    )
    if output_file:
        output_text.insert(tk.END, f"Selected output file: {output_file}\n")
    return output_file

def process_files(folder_list, file_list, output_file, output_text):
    if not folder_list and not file_list:
        output_text.insert(tk.END, "No folders or files selected.\n")
        return
    if not output_file:
        output_text.insert(tk.END, "No output file selected.\n")
        return
    extract_files_to_txt(folder_list, file_list, output_file, output_text)

def create_ui():
    root = tk.Tk()
    root.title("File Content Extractor")
    root.geometry("600x400")

    folder_list = []
    file_list = []
    output_file = []

    frame = tk.Frame(root)
    frame.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)

    tk.Button(frame, text="Add Folder", command=lambda: select_folders(output_text, folder_list)).pack(pady=5)
    tk.Button(frame, text="Add Files", command=lambda: select_files(output_text, file_list)).pack(pady=5)
    tk.Button(frame, text="Select Output File", command=lambda: output_file.append(select_output_file(output_text))).pack(pady=5)
    tk.Button(frame, text="Process Files", command=lambda: process_files(folder_list, file_list, output_file[-1] if output_file else "", output_text)).pack(pady=5)

    output_text = tk.Text(frame, height=20, width=60)
    output_text.pack(pady=5, fill=tk.BOTH, expand=True)

    root.mainloop()

if __name__ == "__main__":
    create_ui()