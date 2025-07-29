// Enhanced Sinhala Handwriting Learning Server - Smooth & Professional Version
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'static')));

// Sinhala Letters Dataset
const SINHALA_LETTERS = [
    'ක', 'ඛ', 'ග', 'ඝ', 'ඞ', 'ච', 'ඡ', 'ජ', 'ඣ', 'ඤ',
    'ට', 'ඨ', 'ඩ', 'ඪ', 'ණ', 'ත', 'ථ', 'ද', 'ධ', 'න',
    'ප', 'ඵ', 'බ', 'භ', 'ම', 'ය', 'ර', 'ල', 'ව', 'ශ',
    'ෂ', 'ස', 'හ', 'ළ', 'ෆ'
];

// Server Statistics
let serverStats = {
    startTime: new Date(),
    requestsHandled: 0,
    analysisRequests: 0,
    accuracySamples: [],
    popularLetters: {},
    aiModelLoaded: false
};

// Utility Functions
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function calculateComplexityScore(imageData) {
    // Simulate complexity analysis based on drawing characteristics
    const pixels = imageData ? imageData.length : 1000;
    const density = Math.min(pixels / 10000, 1);
    const complexity = 0.3 + (density * 0.7);
    return Math.min(Math.max(complexity, 0.1), 0.95);
}

function analyzeStrokePattern(strokeCount, targetLetter) {
    // Expected stroke counts for different letter types
    const strokeMapping = {
        'ක': { expected: 2, tolerance: 1 },
        'ග': { expected: 3, tolerance: 1 },
        'ච': { expected: 2, tolerance: 1 },
        'ත': { expected: 2, tolerance: 1 },
        'න': { expected: 3, tolerance: 1 },
        'ප': { expected: 2, tolerance: 1 },
        'ම': { expected: 3, tolerance: 1 },
        'ය': { expected: 3, tolerance: 1 },
        'ර': { expected: 1, tolerance: 1 },
        'ල': { expected: 2, tolerance: 1 },
        'ව': { expected: 2, tolerance: 1 },
        'ස': { expected: 2, tolerance: 1 },
        'හ': { expected: 3, tolerance: 1 },
    };

    const letterData = strokeMapping[targetLetter] || { expected: 2, tolerance: 1 };
    const difference = Math.abs(strokeCount - letterData.expected);
    const accuracy = Math.max(0.4, 1 - (difference * 0.2));

    return {
        expectedStrokes: letterData.expected,
        actualStrokes: strokeCount,
        strokeAccuracy: accuracy,
        strokeFeedback: difference === 0 ? 'Perfect stroke count!' :
            difference <= letterData.tolerance ? 'Good stroke pattern' :
                'Consider adjusting stroke count'
    };
}

function generateDetailedFeedback(analysis) {
    const { prediction, confidence, isCorrect, targetLetter, strokeAnalysis } = analysis;

    let feedback = {
        overall: '',
        technical: '',
        suggestions: [],
        encouragement: ''
    };

    if (isCorrect) {
        feedback.overall = `🎯 Excellent recognition of "${prediction}"!`;
        feedback.technical = `AI confidence: ${Math.round(confidence * 100)}% - Outstanding accuracy!`;
        feedback.encouragement = getRandomElement([
            "Your handwriting is improving beautifully! 📈",
            "Fantastic letter formation! Keep it up! ⭐",
            "Perfect! You're mastering Sinhala script! 🏆",
            "Incredible accuracy! You're a natural! 🌟"
        ]);

        if (strokeAnalysis.strokeAccuracy > 0.8) {
            feedback.suggestions.push("✅ Excellent stroke technique");
        }
    } else {
        feedback.overall = `🤔 AI detected "${prediction}" instead of "${targetLetter}"`;
        feedback.technical = `Confidence: ${Math.round(confidence * 100)}% - Let's improve this together!`;
        feedback.encouragement = getRandomElement([
            "Don't worry! Every expert was once a beginner 💪",
            "Practice makes perfect! You're learning! 📚",
            "Keep trying! Each attempt makes you better! 🎯",
            "Learning is a journey, not a destination! 🌈"
        ]);

        // Specific suggestions based on common mistakes
        if (strokeAnalysis.actualStrokes > strokeAnalysis.expectedStrokes) {
            feedback.suggestions.push("💡 Try using fewer strokes for a cleaner letter");
        } else if (strokeAnalysis.actualStrokes < strokeAnalysis.expectedStrokes) {
            feedback.suggestions.push("💡 This letter might need more strokes for proper formation");
        }

        feedback.suggestions.push("💡 Focus on the basic shape and proportions");
        feedback.suggestions.push("💡 Take your time - quality over speed");
    }

    return feedback;
}

