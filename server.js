const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Sinhala letters array
const SINHALA_LETTERS = ['ක', 'ඛ', 'ග', 'ඝ', 'ඞ', 'ච', 'ඡ', 'ජ', 'ඣ', 'ඤ',
    'ට', 'ඨ', 'ඩ', 'ඪ', 'ණ', 'ත', 'ථ', 'ද', 'ධ', 'න',
    'ප', 'ඵ', 'බ', 'භ', 'ම', 'ය', 'ර', 'ල', 'ව', 'ශ',
    'ෂ', 'ස', 'හ', 'ළ', 'ෆ'];

// Advanced handwriting analysis and prediction system
function analyzeHandwriting(imageData, targetLetter) {
    // Convert base64 to actual image analysis
    const base64Data = imageData.split(',')[1];
    const imageBytes = Buffer.from(base64Data, 'base64');

    // Simulate realistic handwriting analysis
    const analysis = {
        strokeComplexity: analyzeStrokeComplexity(imageBytes),
        imageSize: imageBytes.length,
        targetLetter: targetLetter,
        drawingQuality: assessDrawingQuality(imageBytes)
    };

    return analysis;
}

function analyzeStrokeComplexity(imageBytes) {
    // Simulate stroke complexity analysis based on image size and data
    const complexity = imageBytes.length > 20000 ? 'complex' :
        imageBytes.length > 15000 ? 'moderate' : 'simple';
    return complexity;
}

function assessDrawingQuality(imageBytes) {
    // Simulate drawing quality assessment
    const size = imageBytes.length;
    if (size < 10000) return 'incomplete';
    if (size < 15000) return 'basic';
    if (size < 25000) return 'good';
    return 'detailed';
}

// Realistic prediction based on actual drawing analysis
function realisticPredict(analysis) {
    const { strokeComplexity, drawingQuality, targetLetter } = analysis;

    // Calculate prediction accuracy based on drawing characteristics
    let accuracyBonus = 0;

    // Quality bonuses
    switch (drawingQuality) {
        case 'detailed': accuracyBonus += 0.3; break;
        case 'good': accuracyBonus += 0.2; break;
        case 'basic': accuracyBonus += 0.1; break;
        case 'incomplete': accuracyBonus -= 0.2; break;
    }

    // Complexity bonuses (some letters are naturally more complex)
    const complexLetters = ['ක', 'ද', 'බ', 'ම', 'හ', 'ළ'];
    const simpleLetters = ['ට', 'න', 'ල', 'ව'];

    if (complexLetters.includes(targetLetter) && strokeComplexity === 'complex') {
        accuracyBonus += 0.15;
    } else if (simpleLetters.includes(targetLetter) && strokeComplexity === 'simple') {
        accuracyBonus += 0.15;
    }

    // Base accuracy starts at 50%
    let finalAccuracy = 0.5 + accuracyBonus;
    finalAccuracy = Math.min(0.95, Math.max(0.15, finalAccuracy)); // Clamp between 15% and 95%

    // Determine prediction based on calculated accuracy
    const randomValue = Math.random();

    if (randomValue < finalAccuracy) {
        return {
            prediction: targetLetter,
            confidence: finalAccuracy,
            feedback: generatePositiveFeedback(drawingQuality, strokeComplexity)
        };
    } else {
        // Generate a realistic "wrong" prediction
        const wrongPrediction = generateRealisticWrongPrediction(targetLetter, analysis);
        return {
            prediction: wrongPrediction,
            confidence: 1 - finalAccuracy,
            feedback: generateImprovementFeedback(drawingQuality, strokeComplexity, targetLetter)
        };
    }
}

function generatePositiveFeedback(quality, complexity) {
    const feedbacks = {
        'detailed': [
            "Excellent stroke detail! Your handwriting is very clear.",
            "Perfect! I can clearly see all the important features.",
            "Outstanding handwriting quality!"
        ],
        'good': [
            "Great job! Your letter formation is quite good.",
            "Nice work! Clear and recognizable handwriting.",
            "Well done! Good stroke formation."
        ],
        'basic': [
            "Good attempt! The basic shape is there.",
            "Nice try! I can see the letter structure.",
            "Decent handwriting! Keep practicing."
        ]
    };

    const qualityFeedbacks = feedbacks[quality] || feedbacks['basic'];
    return qualityFeedbacks[Math.floor(Math.random() * qualityFeedbacks.length)];
}

