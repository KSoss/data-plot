from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import traceback
import io
import base64
from sklearn.linear_model import LinearRegression
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def create_graph(data, chart_type='bar', colors=None):
    df = pd.DataFrame(data)
    plt.figure(figsize=(10, 6))
    
    if chart_type == 'bar':
        plot = sns.barplot(x='category', y='value', data=df, palette=colors)
    elif chart_type == 'line':
        plot = sns.lineplot(x='category', y='value', data=df, color=list(colors.values())[0] if colors else None)
    elif chart_type == 'pie':
        plt.pie(df['value'], labels=df['category'], autopct='%1.1f%%', colors=list(colors.values()) if colors else None)
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
        colors = request.json.get('colors', {})
        
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Invalid data format'}), 400
        
        for item in data:
            if not isinstance(item, dict) or 'category' not in item or 'value' not in item:
                return jsonify({'error': 'Invalid data structure'}), 400
        
        img_base64 = create_graph(data, chart_type, colors)
        return jsonify({'message': 'Data received', 'graph': img_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze_data():
    try:
        data = request.json.get('data')
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Invalid data format. Expected a list of data points.'}), 400
        
        if len(data) < 2:
            return jsonify({'insufficient_data': True, 'message': 'Insufficient data for analysis. At least two data points are required.'}), 200
        
        df = pd.DataFrame(data)
        
        if 'value' not in df.columns:
            return jsonify({'error': 'Data must contain a "value" column.'}), 400
        
        analysis = {
            'count': len(df),
            'mean': float(df['value'].mean()),
            'median': float(df['value'].median()),
            'min': float(df['value'].min()),
            'max': float(df['value'].max()),
            'total': float(df['value'].sum()),
            'std_dev': float(df['value'].std())
        }
        
        return jsonify({'insufficient_data': False, 'analysis': analysis})
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({'error': 'An internal server error occurred.'}), 500

@app.route('/forecast', methods=['POST'])
def forecast_data():
    try:
        data = request.json['data']
        steps = request.json.get('steps', 3)
        
        df = pd.DataFrame(data)
        X = np.arange(len(df)).reshape(-1, 1)
        y = df['value'].values
        
        model = LinearRegression()
        model.fit(X, y)
        
        future_X = np.arange(len(df), len(df) + steps).reshape(-1, 1)
        future_y = model.predict(future_X)
        
        forecast_data = [
            {'category': f'Forecast {i+1}', 'value': value} 
            for i, value in enumerate(future_y)
        ]
        
        return jsonify({'forecast': forecast_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    app.run(host='0.0.0.0', port=port)