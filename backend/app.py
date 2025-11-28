import os
import io
import sqlite3
import uuid
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

IMG_SIZE = int(os.getenv("IMG_SIZE", "224"))
MODEL_PATH = os.getenv("MODEL_PATH", "model/my_model.keras")
THRESHOLD = float(os.getenv("THRESHOLD", "0.5"))
UPLOAD_FOLDER = "uploaded_images"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app = Flask(__name__)
CORS(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = "supersecretkey123"  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

DATABASE = "database.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


print("Loading model...")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")

model = load_model(MODEL_PATH, compile=False)


def preprocess_image_pil(pil_img: Image.Image) -> np.ndarray:
    pil_img = ImageOps.exif_transpose(pil_img)
    pil_img = pil_img.convert("RGB")
    pil_img = pil_img.resize((IMG_SIZE, IMG_SIZE))
    x = image.img_to_array(pil_img)
    x = x / 255.0
    x = np.expand_dims(x, axis=0)
    return x


@app.route("/", methods=["GET"])
def home():
    return "Pneumonia Detection API with Login is running!"


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username & password required"}), 400

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM User WHERE username = ?", (username,))
    if cur.fetchone():
        return jsonify({"error": "Username already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    cur.execute("INSERT INTO User (username, password) VALUES (?, ?)", (username, hashed_pw))
    conn.commit()
    conn.close()

    return jsonify({"message": "User registered successfully!"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM User WHERE username = ?", (username,))
    user = cur.fetchone()

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid username or password"}), 401

    token = create_access_token(identity=str(user["id"]))
    return jsonify({"token": token})


@app.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    user_id = get_jwt_identity()

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    f = request.files["file"]

    patient_name = None
    if "patientName" in request.form:
        patient_name = request.form.get("patientName")
    elif request.is_json:
        patient_name = request.json.get("patientName", None)

    if not patient_name:
        patient_name = "unknown"

    try:
        ext = os.path.splitext(f.filename)[1]  # e.g. '.jpg'
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        f.save(filepath)
    except Exception as e:
        return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

    try:
        pil_img = Image.open(filepath)
    except Exception as e:
        return jsonify({"error": f"Invalid image: {str(e)}"}), 400

    x = preprocess_image_pil(pil_img)
    prob = float(model.predict(x, verbose=0)[0][0])
    label = "Pneumonia" if prob >= THRESHOLD else "Normal"

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Image (user_id, prediction_type, confidence_level, image_path, created_at, patient_name)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, label, prob, filepath, datetime.now().isoformat(), patient_name))
    conn.commit()
    conn.close()

    return jsonify({
        "prediction": label,
        "probability": prob,
        "threshold": THRESHOLD,
        "image_url": f"/images/{filename}"
    })


@app.route("/history", methods=["GET"])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, prediction_type, confidence_level, image_path, created_at, patient_name
        FROM Image
        WHERE user_id = ?
        ORDER BY created_at DESC
    """, (user_id,))
    rows = cur.fetchall()
    conn.close()

    history_list = []
    for row in rows:
        image_url = None
        if row["image_path"]:
            filename = os.path.basename(row["image_path"])
            image_url = f"/images/{filename}"
        history_list.append({
            "id": row["id"],
            "prediction": row["prediction_type"],
            "probability": row["confidence_level"],
            "patientName": row["patient_name"],
            "date": row["created_at"],
            "preview": image_url
        })

    return jsonify({"history": history_list})


@app.route("/images/<filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    print(f"Starting server on {host}:{port}")
    app.run(debug=debug, host=host, port=port)
