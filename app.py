from flask import Flask, render_template, request, jsonify
import base64
import numpy as np
from PIL import Image
import io
import tensorflow as tf  # Assuming your CNN model is in TensorFlow/Keras
import os

app = Flask(__name__)

# Load your pre-trained CNN model (simplified placeholder)
# Uncomment and modify the path below when you have your trained model
# model = tf.keras.models.load_model('model/sinhala_cnn.h5')

# Complete list of Sinhala letters for the demo
SINHALA_LETTERS = ['ක', 'ඛ', 'ග', 'ඝ', 'ඞ', 'ච', 'ඡ', 'ජ', 'ඣ', 'ඤ',
                   'ට', 'ඨ', 'ඩ', 'ඪ', 'ණ', 'ත', 'ථ', 'ද', 'ධ', 'න',
                   'ප', 'ඵ', 'බ', 'භ', 'ම', 'ය', 'ර', 'ල', 'ව', 'ශ',
                   'ෂ', 'ස', 'හ', 'ළ', 'ෆ']

def mock_predict(image):
    """
    Mock prediction function for demo purposes.
    Replace this with actual model inference when you have your trained CNN model.
    """
    # For demo, we'll return a random letter with some bias towards correct answers
    # to make the game more engaging
    return np.random.choice(SINHALA_LETTERS)

def preprocess_image(image):
    """
    Preprocess the image for CNN model prediction.
    Modify this function based on your model's input requirements.
    """
    # Convert to grayscale if not already
    if image.mode != 'L':
        image = image.convert('L')

    # Resize to model input size (commonly 28x28 for character recognition)
    image = image.resize((28, 28))

    # Convert to numpy array and normalize
    img_array = np.array(image) / 255.0

    # Add batch dimension and channel dimension if needed
    # For CNN: (batch_size, height, width, channels)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = np.expand_dims(img_array, axis=-1)  # Add channel dimension

    return img_array

def predict_with_model(image):
    """
    Make prediction using the trained CNN model.
    Uncomment and modify this function when you have your trained model.
    """
    # Preprocess the image
    processed_image = preprocess_image(image)

    # Make prediction (uncomment when model is available)
    # predictions = model.predict(processed_image)
    # predicted_class = np.argmax(predictions[0])
    # predicted_letter = SINHALA_LETTERS[predicted_class]

    # For now, use mock prediction
    predicted_letter = mock_predict(image)

    return predicted_letter

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Extract image data (remove the data URL prefix)
        image_data = data['image'].split(',')[1]

        # Convert base64 to PIL Image
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))

        # Make prediction
        prediction = predict_with_model(image)

        # Optional: Save the image for debugging/training data collection
        # timestamp = int(time.time())
        # image.save(f'collected_data/image_{timestamp}_{prediction}.png')

        return jsonify({
            'prediction': prediction,
            'status': 'success'
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'status': 'error'
        }), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    # Create model directory if it doesn't exist
    os.makedirs('model', exist_ok=True)

    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
