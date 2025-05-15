import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
import xgboost as xgb
import re
import joblib
import warnings
warnings.filterwarnings('ignore')

# Load the data
print("Loading data...")
data = pd.read_csv('ml-service/products.csv')

# Basic data exploration
print(f"Dataset shape: {data.shape}")
print("\nData types:")
print(data.dtypes)

# Check for missing values
print("\nMissing values:")
print(data.isnull().sum())

# Feature selection - using the specified features
features = ['Product Name', 'Product Category', 'Product Description', 
            'Stock Quantity', 'Product Dimensions', 'Product Tags', 
            'Color/Size Variations']
target = 'Product Ratings'

# Extract dimensions as numerical features
def extract_dimensions(dim_str):
    try:
        dims = re.findall(r'(\d+)x(\d+)x(\d+)', dim_str)[0]
        return [int(d) for d in dims]
    except:
        return [None, None, None]

print("\nExtracting dimensions from Product Dimensions...")
dimensions = data['Product Dimensions'].apply(extract_dimensions)
data['Width'] = [d[0] if d[0] is not None else np.nan for d in dimensions]
data['Height'] = [d[1] if d[1] is not None else np.nan for d in dimensions]
data['Depth'] = [d[2] if d[2] is not None else np.nan for d in dimensions]

# Preparing the features
X = data[features]
y = data[target]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\nPreparing preprocessing pipelines...")
# Define preprocessing for text features
text_features = ['Product Name', 'Product Description', 'Product Tags']
categorical_features = ['Product Category', 'Color/Size Variations']
numeric_features = ['Stock Quantity', 'Width', 'Height', 'Depth']

# Preprocessing for text features
text_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value='')),
    ('tfidf', TfidfVectorizer(max_features=100))
])

# Preprocessing for categorical features
categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('encoder', LabelEncoder())
])

# Preprocessing for numeric features
numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Combine preprocessing steps
preprocessor = ColumnTransformer(
    transformers=[
        ('text', text_transformer, text_features),
        ('cat', categorical_transformer, categorical_features),
        ('num', numeric_transformer, numeric_features)
    ],
    remainder='drop'
)

# Define the model pipeline
model = Pipeline([
    ('preprocessor', preprocessor),
    ('xgboost', xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42
    ))
])

# Train the model
print("\nTraining XGBoost model...")
model.fit(X_train, y_train)

# Evaluate the model
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"\nModel R² score on training data: {train_score:.4f}")
print(f"Model R² score on test data: {test_score:.4f}")

# Save the model
model_filename = 'ml-service/product_rating_model.joblib'
joblib.dump(model, model_filename)
print(f"\nModel saved to {model_filename}")

# Example prediction function
def predict_product_rating(product_data):
    """
    Predict product rating for a new product.
    
    Args:
        product_data: DataFrame with the same features used for training
        
    Returns:
        Predicted rating
    """
    return model.predict(product_data)

# Example usage
print("\nExample prediction with first 5 test samples:")
example_predictions = predict_product_rating(X_test.iloc[:5])
print("Predicted ratings:", example_predictions)
print("Actual ratings:", y_test.iloc[:5].values) 