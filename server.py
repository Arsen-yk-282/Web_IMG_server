import os
from flask import Flask, request, redirect, url_for, render_template, jsonify
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
PHOTO_JSON = 'photos.json'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)
        file.save(upload_path)

        try:
            with open(PHOTO_JSON, 'r', encoding='utf-8') as f:
                photos = json.load(f)
        except FileNotFoundError:
            photos = []

        new_photo = {
            "path": f"uploads/{filename}",
            "likes": 0,
            "category": request.form.get('category'),
            "view": request.form.get('view')
        }
        photos.append(new_photo)
        with open(PHOTO_JSON, 'w', encoding='utf-8') as f:
            json.dump(photos, f, ensure_ascii=False, indent=4)

        return redirect(url_for('index'))
    return 'Invalid file', 400

@app.route('/')
def index():
    try:
        with open(PHOTO_JSON, 'r', encoding='utf-8') as f:
            photos = json.load(f)
    except FileNotFoundError:
        photos = []
    return render_template('index.html', photos=photos)

@app.route('/delete-photo', methods=['POST'])
def delete_photo():
    data = request.json
    photo_path = data['path']

    try:
        with open(PHOTO_JSON, 'r', encoding='utf-8') as f:
            photos = json.load(f)
    except FileNotFoundError:
        photos = []

    photos = [photo for photo in photos if photo['path'] != photo_path]

    with open(PHOTO_JSON, 'w', encoding='utf-8') as f:
        json.dump(photos, f, ensure_ascii=False, indent=4)

    file_path = os.path.join('static', photo_path)
    if os.path.exists(file_path):
        os.remove(file_path)

    return jsonify({'success': True})

@app.route('/like-photo', methods=['POST'])
def like_photo():
    data = request.get_json()
    photo_path = data.get('path')

    try:
        with open(PHOTO_JSON, 'r', encoding='utf-8') as f:
            photos = json.load(f)

        for photo in photos:
            if photo['path'] == photo_path:
                photo['likes'] += 1
                break

        with open(PHOTO_JSON, 'w', encoding='utf-8') as f:
            json.dump(photos, f, ensure_ascii=False, indent=4)

        return jsonify(success=True)

    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
