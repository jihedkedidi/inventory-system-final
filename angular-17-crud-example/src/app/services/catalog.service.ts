import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Catalog } from '../models/catalog.model';

const baseUrl = 'http://localhost:3000/api/catalogs';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Catalog[]> {
    return this.http.get<Catalog[]>(baseUrl);
  }

  get(id: any): Observable<Catalog> {
    return this.http.get<Catalog>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  addProducts(catalogId: any, productIds: number[]): Observable<any> {
    return this.http.post(`${baseUrl}/${catalogId}/products`, productIds);
  }

  removeProducts(catalogId: any, productIds: number[]): Observable<any> {
    return this.http.delete(`${baseUrl}/${catalogId}/products`, {
      body: productIds
    });
  }
} 