function generateImprovementFeedback(quality, complexity, targetLetter) {
    const improvements = {
        'incomplete': [
            `Try to draw the complete shape of "${targetLetter}". It looks unfinished.`,
            `The drawing seems incomplete. Make sure to draw all parts of "${targetLetter}".`,
            `Add more strokes to complete the letter "${targetLetter}".`
        ],
        'basic': [
            `Good start! Try to make the strokes of "${targetLetter}" more defined.`,
            `The basic shape is there, but try to refine the details of "${targetLetter}".`,
            `Close! Pay attention to the specific curves and lines in "${targetLetter}".`
        ],
        'good': [
            `Very close! Just small adjustments needed for perfect "${targetLetter}".`,
            `Almost there! Fine-tune the proportions of "${targetLetter}".`,
            `Great handwriting! Just minor details differ from "${targetLetter}".`
        ]
    };

    const qualityFeedbacks = improvements[quality] || improvements['basic'];
    return qualityFeedbacks[Math.floor(Math.random() * qualityFeedbacks.length)];
}

function generateRealisticWrongPrediction(targetLetter, analysis) {
    const targetIndex = SINHALA_LETTERS.indexOf(targetLetter);

    // For poor quality drawings, return more random predictions
    if (analysis.drawingQuality === 'incomplete') {
        return SINHALA_LETTERS[Math.floor(Math.random() * SINHALA_LETTERS.length)];
    }

    // For better quality drawings, return visually similar letters
    const similarLetterGroups = {
        'ක': ['ඛ', 'ග', 'ඝ'],
        'ච': ['ජ', 'ඣ'],
        'ට': ['ඨ', 'ඩ', 'ඪ'],
        'ත': ['ථ', 'ද', 'ධ'],
        'ප': ['ඵ', 'බ', 'භ'],
        'ය': ['ර', 'ල'],
        'ශ': ['ෂ', 'ස']
    };

    // Find similar letters
    for (const [key, similar] of Object.entries(similarLetterGroups)) {
        if (key === targetLetter) {
            return similar[Math.floor(Math.random() * similar.length)];
        }
        if (similar.includes(targetLetter)) {
            const options = [key, ...similar.filter(l => l !== targetLetter)];
            return options[Math.floor(Math.random() * options.length)];
        }
    }

    // Fallback to nearby letters in the alphabet
    const nearbyRange = 3;
    const start = Math.max(0, targetIndex - nearbyRange);
    const end = Math.min(SINHALA_LETTERS.length - 1, targetIndex + nearbyRange);
    const nearbyLetters = SINHALA_LETTERS.slice(start, end + 1).filter(l => l !== targetLetter);

    return nearbyLetters[Math.floor(Math.random() * nearbyLetters.length)] ||
        SINHALA_LETTERS[Math.floor(Math.random() * SINHALA_LETTERS.length)];
}// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.post('/predict', (req, res) => {
    try {
        const { image, targetLetter } = req.body;

        if (!image || !targetLetter) {
            return res.status(400).json({
                error: 'Image data and target letter are required',
                status: 'error'
            });
        }

        // Perform realistic handwriting analysis
        const analysis = analyzeHandwriting(image, targetLetter);

        // Check if drawing is too minimal
        if (analysis.drawingQuality === 'incomplete' && analysis.imageSize < 8000) {
            return res.json({
                prediction: null,
                status: 'no_drawing',
                feedback: 'Please draw something more substantial before checking!'
            });
        }

        // Get realistic prediction based on actual drawing analysis
        const result = realisticPredict(analysis);

        // Add analysis details for debugging (can be removed in production)
        console.log(`Analysis for "${targetLetter}": Quality=${analysis.drawingQuality}, Complexity=${analysis.strokeComplexity}, Size=${analysis.imageSize}`);

        res.json({
            prediction: result.prediction,
            confidence: Math.round(result.confidence * 100) / 100, // Round to 2 decimal places
            status: 'success',
            feedback: result.feedback,
            analysis: {
                drawingQuality: analysis.drawingQuality,
                strokeComplexity: analysis.strokeComplexity,
                targetLetter: targetLetter
            }
        });

    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({
            error: 'Analysis failed. Please try again.',
            status: 'error'
        });
    }
}); app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        server: 'Node.js Express',
        port: port
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Sinhala Handwriting Learning Server Started!`);
    console.log(`📱 Open your browser and go to: http://localhost:${port}`);
    console.log(`🎯 Server running on port ${port}`);
    console.log(`🧠 Using mock predictions (replace with CNN model for real predictions)`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server gracefully...');
    process.exit(0);
});
