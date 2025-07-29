# Model Integration Guide

## Integrating Your CNN Model

This file contains instructions for integrating your trained CNN model with the web application.

### Step 1: Prepare Your Model

1. Save your trained Keras/TensorFlow model:
   ```python
   model.save('sinhala_cnn_model.h5')
   ```

2. Place the model file in the `model/` directory

### Step 2: Update Model Loading

In `app.py`, update the model loading section:

```python
# Replace the mock prediction with actual model loading
import tensorflow as tf

# Load your trained model
model = tf.keras.models.load_model('model/sinhala_cnn_model.h5')
```

### Step 3: Update Prediction Function

Modify the `predict_with_model` function in `app.py`:

```python
def predict_with_model(image):
    # Preprocess the image
    processed_image = preprocess_image(image)

    # Make prediction using your trained model
    predictions = model.predict(processed_image)
    predicted_class = np.argmax(predictions[0])

    # Map class index to Sinhala letter
    predicted_letter = SINHALA_LETTERS[predicted_class]

    return predicted_letter
```

### Step 4: Adjust Preprocessing

Modify the `preprocess_image` function based on your model's requirements:

```python
def preprocess_image(image):
    # Convert to grayscale
    if image.mode != 'L':
        image = image.convert('L')

    # Resize to your model's input size
    image = image.resize((28, 28))  # Adjust size as needed

    # Normalize pixel values
    img_array = np.array(image) / 255.0

    # Reshape for your model
    # For CNN: (batch_size, height, width, channels)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = np.expand_dims(img_array, axis=-1)

    return img_array
```

### Step 5: Update Character Mapping

Ensure the `SINHALA_LETTERS` list matches your model's output classes:

```python
# Update this list to match your model's class labels
SINHALA_LETTERS = ['ක', 'ඛ', 'ග', 'ඝ', 'ඞ', ...]  # Your actual labels
```

### Model Requirements

Your CNN model should:
- Accept images in the format expected by `preprocess_image()`
- Output a probability distribution over Sinhala characters
- Have the same number of output classes as `SINHALA_LETTERS`

### Testing Your Integration

1. Run the application: `python app.py`
2. Draw a letter on the canvas
3. Click "Check" to test the prediction
4. Monitor the console for any error messages

### Troubleshooting

- **Model loading errors**: Check file path and TensorFlow version compatibility
- **Prediction errors**: Verify image preprocessing matches training data
- **Wrong predictions**: Ensure class mapping is correct
