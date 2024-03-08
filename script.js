document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context!');
        return;
    }

    const generateNumbersButton = document.getElementById('generateNumbers');
    const clearNumbersButton = document.getElementById('clearNumbers');
    const startSortingButton = document.getElementById('startSorting');
    const algorithmSelector = document.getElementById('algorithmSelector');
    const numbersInput = document.getElementById('numbersInput');
    const animationSpeedSlider = document.getElementById('animationSpeed');
    const resultLabel = document.getElementById('resultLabel');

    let numbers = [];
    const MAX_NUMBER = 100;
    const NUMBER_OF_ELEMENTS = 10;

    function drawRects(arr, activeIndices = []) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = canvas.width / arr.length;
        
        arr.forEach((value, index) => {
            const height = (value / MAX_NUMBER) * canvas.height;
            ctx.fillStyle = activeIndices.includes(index) ? '#ff0000' : '#007bff';
            const xPosition = barWidth * index;
            const yPosition = canvas.height - height;
            ctx.fillRect(xPosition, yPosition, barWidth - 2, height);
    
            // Add text label above each bar
            ctx.fillStyle = '#000'; // Text color
            ctx.font = '14px Roboto'; // Text font and size
            const text = value.toString();
            const textWidth = ctx.measureText(text).width;
            ctx.fillText(text, xPosition + (barWidth / 2) - (textWidth / 2), yPosition - 5); // Adjust yPosition to draw text above the bar
        });
    }
    

    function generateNumbers() {
        numbers = Array.from({ length: NUMBER_OF_ELEMENTS }, () => Math.floor(Math.random() * MAX_NUMBER) + 1);
        numbersInput.value = numbers.join(' ');
        drawRects(numbers);
    }

    function clearNumbers() {
        numbers = [];
        numbersInput.value = '';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function setUiState(isSorting) {
        [generateNumbersButton, clearNumbersButton, startSortingButton, algorithmSelector].forEach(button => {
            button.disabled = isSorting;
        });
    }

    async function startSorting() {
        setUiState(true);
        const delay = 102 - animationSpeedSlider.value;
        const algorithm = algorithmSelector.value;
        resultLabel.textContent = "Sorting...";

        if (algorithm === 'bubbleSort') await bubbleSort(numbers, delay);
        else if (algorithm === 'insertionSort') await insertionSort(numbers, delay);
        else if (algorithm === 'quickSort') await quickSort(numbers, 0, numbers.length - 1, delay);
        else alert('Please select a sorting algorithm');

        resultLabel.textContent = "Sorting finished.";
        setUiState(false);
    }

    async function swapElements(arr, i, j, delay) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        drawRects(arr, [i, j]);
        await delayMs(delay);
    }

    async function delayMs(ms) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    async function bubbleSort(arr, delay) {
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                // Przed porównaniem zaznacz indeksy j i j+1 jako aktywne
                if (arr[j] > arr[j + 1]) {
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    // Przekazujemy indeksy aktywnych elementów do funkcji drawRects
                    drawRects(arr, [j, j + 1]);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    // Również pokazuj, które elementy są rozważane, nawet jeśli nie wymagają zamiany
                    drawRects(arr, [j, j + 1]);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    }
    
    async function quickSort(arr, start, end, delay) {
        if (start < end) {
            let index = await partition(arr, start, end, delay);
            await Promise.all([
                quickSort(arr, start, index - 1, delay),
                quickSort(arr, index + 1, end, delay)
            ]);
        }
    }
    
    async function insertionSort(arr, delay) {
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
    
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
                await swapElements(arr, j + 1, j + 2, delay); // Adjusted to visually indicate swapping
            }
            arr[j + 1] = key;
            drawRects(arr, [j + 1]); // Highlight the insertion
            await delayMs(delay);
        }
    }
    numbersInput.addEventListener('input', function() {
        const numberStrings = numbersInput.value.split(' ').map(num => num.trim());
        numbers = numberStrings.map(Number).filter(num => !isNaN(num) && num > 0 && num <= MAX_NUMBER);
        drawRects(numbers);
    });
    

    async function partition(arr, start, end, delay) {
        let pivotValue = arr[end];
        let pivotIndex = start;
        drawRects(arr, [end]); // Highlight the pivot
        await delayMs(delay);
    
        for (let i = start; i < end; i++) {
            if (arr[i] < pivotValue) {
                await swapElements(arr, i, pivotIndex, delay); // Visualize the swap
                pivotIndex++;
            }
        }
        await swapElements(arr, pivotIndex, end, delay); // Move pivot to its final place
        return pivotIndex;
    }
    

    generateNumbersButton.addEventListener('click', generateNumbers);
    clearNumbersButton.addEventListener('click', clearNumbers);
    startSortingButton.addEventListener('click', startSorting);
});