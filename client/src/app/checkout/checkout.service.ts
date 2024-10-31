import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/delivery-method';
import { IOrder, IOrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) { }

  createOrder(order: IOrderToCreate) {
    return this.http.post<IOrder>(this.baseUrl + 'orders', order);
  }

  getDeliveryMethods():Observable<IDeliveryMethod[]> {
    return this.http.get<IDeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods')
      .pipe(
        map((dm: IDeliveryMethod[]) => {
          return dm.sort((a, b) => b.price - a.price)
        }),
        catchError((error) => {
          console.error('Failed to retrieve delivery methods from server:', error);
          return of([]);
        })
      )
  }
}
