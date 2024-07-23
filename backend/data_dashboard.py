from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

app = Flask(__name__)
CORS(app)

def create_graph(data):
    df = pd.DataFrame(data)
    plt.figure(figsize=(10, 6))
    plot = sns.barplot(x='category', y='value', data=df)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return img_base64

@app.route('/data', methods=['POST'])
def handle_data():
    data = request.json['data']
    img_base64 = create_graph(data)
    return jsonify({'message': 'Data received', 'graph': img_base64})

if __name__ == '__main__':
    app.run(debug=True)
