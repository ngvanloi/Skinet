import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketTotals } from '../shared/models/basket';
import { BasketService } from './basket.service';
import { IBasketItem } from '../shared/models/basket-item';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket$?: Observable<IBasket>;
  basketTotal$?: Observable<IBasketTotals>;

  constructor(private readonly basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;    
    this.basketTotal$ = this.basketService.basketTotal$;    
  }

  removeItemFromBasket(item:IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  incrementItemQuantity(item:IBasketItem) {
    this.basketService.incrementItemQuatity(item);
  }

  decrementItemQuantity(item:IBasketItem) {
    this.basketService.decrementItemQuatity(item);
  }

}