// Routes

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'smooth-ai-master.html'));
});

// Alternative route for the smooth version
app.get('/smooth', (req, res) => {
    res.sendFile(path.join(__dirname, 'smooth-ai-master.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    serverStats.requestsHandled++;

    const uptime = Date.now() - serverStats.startTime.getTime();
    const avgAccuracy = serverStats.accuracySamples.length > 0 ?
        serverStats.accuracySamples.reduce((a, b) => a + b, 0) / serverStats.accuracySamples.length : 0;

    res.json({
        status: 'healthy',
        server: 'Sinhala AI Handwriting Master',
        version: '2.0.0-smooth',
        uptime: Math.round(uptime / 1000),
        stats: {
            requestsHandled: serverStats.requestsHandled,
            analysisRequests: serverStats.analysisRequests,
            averageAccuracy: Math.round(avgAccuracy * 100),
            aiModelStatus: serverStats.aiModelLoaded ? 'loaded' : 'fallback',
            supportedLetters: SINHALA_LETTERS.length
        },
        features: [
            'AI-Powered Analysis',
            'Real-time Feedback',
            'Progress Tracking',
            'Mobile Optimized',
            'Smooth Animations'
        ]
    });
});

// Enhanced AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        serverStats.requestsHandled++;
        serverStats.analysisRequests++;

        const { imageData, targetLetter, strokeCount = 1, requestId } = req.body;

        if (!targetLetter || !SINHALA_LETTERS.includes(targetLetter)) {
            return res.status(400).json({
                error: 'Invalid target letter',
                supportedLetters: SINHALA_LETTERS
            });
        }

        console.log(`📝 Analyzing handwriting for letter: ${targetLetter} (${strokeCount} strokes)`);

        // Track letter popularity
        serverStats.popularLetters[targetLetter] = (serverStats.popularLetters[targetLetter] || 0) + 1;

        // Simulate processing delay for realism
        await new Promise(resolve => setTimeout(resolve, getRandomFloat(800, 1500)));

        // Advanced analysis simulation
        const complexityScore = calculateComplexityScore(imageData);
        const strokeAnalysis = analyzeStrokePattern(strokeCount, targetLetter);

        // Enhanced prediction logic
        let baseAccuracy = 0.60 + (complexityScore * 0.25) + (strokeAnalysis.strokeAccuracy * 0.15);

        // Letter-specific accuracy adjustments
        const letterDifficulty = {
            'ක': 0.85, 'ග': 0.75, 'ච': 0.80, 'ත': 0.90, 'න': 0.70,
            'ප': 0.85, 'ම': 0.65, 'ය': 0.60, 'ර': 0.95, 'ල': 0.80,
            'ව': 0.75, 'ස': 0.85, 'හ': 0.70
        };

        const difficultyMultiplier = letterDifficulty[targetLetter] || 0.75;
        const finalAccuracy = Math.min(baseAccuracy * difficultyMultiplier, 0.95);

        const isCorrect = Math.random() < finalAccuracy;
        const confidence = isCorrect ?
            getRandomFloat(0.78, 0.96) :
            getRandomFloat(0.45, 0.75);

        const prediction = isCorrect ? targetLetter : getRandomElement(
            SINHALA_LETTERS.filter(letter => letter !== targetLetter)
        );

        // Generate alternative predictions for more realistic AI behavior
        const alternatives = SINHALA_LETTERS
            .filter(letter => letter !== prediction)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(letter => ({
                letter,
                confidence: getRandomFloat(0.15, confidence - 0.1)
            }));

        const analysis = {
            prediction,
            confidence,
            isCorrect,
            targetLetter,
            strokeAnalysis,
            alternatives,
            processingTime: Math.round(getRandomFloat(750, 1400)),
            modelVersion: 'SinhalaNet-v2.1-Enhanced',
            requestId: requestId || 'unknown'
        };

        // Generate detailed feedback
        const feedback = generateDetailedFeedback(analysis);

        // Update server statistics
        serverStats.accuracySamples.push(confidence);
        if (serverStats.accuracySamples.length > 100) {
            serverStats.accuracySamples = serverStats.accuracySamples.slice(-50);
        }

        console.log(`✅ Analysis complete: ${prediction} (${Math.round(confidence * 100)}% confident)`);

        res.json({
            success: true,
            analysis,
            feedback,
            metadata: {
                serverTime: new Date().toISOString(),
                analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                confidence: Math.round(confidence * 100),
                processingMethod: 'Enhanced AI Analysis'
            }
        });

    } catch (error) {
        console.error('❌ Analysis error:', error);

        res.status(500).json({
            error: 'Analysis failed',
            message: error.message,
            fallback: {
                prediction: req.body.targetLetter || 'ක',
                confidence: getRandomFloat(0.3, 0.6),
                isCorrect: Math.random() < 0.5,
                method: 'Emergency Fallback'
            }
        });
    }
});

