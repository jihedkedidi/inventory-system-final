import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Location } from '../models/location.model';

const baseUrl = 'http://localhost:3000/api/locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Location[]> {
    console.log('Fetching all locations');
    return this.http.get<Location[]>(baseUrl)
      .pipe(
        tap(locations => console.log(`Retrieved ${locations.length} locations`)),
        catchError(this.handleError)
      );
  }

  get(id: any): Observable<Location> {
    console.log(`Fetching location with ID: ${id}`);
    return this.http.get<Location>(`${baseUrl}/${id}`)
      .pipe(
        tap(location => console.log('Retrieved location:', location)),
        catchError(this.handleError)
      );
  }

  create(data: any): Observable<any> {
    console.log('Creating location with data:', data);
    return this.http.post(baseUrl, data)
      .pipe(
        tap(response => console.log('Create location response:', response)),
        catchError(this.handleError)
      );
  }

  update(id: any, data: any): Observable<any> {
    console.log(`Updating location ${id} with data:`, data);
    return this.http.patch(`${baseUrl}/${id}`, data)
      .pipe(
        tap(response => console.log('Update location response:', response)),
        catchError(this.handleError)
      );
  }

  delete(id: any): Observable<any> {
    console.log(`Deleting location with ID: ${id}`);
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(
        tap(response => console.log('Delete location response:', response)),
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