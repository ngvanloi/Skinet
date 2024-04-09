import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasket } from '../../models/basket';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketItem } from '../../models/basket-item';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  @Input() isBasket: boolean = true;
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();

  basket$?: Observable<IBasket>;

  constructor(private readonly basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

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
