const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const checkButton = document.getElementById('check-button');
const clearButton = document.getElementById('clear-button');
const feedback = document.getElementById('feedback');
const targetLetter = document.getElementById('target-letter');
const drawingStatus = document.getElementById('drawing-status');

let isDrawing = false;
let strokeCount = 0;
let totalStrokes = 0;

// Set up drawing with improved settings
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Set up drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile devices
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopDrawing);

clearButton.addEventListener('click', clearCanvas);
checkButton.addEventListener('click', checkHandwriting);

function startDrawing(e) {
    isDrawing = true;
    strokeCount++;
    totalStrokes++;

    // Update drawing status
    drawingStatus.textContent = `Drawing... (${totalStrokes} strokes)`;
    drawingStatus.classList.add('active');

    // Clear any previous feedback when starting to draw
    if (feedback.innerHTML.includes('Try again') || feedback.innerHTML.includes('Tip:')) {
        feedback.innerHTML = '';
    }
    draw(e); // Start drawing immediately
}

function draw(e) {
    if (!isDrawing) return;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2c3e50';

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        ctx.beginPath();

        // Update drawing status
        drawingStatus.textContent = `Ready (${totalStrokes} strokes)`;
        drawingStatus.classList.remove('active');
    }
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' :
        e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });

    // Calculate offset for touch events
    mouseEvent.offsetX = touch.clientX - rect.left;
    mouseEvent.offsetY = touch.clientY - rect.top;

    canvas.dispatchEvent(mouseEvent);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    feedback.innerHTML = '';
    strokeCount = 0;
    totalStrokes = 0;
    drawingStatus.textContent = 'Ready to draw';
    drawingStatus.classList.remove('active');
}

async function checkHandwriting() {
    // Check if there's any drawing on the canvas
    const imageData = canvas.toDataURL('image/png');

    // Basic check if canvas is empty
    const isCanvasEmpty = isCanvasBlank();

    if (isCanvasEmpty) {
        feedback.textContent = "✏️ Please draw the letter first!";
        feedback.style.color = "#f39c12";
        return;
    }

    // Send to backend for realistic handwriting analysis
    try {
        feedback.textContent = "🤖 Analyzing your handwriting...";
        feedback.style.color = "#3498db";

        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: imageData,
                targetLetter: targetLetter.textContent
            })
        });

        const result = await response.json();

        // Handle case where drawing is too minimal
        if (result.status === 'no_drawing') {
            feedback.textContent = `📝 ${result.feedback}`;
            feedback.style.color = "#f39c12";
            return;
        }

        // Display detailed analysis and feedback
        if (result.prediction === targetLetter.textContent) {
            // Correct prediction
            const confidence = Math.round(result.confidence * 100);
            feedback.innerHTML = `
                <div style="color: #2ecc71; font-weight: bold;">✅ Correct! ${result.feedback}</div>
                <div style="color: #7f8c8d; font-size: 0.9em; margin-top: 5px;">
                    Confidence: ${confidence}% | Quality: ${result.analysis?.drawingQuality || 'good'}
                </div>
            `;

            // Automatic progression with celebration
            setTimeout(() => {
                updateScore();
            }, 2000);
        } else {
            // Incorrect prediction with detailed feedback
            const confidence = Math.round(result.confidence * 100);
            feedback.innerHTML = `
                <div style="color: #e74c3c; font-weight: bold;">
                    🤔 I see "${result.prediction}" - ${result.feedback}
                </div>
                <div style="color: #7f8c8d; font-size: 0.9em; margin-top: 5px;">
                    Confidence: ${confidence}% | Quality: ${result.analysis?.drawingQuality || 'basic'}
                </div>
            `;

            // Show improvement tip after delay
            setTimeout(() => {
                showImprovementTip(result.analysis?.drawingQuality, targetLetter.textContent);
            }, 3000);
        }

        // Log analysis for debugging
        console.log('Handwriting Analysis:', result.analysis);

    } catch (error) {
        console.error("Analysis error:", error);
        feedback.textContent = "❌ Connection error. Please check your internet and try again.";
        feedback.style.color = "#e74c3c";
    }
}

// Show contextual improvement tips
function showImprovementTip(quality, letter) {
    const tips = {
        'incomplete': `💡 Tip: Draw the complete shape of "${letter}". Take your time with each stroke.`,
        'basic': `💡 Tip: Try to make "${letter}" more defined. Focus on the characteristic curves and lines.`,
        'good': `💡 Tip: You're very close! Pay attention to the proportions and spacing in "${letter}".`,
        'detailed': `💡 Tip: Great detail! Just minor adjustments needed for perfect "${letter}".`
    };

    const tip = tips[quality] || tips['basic'];

    feedback.innerHTML += `
        <div style="color: #3498db; font-style: italic; margin-top: 8px; font-size: 0.95em;">
            ${tip}
        </div>
    `;
}

// Helper function to check if canvas is blank
function isCanvasBlank() {
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    let score = parseInt(scoreElement.textContent) + 1;
    scoreElement.textContent = score;

    // Extended list of Sinhala letters
    const letters = ['ක', 'ඛ', 'ග', 'ඝ', 'ඞ', 'ච', 'ඡ', 'ජ', 'ඣ', 'ඤ',
        'ට', 'ඨ', 'ඩ', 'ඪ', 'ණ', 'ත', 'ථ', 'ද', 'ධ', 'න',
        'ප', 'ඵ', 'බ', 'භ', 'ම', 'ය', 'ර', 'ල', 'ව', 'ශ',
        'ෂ', 'ස', 'හ', 'ළ', 'ෆ'];

    if (score < letters.length) {
        targetLetter.textContent = letters[score];
    } else {
        feedback.textContent = "🎉 Congratulations! You've completed all letters!";
        feedback.style.color = "#2ecc71";
        return;
    }

    clearCanvas();
}
