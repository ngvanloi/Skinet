import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit, OnDestroy{
  @Input() appStepper?: CdkStepper;

  basket$?: Observable<IBasket>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private basketService: BasketService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createPaymentIntent() {
    this.basketService.createPaymentIntent()
    .pipe(
      tap(_ => this.appStepper?.next()),
      takeUntil(this.unsubscribe$)
    )
    .subscribe();
  }
}
