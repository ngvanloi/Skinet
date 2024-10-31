import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { IDeliveryMethod } from 'src/app/shared/models/delivery-method';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit, OnDestroy {
  @Input() checkoutForm?: FormGroup;

  deliveryMethods: IDeliveryMethod[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods()
      .pipe(
        tap((dm: IDeliveryMethod[]) => {
          this.deliveryMethods = dm;
        }),
        takeUntil(this.unsubscribe$),
      ).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }

}
