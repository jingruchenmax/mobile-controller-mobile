from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
@app.route('/')
def home():
    return "Hello, this is the Flask server!"

@app.route('/button-click', methods=['POST'])
def button_click():
    data = request.json  # Assuming the button click sends JSON data
    print(f"Button clicked with data: {data}")
#   return jsonify({"message": "Button click received!"}), 200

if __name__ == '__main__':
    app.run(debug=True)
