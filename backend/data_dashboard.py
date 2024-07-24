from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use the 'Agg' backend which doesn't require a GUI
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)
CORS(app)

def create_graph(data, chart_type='bar', color='#1890ff'):
    df = pd.DataFrame(data)
    plt.figure(figsize=(10, 6))
    
    if chart_type == 'bar':
        plot = sns.barplot(x='category', y='value', data=df, color=color)
    elif chart_type == 'line':
        plot = sns.lineplot(x='category', y='value', data=df, color=color)
    elif chart_type == 'pie':
        plt.pie(df['value'], labels=df['category'], autopct='%1.1f%%', colors=[color])
        plt.axis('equal')
    else:
        raise ValueError(f"Unsupported chart type: {chart_type}")

    plt.title(f"{chart_type.capitalize()} Chart of Data")
    plt.xlabel("Category")
    plt.ylabel("Value")
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return img_base64

@app.route('/data', methods=['POST'])
def handle_data():
    try:
        data = request.json['data']
        chart_type = request.json.get('chartType', 'bar')
        color = request.json.get('color', '#1890ff')
        
        # Input validation
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Invalid data format'}), 400
        
        for item in data:
            if not isinstance(item, dict) or 'category' not in item or 'value' not in item:
                return jsonify({'error': 'Invalid data structure'}), 400
        
        img_base64 = create_graph(data, chart_type, color)
        return jsonify({'message': 'Data received', 'graph': img_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, threaded=True)