import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { debug, error } from 'console';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm?: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly basketService: BasketService,
    private readonly cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
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
      .subscribe((address) => {
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
        this.cdRef.detectChanges();
      }, error => { console.log(error) })
  }

  getDeliveryMethodValue() {
    // const basket = this.basketService.getCurrentBasketValue();
    // if (basket && basket.deliveryMethodId) {
    //   this.checkoutForm.get('deliveryForm')?.get('deliveryMethod')
    //     ?.patchValue(basket.deliveryMethodId.toString());
    // }
  }

}
