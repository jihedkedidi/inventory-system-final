import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockTransferLine } from '../models/stock-transfer-line.model';

const baseUrl = 'http://localhost:3000/api/stock-transfer-lines';

@Injectable({
  providedIn: 'root'
})
export class StockTransferLineService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<StockTransferLine[]> {
    return this.http.get<StockTransferLine[]>(baseUrl);
  }

  get(id: any): Observable<StockTransferLine> {
    return this.http.get<StockTransferLine>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.patch(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
} 