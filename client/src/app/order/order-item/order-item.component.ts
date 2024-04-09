import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Breadcrumb } from 'xng-breadcrumb/lib/breadcrumb';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent implements OnInit {
  id?: number;
  order?: IOrder;

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

  getOrderByIdForUser() {
    if (!this.id) return;
    return this.orderService.getOrderByIdForUser(this.id)
      .subscribe((res: IOrder) => {
        if (res) {
          this.order = res;
          this.bcService.set('@orderDetails', `Order # ${this.order.id} - ${this.order.status}`)
        }
      }, error => {
        console.log(error);
      });
  }

}
