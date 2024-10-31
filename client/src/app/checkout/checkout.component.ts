import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { Observable, tap } from 'rxjs';
import { IBasketTotals } from '../shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm?: FormGroup;
  basketTotal$?: Observable<IBasketTotals>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly basketService: BasketService,
  ) { }

  ngOnInit(): void {
    this.basketTotal$ = this.basketService.basketTotal$;
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.loadDeliveryMethodValue();
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    })

  }

  getAddressFormValues() {
    this.accountService.getUserAddress()
      .pipe(
        tap((address) => {
          if (address && this.checkoutForm) {
            this.checkoutForm.get('addressForm')?.patchValue({
              firstName: address.firstName,
              lastName: address.lastName,
              street: address.street,
              city: address.city,
              state: address.state,
              zipcode: address.zipcode,
            });
          }
        })
      )
      .subscribe();
  }

  loadDeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket && basket.deliveryMethodId && this.checkoutForm) {
      this.checkoutForm.get('deliveryForm')?.get('deliveryMethod')
        ?.patchValue(basket.deliveryMethodId.toString());
    }
  }

}
