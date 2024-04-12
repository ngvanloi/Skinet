import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product-return-to.dto.model';
import { IBasketItem } from '../shared/models/basket-item';
import { IDeliveryMethod } from '../shared/models/delivery-method';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<IBasket>({ id: '', items: [] });
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>({ shipping: 0, subtotal: 0, total: 0 });
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping: number = 0;

  constructor(private readonly http: HttpClient) { }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    this.calculateTotals();
    this.setBasket(basket)
  }

  createPaymentIntent() {
    return this.http.post<IBasket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id, {})
      .pipe(
        map(basket => {
          this.basketSource.next(basket);
        })
      )
  }

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          this.calculateTotals();
        })
      );
  }

  setBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket)
      .subscribe((basket: IBasket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }, error => {
        console.log(error);
      })
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(x => x.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete<IBasket>(this.baseUrl + 'basket?id=' + basket.id)
      .subscribe(() => {
        this.basketSource.next({ id: '', items: [] });
        this.basketTotalSource.next({ shipping: 0, subtotal: 0, total: 0 });
        localStorage.removeItem('basket_id');
      }, error => {
        console.log(error);
      })
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue().id !== '' ? this.getCurrentBasketValue() : this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity)
    this.setBasket(basket);
  }

  createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    }
  }

  incrementItemQuatity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuatity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
    } else {
      this.removeItemFromBasket(item);
    }
    this.setBasket(basket);
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = shipping + subtotal;
    this.basketTotalSource.next({ shipping, subtotal, total });
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(x => x.id === itemToAdd.id);
    if (index === -1) {
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }
}
