import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl: string = environment.apiUrl;
  constructor(private readonly http: HttpClient) { }

  getOrdersForUser() {
    return this.http.get<IOrder[]>(this.baseUrl + 'orders');
  }

  getOrderByIdForUser(id: number) {
    return this.http.get<IOrder>(this.baseUrl + 'orders/' + id);
  }

}
