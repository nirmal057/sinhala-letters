# 🎯 Sinhala Letters - AI Handwriting Learning App

An interactive web application for learning Sinhala handwriting with AI-powered feedback and analysis.

![Sinhala Letters App](https://img.shields.io/badge/Version-2.0.0-brightgreen) ![AI Powered](https://img.shields.io/badge/AI-Powered-blue) ![Mobile Ready](https://img.shields.io/badge/Mobile-Ready-orange)

## ✨ Features

### 🧠 AI-Powered Analysis
- **Real-time handwriting recognition** using TensorFlow.js
- **Intelligent feedback system** with confidence scoring
- **Stroke pattern analysis** for accurate letter formation
- **Smart fallback system** for consistent performance

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Smooth animations** and visual feedback
- **Progress tracking** through all 35 Sinhala letters
- **Celebration effects** for successful recognition
- **Glass-morphism design** with gradient animations

### 📱 Mobile Optimized
- **Touch-friendly canvas** for drawing
- **Responsive layout** for all screen sizes
- **Optimized performance** for mobile devices
- **Intuitive gesture support**

### 🚀 Advanced Features
- **Multiple AI models** (CNN with TensorFlow.js)
- **Real-time statistics** and performance tracking
- **Detailed analysis reports** with suggestions
- **API endpoints** for integration
- **Professional server implementation**

## 🏗️ Project Structure

```
sinhala-handwriting-app/
├── 📄 smooth-ai-master.html     # Main application (standalone)
├── 📄 fixed-ai-demo.html        # Alternative demo version
├── 🖥️ server-smooth.js          # Enhanced Node.js server
├── 🖥️ server.js                 # Basic server implementation
├── 📂 templates/
│   └── 📄 index.html            # Server template
├── 📂 static/
│   ├── 🎨 style.css             # Styling
│   └── 📜 script.js             # Frontend logic
└── 📄 README.md                 # This file
```

## 🚀 Quick Start

### Option 1: Standalone Version (Recommended)
1. Open `smooth-ai-master.html` directly in your browser
2. Start drawing Sinhala letters immediately!

### Option 2: Server Version
1. **Install dependencies:**
   ```bash
   npm install express cors
   ```

2. **Start the server:**
   ```bash
   node server-smooth.js
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🎮 How to Use

1. **� Draw** the displayed Sinhala letter on the canvas
2. **🤖 Click "Analyze Writing"** to get AI feedback
3. **📊 Review** detailed analysis and suggestions
4. **⏭️ Progress** to the next letter upon success
5. **🏆 Complete** all 35 letters of the Sinhala alphabet

## 🛠️ Technology Stack

### Frontend
- **HTML5 Canvas** for drawing interface
- **CSS3** with modern animations and gradients
- **Vanilla JavaScript** for optimal performance
- **TensorFlow.js** for client-side AI processing

### Backend (Optional)
- **Node.js** with Express framework
- **CORS** for cross-origin requests
- **RESTful API** design
- **Real-time analytics** and statistics

### AI/ML
- **TensorFlow.js** CNN models
- **Custom prediction algorithms**
- **Stroke pattern analysis**
- **Multi-model ensemble approach**

## 📊 API Endpoints

When using the server version:

- `GET /` - Main application
- `GET /api/health` - Server health and statistics
- `POST /api/analyze` - Handwriting analysis
- `GET /api/stats` - Usage statistics
- `GET /api/random-letter` - Get random letter for practice

## 🎯 Sinhala Alphabet Coverage

The app covers all **35 core Sinhala letters**:
```
ක ඛ ග ඝ ඞ ච ඡ ජ ඣ ඤ
ට ඨ ඩ ඪ ණ ත ථ ද ධ න
ප ඵ බ භ ම ය ර ල ව ශ
ෂ ස හ ළ ෆ
```

## 🔧 Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/nirmal057/sinhala-letters.git
cd sinhala-letters

# For standalone version - just open HTML file
# For server version:
npm install express cors
node server-smooth.js
```

### Features in Development
- [ ] Advanced CNN model training
- [ ] Voice feedback integration
- [ ] Multi-user progress tracking
- [ ] Advanced analytics dashboard
- [ ] Offline PWA support

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Sinhala language community for cultural preservation
- TensorFlow.js team for amazing ML tools
- Open source community for inspiration and support

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/nirmal057/sinhala-letters/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/nirmal057/sinhala-letters/discussions)
- 📧 **Contact**: Create an issue for support

## 🚀 Live Demo

Try the live version: [Sinhala Letters App](https://nirmal057.github.io/sinhala-letters/)

---

**Made with ❤️ for preserving and teaching the beautiful Sinhala script**

![Sinhala Script](https://img.shields.io/badge/Script-සිංහල-red) ![Education](https://img.shields.io/badge/Purpose-Education-green) ![Open Source](https://img.shields.io/badge/License-MIT-blue)
```

## Setup Instructions

### 1. Install Dependencies

```bash
pip install flask tensorflow pillow numpy
```

Or install from requirements file:

```bash
pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

### 3. Access the Application

Open your web browser and navigate to:
```
http://localhost:5000
```

## Integrating Your CNN Model

To replace the mock prediction with your actual CNN model:

1. **Place your trained model file** in the `model/` directory
2. **Update the model loading** in `app.py`:
   ```python
   # Uncomment this line and update the path
   model = tf.keras.models.load_model('model/your_model_name.h5')
   ```
3. **Modify the prediction function** in `app.py`:
   ```python
   def predict_with_model(image):
       processed_image = preprocess_image(image)
       predictions = model.predict(processed_image)
       predicted_class = np.argmax(predictions[0])
       predicted_letter = SINHALA_LETTERS[predicted_class]
       return predicted_letter
   ```

## Customization

### Adding More Letters
Update the `SINHALA_LETTERS` list in `app.py` and the corresponding list in `script.js`.

### Changing Canvas Size
Modify the canvas dimensions in `index.html` and update the CSS accordingly.

### Styling
Edit `static/style.css` to change colors, fonts, and layout.

## API Endpoints

- `GET /` - Main application page
- `POST /predict` - Submit handwriting for prediction
- `GET /health` - Health check endpoint

## Model Requirements

Your CNN model should:
- Accept 28x28 grayscale images
- Output predictions for Sinhala characters
- Be trained on similar handwriting data

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Mobile Support

The application includes touch event handling for mobile devices and tablets.

## Future Enhancements

- Stroke order guidance
- Multiple difficulty levels
- User accounts and progress saving
- Multiplayer mode
- Audio pronunciation
- Writing speed analysis

## Troubleshooting

### Common Issues

1. **Model not loading**: Check the model file path and format
2. **Canvas not working**: Ensure JavaScript is enabled
3. **Prediction errors**: Check server logs for detailed error messages

### Development Mode

The Flask app runs in debug mode by default. For production deployment:
- Set `debug=False` in `app.py`
- Use a production WSGI server like Gunicorn
- Configure proper error handling and logging

## Contributing

Feel free to contribute improvements such as:
- Better UI/UX design
- Additional language support
- Performance optimizations
- Bug fixes

## License

This project is open source. Feel free to use and modify as needed.
