import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent implements OnInit, OnDestroy {
  id?: number;
  order?: IOrder;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly orderService: OrderService,
    private readonly bcService: BreadcrumbService,
    private readonly route: ActivatedRoute
  ) {
    this.id = parseInt(this.route.snapshot.params['id']);
    this.bcService.set('@orderDetails', '');
  }

  ngOnInit(): void {
    this.getOrderByIdForUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getOrderByIdForUser() {
    if (!this.id) return;
    return this.orderService.getOrderByIdForUser(this.id)
      .pipe(
        tap((res: IOrder) => {
          if (res) {
            this.order = res;
            this.bcService.set('@orderDetails', `Order # ${this.order.id} - ${this.order.status}`)
          }
        }),
        takeUntil(this.unsubscribe$),
      ).subscribe();
  }

}
