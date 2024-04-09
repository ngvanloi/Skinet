import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { IOrder } from '../shared/models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(private readonly orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrdersForUser();
  }

  getOrdersForUser() {
    return this.orderService.getOrdersForUser()
      .subscribe((res: IOrder[]) => {
        if (res) {
          this.orders = res;
        }
      }, error => {
        console.log(error);
      })
  }

}
