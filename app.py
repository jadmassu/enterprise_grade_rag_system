from flask import Flask, request



app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def hello_world():
    request_data = request.get_json()
    if request.method == 'POST':
        prompt = request_data['prompt']
        return prompt
        