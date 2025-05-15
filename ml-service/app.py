from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import re
import numpy as np

app = Flask(__name__)
CORS(app)

# Load dataset
print("Loading dataset...")
data_df = pd.read_csv('ml-service/products.csv')

# Load trained model
print("Loading model...")
model = joblib.load('ml-service/product_rating_model.joblib')

# Helper function to extract dimensions
def extract_dimensions(dim_str):
    try:
        dims = re.findall(r'(\d+)x(\d+)x(\d+)', dim_str)[0]
        return [int(d) for d in dims]
    except:
        return [None, None, None]

@app.route('/predict-rating', methods=['POST'])
def predict_rating():
    """Predict product rating based on product features"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Check if product ID is provided for lookup
        if 'productId' in data:
            product_id = data.get('productId')
            matched = data_df[data_df['Product ID'] == product_id]
            
            if not matched.empty:
                # Return the actual rating from the dataset
                product = matched.iloc[0]
                return jsonify({
                    'product_id': product_id,
                    'product_name': product.get('Product Name', 'Unknown'),
                    'rating': int(product.get('Product Ratings', 0)),
                    'source': 'database'
                })
        
        # Prepare data for model prediction
        product_data = pd.DataFrame({
            'Product Name': [data.get('productName', '')],
            'Product Category': [data.get('category', '')],
            'Product Description': [data.get('description', '')],
            'Stock Quantity': [data.get('stockQuantity', 0)],
            'Product Dimensions': [data.get('dimensions', '0x0x0 cm')],
            'Product Tags': [data.get('tags', '')],
            'Color/Size Variations': [data.get('variations', '')]
        })
        
        # Make prediction using the model
        prediction = model.predict(product_data)[0]
        # Round to nearest integer (1-5)
        rounded_prediction = max(1, min(5, round(prediction)))
        
        return jsonify({
            'product_name': data.get('productName', 'Unknown'),
            'rating': int(rounded_prediction),
            'source': 'model',
            'confidence': float(abs(prediction - rounded_prediction) < 0.5)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """Predict ratings for multiple products at once"""
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Invalid data format. Expected list of products'}), 400
            
        # Prepare batch data for prediction
        product_data = pd.DataFrame({
            'Product Name': [item.get('productName', '') for item in data],
            'Product Category': [item.get('category', '') for item in data],
            'Product Description': [item.get('description', '') for item in data],
            'Stock Quantity': [item.get('stockQuantity', 0) for item in data],
            'Product Dimensions': [item.get('dimensions', '0x0x0 cm') for item in data],
            'Product Tags': [item.get('tags', '') for item in data],
            'Color/Size Variations': [item.get('variations', '') for item in data]
        })
        
        # Make predictions for all products
        predictions = model.predict(product_data)
        # Round to nearest integers (1-5)
        rounded_predictions = [max(1, min(5, round(p))) for p in predictions]
        
        # Format response
        results = []
        for i, item in enumerate(data):
            results.append({
                'product_name': item.get('productName', 'Unknown'),
                'rating': int(rounded_predictions[i]),
                'source': 'model',
                'confidence': float(abs(predictions[i] - rounded_predictions[i]) < 0.5)
            })
            
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model': 'product_rating_model'})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=False) 