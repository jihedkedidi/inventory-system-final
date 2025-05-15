# Product Rating Predictor

This project uses XGBoost to predict product ratings based on various product features including name, category, description, stock quantity, dimensions, tags, and color/size variations.

## Features Used

The model uses the following features from the product data:
- Product Name
- Product Category
- Product Description
- Stock Quantity
- Product Dimensions (converted to width, height, and depth)
- Product Tags
- Color/Size Variations

## Setup

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. Clone this repository or download the files
2. Install the required dependencies:

```
pip install -r requirements.txt
```

## Usage

### Training the Model

To train the model using the provided dataset:

```
python product_rating_predictor.py
```

This will:
1. Load the product data from `products.csv`
2. Preprocess the data (handle missing values, encode categorical features, etc.)
3. Train an XGBoost regression model
4. Evaluate the model's performance
5. Save the trained model to `product_rating_model.joblib`

### Making Predictions

To make predictions using the trained model:

```
python predict_ratings.py
```

This script demonstrates:
1. How to load the trained model
2. How to format input data for single and multiple product predictions
3. How to get product rating predictions

## Flask API for Integration with NestJS Backend

The project includes a Flask API that you can use to integrate with your NestJS backend.

### Starting the API Server

```
python app.py
```

The server will start on port 5000.

### API Endpoints

#### 1. Predict Rating for a Single Product

**Endpoint:** `/predict-rating`
**Method:** POST
**Content-Type:** application/json

**Request Body:**
```json
{
  "productName": "Wireless Earbuds",
  "category": "Electronics",
  "description": "High-quality wireless earbuds with noise cancellation",
  "stockQuantity": 45,
  "dimensions": "5x5x3 cm",
  "tags": "wireless,audio,bluetooth",
  "variations": "Black/Medium"
}
```

You can also look up existing products by ID:
```json
{
  "productId": "93TGNAY7"
}
```

**Response:**
```json
{
  "product_name": "Wireless Earbuds",
  "rating": 4,
  "source": "model",
  "confidence": 0.9
}
```

#### 2. Batch Prediction for Multiple Products

**Endpoint:** `/batch-predict`
**Method:** POST
**Content-Type:** application/json

**Request Body:**
```json
[
  {
    "productName": "Gaming Laptop",
    "category": "Electronics",
    "description": "High-performance gaming laptop",
    "stockQuantity": 12,
    "dimensions": "35x25x3 cm",
    "tags": "gaming,laptop,ssd",
    "variations": "Black/Large"
  },
  {
    "productName": "Bluetooth Speaker",
    "category": "Electronics",
    "description": "Portable waterproof speaker",
    "stockQuantity": 34,
    "dimensions": "8x8x10 cm",
    "tags": "speaker,bluetooth,portable",
    "variations": "Blue/Medium"
  }
]
```

**Response:**
```json
[
  {
    "product_name": "Gaming Laptop",
    "rating": 3,
    "source": "model",
    "confidence": 0.8
  },
  {
    "product_name": "Bluetooth Speaker",
    "rating": 4,
    "source": "model",
    "confidence": 0.7
  }
]
```

#### 3. Health Check

**Endpoint:** `/health`
**Method:** GET

**Response:**
```json
{
  "status": "healthy",
  "model": "product_rating_model"
}
```

### Integration with NestJS

To call this API from your NestJS backend, you can use the `@nestjs/axios` package. Here's an example:

```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(private readonly httpService: HttpService) {}

  async predictProductRating(productData: any): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.post('http://localhost:5000/predict-rating', productData)
    );
    return response.data;
  }
}
```

## Customizing Predictions

To predict ratings for your own products, modify the sample data in `predict_ratings.py` or send custom JSON data to the API endpoints. Make sure to include all the required features with the same format as in the training data.

## Model Details

- Algorithm: XGBoost Regressor
- Text features: Processed using TF-IDF vectorization
- Categorical features: Encoded using LabelEncoder
- Numeric features: Standardized with mean=0 and std=1
- Missing values: Handled with appropriate imputation strategies

## Performance

The model's performance metrics (R² score) are displayed after training. A higher R² score (closer to 1.0) indicates better predictive performance. 