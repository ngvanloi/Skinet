import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { IOrder } from '../shared/models/order';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrdersForUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getOrdersForUser() {
    return this.orderService.getOrdersForUser()
      .pipe(
        tap((res: IOrder[]) => {
          this.orders = res;
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }

}
