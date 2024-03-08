import tkinter as tk
from tkinter import ttk
import random
import time

# Stworzenie okna aplikacji
root = tk.Tk()
root.title("Wizualizacja algorytmów sortowania")

# Lista liczb do posortowania
numbers_to_sort = []

# Obszar rysowania kwadratów
canvas = tk.Canvas(root, width=600, height=300)
canvas.pack()

# Funkcja do rysowania kwadratów na podstawie tablicy
def draw_rects(arr, highlighted_indices=[]):
    canvas.delete("all")
    c_height = 300
    c_width = 600
    x_width = c_width / (len(arr) + 1)
    offset = 10
    spacing = 10
    normalized_data = [i / max(arr) for i in arr]
    for i, height in enumerate(normalized_data):
        x0 = i * x_width + offset + spacing
        y0 = c_height - height * 290
        x1 = (i + 1) * x_width + offset
        y1 = c_height
        color = "red" if i in highlighted_indices else "sky blue"
        canvas.create_rectangle(x0, y0, x1, y1, fill=color)
        canvas.create_text(x0+2, y0, anchor=tk.SW, text=str(arr[i]))
    root.update_idletasks()

# Funkcje sortujące z możliwością dostosowania szybkości
def bubble_sort_visual(arr, delay):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                draw_rects(arr, highlighted_indices=[j, j+1])
                time.sleep(delay)

def insertion_sort_visual(arr, delay):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >=0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
        draw_rects(arr, highlighted_indices=[i, j+1])
        time.sleep(delay)

def quick_sort_visual(arr, start, end, delay):
    if start < end:
        pivot_index = partition(arr, start, end)
        quick_sort_visual(arr, start, pivot_index-1, delay)
        quick_sort_visual(arr, pivot_index+1, end, delay)
        draw_rects(arr)
        root.update()
        time.sleep(delay)

def partition(arr, start, end):
    pivot = arr[end]
    i = start - 1
    for j in range(start, end):
        if arr[j] < pivot:
            i = i+1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[end] = arr[end], arr[i+1]
    return i + 1

# Etykieta wyświetlająca liczby do posortowania
entry_label = ttk.Label(root, text="Liczby do posortowania: ")
entry_label.pack()

# Panel przycisków liczbowych i funkcje pomocnicze
buttons_frame = tk.Frame(root)
buttons_frame.pack()

def append_number(num):
    numbers_to_sort.append(num)
    entry_label.config(text="Liczby do posortowania: " + " ".join(map(str, numbers_to_sort)))

def generate_numbers():
    numbers_to_sort.clear()
    numbers_to_sort.extend([random.randint(1, 100) for _ in range(10)])
    entry_label.config(text="Liczby do posortowania: " + " ".join(map(str, numbers_to_sort)))

def clear_numbers():
    numbers_to_sort.clear()
    entry_label.config(text="Liczby do posortowania: ")

for num in range(1, 10):
    button = ttk.Button(buttons_frame, text=str(num), command=lambda n=num: append_number(n))
    button.grid(row=(num-1)//3, column=(num-1)%3)

generate_button = ttk.Button(root, text="Wygeneruj liczby", command=generate_numbers)
generate_button.pack()

clear_button = ttk.Button(root, text="Clear", command=clear_numbers)
clear_button.pack()

# Wybór algorytmu sortowania
chosen_algorithm = tk.StringVar()
algorithm_choices = ['Bubble Sort', 'Insertion Sort', 'Quick Sort']
chosen_algorithm.set(algorithm_choices[0])

algorithm_selector = ttk.OptionMenu(root, chosen_algorithm, *algorithm_choices)
algorithm_selector.pack()

# Suwak do regulacji prędkości animacji
speed_scale = tk.Scale(root, from_=0.01, to=1, resolution=0.01, orient=tk.HORIZONTAL, label="Szybkość animacji")
speed_scale.pack()

# Uruchomienie sortowania
def start_sorting():
    delay = speed_scale.get()
    if chosen_algorithm.get() == "Bubble Sort":
        bubble_sort_visual(numbers_to_sort, delay)
    elif chosen_algorithm.get() == "Insertion Sort":
        insertion_sort_visual(numbers_to_sort, delay)
    elif chosen_algorithm.get() == "Quick Sort":
        quick_sort_visual(numbers_to_sort, 0, len(numbers_to_sort)-1, delay)
    result_label.config(text="Sortowanie zakończone.")

sort_button = ttk.Button(root, text="Sortuj", command=start_sorting)
sort_button.pack()

result_label = ttk.Label(root, text="Czekam na dane...")
result_label.pack()

root.mainloop()
