import os
import io
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Configuration
IMG_SIZE = int(os.getenv("IMG_SIZE", "224"))
MODEL_PATH = os.getenv("MODEL_PATH", "model/my_model.keras")
THRESHOLD = float(os.getenv("THRESHOLD", "0.5"))

app = Flask(__name__)
CORS(app)

# Debug info
print("MODEL_PATH (as given):", MODEL_PATH)
print("MODEL_PATH (absolute):", os.path.abspath(MODEL_PATH))
model_dir = os.path.dirname(MODEL_PATH) or "."
try:
    print("Files in model dir:")
    for p in Path(model_dir).glob("*"):
        print(" -", p.name)
except Exception as e:
    print(" (Could not list model dir):", e)

# Load model
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")

model = load_model(MODEL_PATH, compile=False)
if model.inputs:
    shape = tuple(int(d) if d is not None else None for d in model.inputs[0].shape)
    print("Loaded model input shape:", shape)

# Image preprocessing
def preprocess_image_pil(pil_img: Image.Image) -> np.ndarray:
    pil_img = ImageOps.exif_transpose(pil_img)
    pil_img = pil_img.convert("RGB")
    pil_img = pil_img.resize((IMG_SIZE, IMG_SIZE))
    x = image.img_to_array(pil_img)
    x = x / 255.0
    x = np.expand_dims(x, axis=0)
    return x

@app.route("/", methods=["GET"])
def index():
    return "Pneumonia Detection API is running!"

@app.route("/health", methods=["GET"])
def health():
    info = {
        "status": "ok",
        "model_path": os.path.abspath(MODEL_PATH),
        "img_size": IMG_SIZE,
        "threshold": THRESHOLD
    }
    try:
        if model.inputs:
            info["input_shape"] = tuple(
                int(d) if d is not None else None for d in model.inputs[0].shape
            )
    except Exception:
        pass
    return jsonify(info)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided (multipart/form-data, key='file')"}), 400

    f = request.files["file"]
    if not f:
        return jsonify({"error": "Empty file"}), 400

    try:
        img_bytes = f.read()
        pil_img = Image.open(io.BytesIO(img_bytes))
    except Exception as e:
        return jsonify({"error": f"Invalid image file: {str(e)}"}), 400

    x = preprocess_image_pil(pil_img)
    prob = float(model.predict(x, verbose=0)[0][0])

    label = "Pneumonia" if prob >= THRESHOLD else "Normal"

    return jsonify({
        "prediction": label,
        "probability": prob,
        "threshold": THRESHOLD
    })

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    print(f"Starting server on {host}:{port}")
    print(f"IMG_SIZE   = {IMG_SIZE}")
    print(f"THRESHOLD  = {THRESHOLD}")
    app.run(debug=debug, host=host, port=port)
