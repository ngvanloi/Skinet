import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, tap } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent {
  @Input() checkoutForm?: FormGroup;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  saveUserAddress() {
    this.accountService.updateUserAddress(this.checkoutForm?.get('addressForm')?.value)
      .pipe(
        tap(_ => {
          this.toastr.success('Address saved');
          this.checkoutForm?.get('addressForm')?.reset(this.checkoutForm?.get('addressForm')?.value);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe()
  }
}
