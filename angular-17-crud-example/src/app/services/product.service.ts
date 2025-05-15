import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';

const baseUrl = 'http://localhost:3000/api/products'; // API URL with prefix

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    console.log('Fetching all products');
    return this.http.get<Product[]>(baseUrl)
      .pipe(
        tap(products => console.log(`Retrieved ${products.length} products`)),
        catchError(this.handleError)
      );
  }

  get(id: any): Observable<Product> {
    console.log(`Fetching product with ID: ${id}`);
    return this.http.get<Product>(`${baseUrl}/${id}`)
      .pipe(
        tap(product => console.log('Retrieved product:', product)),
        catchError(this.handleError)
      );
  }

  create(data: any): Observable<any> {
    console.log('Creating product with data:', data);
    return this.http.post(baseUrl, data)
      .pipe(
        tap(response => console.log('Create product response:', response)),
        catchError(this.handleError)
      );
  }

  update(id: any, data: any): Observable<any> {
    console.log(`Updating product ${id} with data:`, data);
    return this.http.put(`${baseUrl}/${id}`, data)
      .pipe(
        tap(response => console.log('Update product response:', response)),
        catchError(this.handleError)
      );
  }

  delete(id: any): Observable<any> {
    console.log(`Deleting product with ID: ${id}`);
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(
        tap(response => console.log('Delete product response:', response)),
        catchError(this.handleError)
      );
  }

  findBySku(sku: string): Observable<Product[]> {
    console.log(`Searching products by SKU: ${sku}`);
    return this.http.get<Product[]>(`${baseUrl}?sku=${sku}`)
      .pipe(
        tap(products => console.log(`Found ${products.length} products with SKU: ${sku}`)),
        catchError(this.handleError)
      );
  }

  findByName(name: string): Observable<Product[]> {
    console.log(`Searching products by name: ${name}`);
    return this.http.get<Product[]>(`${baseUrl}?product_name=${name}`)
      .pipe(
        tap(products => console.log(`Found ${products.length} products with name containing: ${name}`)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Network error occurred. Please check your connection';
      } else if (error.status === 400) {
        // Try to extract the error message from the response
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
          
          // Check for common database errors
          if (error.error.message.includes('foreign key constraint')) {
            errorMessage = 'This operation cannot be completed because this product has related records';
          }
        } else {
          errorMessage = 'Bad request: Please check your input data';
        }
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 500) {
        // Try to extract more useful information from 500 errors
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
          
          // Special handling for database constraint errors that might bubble up
          if (error.error.message.includes('foreign key constraint') || 
              error.error.message.includes('constraint violation')) {
            errorMessage = 'Cannot delete this product because it has related records (e.g., catalogs or variants)';
          }
          
          // Check specifically for catalog_products constraint
          if (error.error.detail && error.error.detail.includes('catalog_products')) {
            errorMessage = 'Cannot delete this product because it is used in catalogs. Please remove it from all catalogs first.';
          }
        } else {
          errorMessage = 'Server error occurred. Please try again later';
        }
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 