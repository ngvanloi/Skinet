import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasket } from '../../models/basket';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketItem } from '../../models/basket-item';
import { Observable } from 'rxjs';
import { IOrderItem } from '../../models/order';
import { IsBasketSummaryTypeInterfacePipe } from '../../pipes/is-basket-summary-type.pipe';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss'],
})
export class BasketSummaryComponent implements OnInit {
  @Input() isBasket: boolean = true;
  @Input() isOrder: boolean = false;
  @Input() items: (IBasketItem | IOrderItem)[] = [];

  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();

  constructor() { }

  ngOnInit(): void { }

  removeItemFromBasket(item: IBasketItem) {
    this.remove.emit(item);
  }

  incrementItemQuantity(item: IBasketItem) {
    this.increment.emit(item);
  }

  decrementItemQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }

}
