from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  

MODEL_PATH = 'model/final_cnn_model.keras'  
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

model = load_model(MODEL_PATH, compile=False)

def preprocess_image(img):
    img = img.resize((224, 224))
    img = img.convert('RGB')
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    try:
        img = Image.open(file.stream)
    except Exception as e:
        return jsonify({'error': f'Invalid image file: {str(e)}'}), 400

    processed_img = preprocess_image(img)
    prediction = model.predict(processed_img)

    THRESHOLD = 0.5
    result = 'Pneumonia' if prediction[0][0] >= THRESHOLD else 'Normal'

    return jsonify({
        'prediction': result,
        'probability': float(prediction[0][0])
    })

@app.route('/', methods=['GET'])
def index():
    return "Pneumonia Detection API is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
