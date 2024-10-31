import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrder } from '../shared/models/order';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  getOrdersForUser(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.baseUrl + 'orders')
      .pipe(
        catchError((error) => {
          console.error('Failed to retrieve Orders from server:', error);
          return of([]);
        })
      );
  }

  getOrderByIdForUser(id: number): Observable<IOrder> {
    return this.http.get<IOrder>(this.baseUrl + 'orders/' + id)
      .pipe(
        catchError((error) => {
          console.error('Failed to retrieve Orders from server:', error);
          return of();
        })
      );
  }
}
