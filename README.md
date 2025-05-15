# Inventory Management System

A full-stack inventory management system with:

- **Angular 17 Frontend**: A modern UI for managing inventory items
- **NestJS Backend**: RESTful API for handling CRUD operations
- **ML Service**: Machine learning integration for inventory forecasting and optimization

## Project Structure

- `/angular-17-crud-example`: Frontend application built with Angular 17
- `/backend`: Backend API service built with NestJS
- `/ml-service`: Machine learning service for inventory analytics

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Python 3.8+ (for ML service)
- PostgreSQL (or your database of choice)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/inventory-system.git
   cd inventory-system
   ```

2. Set up the backend
   ```
   cd backend
   npm install
   npm run start:dev
   ```

3. Set up the frontend
   ```
   cd angular-17-crud-example
   npm install
   ng serve
   ```

4. Set up the ML service
   ```
   cd ml-service
   pip install -r requirements.txt
   python app.py
   ```

## Features

- Inventory item management (CRUD operations)
- Stock level tracking
- Reporting and analytics
- Predictive inventory forecasting
- User authentication and authorization

## License

This project is licensed under the MIT License - see the LICENSE file for details.