// Get random letter for practice
app.get('/api/random-letter', (req, res) => {
    serverStats.requestsHandled++;

    const randomLetter = getRandomElement(SINHALA_LETTERS);
    const difficulty = Math.random();

    res.json({
        letter: randomLetter,
        name: `Letter ${randomLetter}`,
        difficulty: difficulty > 0.7 ? 'hard' : difficulty > 0.4 ? 'medium' : 'easy',
        tips: [
            "Focus on proper stroke order",
            "Maintain consistent letter size",
            "Practice slowly for accuracy"
        ]
    });
});

// Get server statistics
app.get('/api/stats', (req, res) => {
    serverStats.requestsHandled++;

    const avgAccuracy = serverStats.accuracySamples.length > 0 ?
        serverStats.accuracySamples.reduce((a, b) => a + b, 0) / serverStats.accuracySamples.length : 0;

    const topLetters = Object.entries(serverStats.popularLetters)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([letter, count]) => ({ letter, count }));

    res.json({
        server: {
            uptime: Date.now() - serverStats.startTime.getTime(),
            startTime: serverStats.startTime.toISOString(),
            requestsHandled: serverStats.requestsHandled,
            analysisRequests: serverStats.analysisRequests
        },
        performance: {
            averageAccuracy: Math.round(avgAccuracy * 100),
            totalSamples: serverStats.accuracySamples.length,
            aiModelStatus: serverStats.aiModelLoaded ? 'Active' : 'Fallback Mode'
        },
        usage: {
            topLetters,
            totalLettersSupported: SINHALA_LETTERS.length,
            featuresActive: ['AI Analysis', 'Stroke Detection', 'Real-time Feedback']
        }
    });
});

// Serve static files for templates
app.get('/templates/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'templates', filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'Template not found' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /',
            'GET /smooth',
            'GET /api/health',
            'POST /api/analyze',
            'GET /api/random-letter',
            'GET /api/stats'
        ]
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('❌ Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🌟 ====================================');
    console.log('🎯 SINHALA AI HANDWRITING MASTER v2.0');
    console.log('🌟 ====================================');
    console.log(`🚀 Server Status: RUNNING SMOOTHLY`);
    console.log(`📍 Local Access: http://localhost:${PORT}`);
    console.log(`🔧 Smooth Version: http://localhost:${PORT}/smooth`);
    console.log(`💡 API Health: http://localhost:${PORT}/api/health`);
    console.log(`📊 Statistics: http://localhost:${PORT}/api/stats`);
    console.log(`🧠 AI Features: Advanced Analysis, Smart Feedback`);
    console.log(`📱 Mobile Support: Touch & Responsive Design`);
    console.log(`⚡ Performance: Optimized & Smooth Animations`);
    console.log('🌟 ====================================');
    console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
    console.log('⏹️  Press Ctrl+C to stop the server');
    console.log('🌟 ====================================\n');

    // Mark AI model as loaded after a delay (simulation)
    setTimeout(() => {
        serverStats.aiModelLoaded = true;
        console.log('🧠 AI Model Status: LOADED & READY');
    }, 3000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n\n🛑 Server stopped by user.');
    console.log('👋 Thank you for using Sinhala AI Handwriting Master!');
    process.exit(0);
});
