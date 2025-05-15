import pandas as pd
import joblib
import sys

def load_model(model_path='ml-service/product_rating_model.joblib'):
    """Load the trained XGBoost model"""
    try:
        return joblib.load(model_path)
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def predict_single_product(model, product_data):
    """
    Predict rating for a single product
    
    Args:
        model: Loaded model
        product_data: DataFrame with a single row containing product features
        
    Returns:
        Predicted rating
    """
    if model is None:
        return None
        
    try:
        prediction = model.predict(product_data)[0]
        # Round to nearest integer since ratings are typically whole numbers
        return round(prediction)
    except Exception as e:
        print(f"Error making prediction: {e}")
        return None

def main():
    # Load the model
    print("Loading the trained model...")
    model = load_model()
    
    if model is None:
        print("Failed to load model. Make sure to run product_rating_predictor.py first.")
        sys.exit(1)
    
    # Example: Create sample data for prediction
    # This should have the same features that were used for training
    sample_data = pd.DataFrame({
        'Product Name': ['Wireless Earbuds'],
        'Product Category': ['Electronics'],
        'Product Description': ['High-quality wireless earbuds with noise cancellation'],
        'Stock Quantity': [45],
        'Product Dimensions': ['5x5x3 cm'],
        'Product Tags': ['wireless,audio,bluetooth'],
        'Color/Size Variations': ['Black/Medium']
    })
    
    print("\nSample product for prediction:")
    print(sample_data)
    
    # Make prediction
    predicted_rating = predict_single_product(model, sample_data)
    
    if predicted_rating is not None:
        print(f"\nPredicted Product Rating: {predicted_rating}/5")
    
    # Another example: Multiple predictions
    print("\n\nPredicting ratings for multiple products:")
    
    # Create a DataFrame with multiple products
    multiple_products = pd.DataFrame({
        'Product Name': ['Gaming Laptop', 'Smartphone Stand', 'Bluetooth Speaker'],
        'Product Category': ['Electronics', 'Accessories', 'Electronics'],
        'Product Description': ['High-performance gaming laptop', 'Adjustable phone holder', 'Portable waterproof speaker'],
        'Stock Quantity': [12, 87, 34],
        'Product Dimensions': ['35x25x3 cm', '10x8x15 cm', '8x8x10 cm'],
        'Product Tags': ['gaming,laptop,ssd', 'phone,stand,desk', 'speaker,bluetooth,portable'],
        'Color/Size Variations': ['Black/Large', 'White/Small', 'Blue/Medium']
    })
    
    print(multiple_products)
    
    # Make predictions for all products
    if model is not None:
        predictions = model.predict(multiple_products)
        # Round to nearest integers
        predictions = [round(p) for p in predictions]
        
        print("\nPredicted ratings:")
        for i, product in enumerate(multiple_products['Product Name']):
            print(f"{product}: {predictions[i]}/5")

if __name__ == "__main__":
    main() 