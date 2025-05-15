import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StockTransfer } from '../models/stock-transfer.model';

const baseUrl = 'http://localhost:3000/api/stock-transfers';

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {

  constructor(private http: HttpClient) { }

  getAll(status?: string): Observable<StockTransfer[]> {
    const url = status ? `${baseUrl}?status=${status}` : baseUrl;
    console.log(`Fetching stock transfers from: ${url}`);
    return this.http.get<StockTransfer[]>(url)
      .pipe(
        tap(transfers => console.log(`Retrieved ${transfers.length} transfers`)),
        catchError(this.handleError)
      );
  }

  get(id: any): Observable<StockTransfer> {
    console.log(`Fetching stock transfer with ID: ${id}`);
    return this.http.get<StockTransfer>(`${baseUrl}/${id}`)
      .pipe(
        tap(transfer => console.log('Retrieved transfer:', transfer)),
        catchError(this.handleError)
      );
  }

  create(data: any): Observable<any> {
    console.log('Creating stock transfer with data:', data);
    return this.http.post(baseUrl, data)
      .pipe(
        tap(response => console.log('Create stock transfer response:', response)),
        catchError(this.handleError)
      );
  }

  update(id: any, data: any): Observable<any> {
    console.log(`Updating stock transfer ${id} with data:`, data);
    return this.http.patch(`${baseUrl}/${id}`, data)
      .pipe(
        tap(response => console.log('Update stock transfer response:', response)),
        catchError(this.handleError)
      );
  }

  delete(id: any): Observable<any> {
    console.log(`Deleting stock transfer with ID: ${id}`);
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  ship(id: any): Observable<any> {
    console.log(`Shipping stock transfer with ID: ${id}`);
    return this.http.post(`${baseUrl}/${id}/ship`, {})
      .pipe(
        tap(response => console.log('Ship response:', response)),
        catchError(this.handleError)
      );
  }

  receive(id: any, data: any): Observable<any> {
    console.log(`Receiving stock transfer ${id} with data:`, data);
    return this.http.post(`${baseUrl}/${id}/receive`, data)
      .pipe(
        tap(response => console.log('Receive response:', response)),
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
        } else {
          errorMessage = 'Bad request: Please check your input data';
        }
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
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