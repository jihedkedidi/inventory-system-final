import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Variant } from '../models/variant.model';

const baseUrl = 'http://localhost:3000/api/variants'; // API URL with prefix

@Injectable({
  providedIn: 'root',
})
export class VariantService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Variant[]> {
    console.log('Fetching all variants');
    return this.http.get<Variant[]>(baseUrl)
      .pipe(
        tap(variants => console.log(`Retrieved ${variants.length} variants`)),
        catchError(this.handleError)
      );
  }

  getByProduct(productId: number): Observable<Variant[]> {
    console.log(`Fetching variants for product ID: ${productId}`);
    return this.http.get<Variant[]>(`${baseUrl}?product_id=${productId}`)
      .pipe(
        tap(variants => console.log(`Retrieved ${variants.length} variants for product ID ${productId}`)),
        catchError(this.handleError)
      );
  }

  get(id: any): Observable<Variant> {
    console.log(`Fetching variant with ID: ${id}`);
    return this.http.get<Variant>(`${baseUrl}/${id}`)
      .pipe(
        tap(variant => console.log('Retrieved variant:', variant)),
        catchError(this.handleError)
      );
  }

  create(data: any): Observable<any> {
    console.log('Creating variant with data:', data);
    return this.http.post(baseUrl, data)
      .pipe(
        tap(response => console.log('Create variant response:', response)),
        catchError(this.handleError)
      );
  }

  update(id: any, data: any): Observable<any> {
    console.log(`Updating variant ${id} with data:`, data);
    return this.http.patch(`${baseUrl}/${id}`, data)
      .pipe(
        tap(response => console.log('Update variant response:', response)),
        catchError(this.handleError)
      );
  }

  delete(id: any): Observable<any> {
    console.log(`Deleting variant with ID: ${id}`);
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(
        tap(response => console.log('Delete variant response:', response)),
        catchError(this.handleError)
      );
  }

  findBySku(sku: string): Observable<Variant[]> {
    return this.http.get<Variant[]>(`${baseUrl}?sku=${sku}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private validateVariantData(data: any): void {
    // Check required fields
    if (!data.variant_name) {
      throw new Error('Variant name is required');
    }
    if (!data.variant_value) {
      throw new Error('Variant value is required');
    }
    if (!data.sku) {
      throw new Error('SKU is required');
    }
    if (data.price === undefined || data.price === null) {
      throw new Error('Price is required');
    }
    
    // Check data types
    if (typeof data.price !== 'number') {
      throw new Error('Price must be a number');
    }
    if (data.cost_price !== undefined && data.cost_price !== null && typeof data.cost_price !== 'number') {
      throw new Error('Cost price must be a number');
    }
    
    // Check value constraints
    if (data.price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (data.cost_price !== undefined && data.cost_price !== null && data.cost_price < 0) {
      throw new Error('Cost price cannot be negative');
    }
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
        } else {
          errorMessage = 'Bad request: Please check your input data';
        }
      } else if (error.status === 404) {
        errorMessage = 'Variant not found';
      } else if (error.status === 409) {
        errorMessage = 'A variant with this SKU already exists';
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred. Please try again later';
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 