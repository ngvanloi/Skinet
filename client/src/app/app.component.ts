import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from './shared/models/product-return-to.dto.model';
import { IPagination } from './shared/models/pagination';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';
import { catchError, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Skinet';
  basketId: string | null | undefined;
  token: string | null | undefined;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly basketService: BasketService,
    private readonly accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadBasket() {
    this.basketId = localStorage.getItem('basket_id');
    if (this.basketId) {
      this.basketService.getBasket(this.basketId)
        .pipe(
          takeUntil(this.unsubscribe$),
          catchError((error) => {
            console.error('Failed to retrieve basket:', error);
            return of(null);
          })
        )
        .subscribe();
    }
  }

  loadCurrentUser() {
    this.token = localStorage.getItem('token');
    this.accountService.getCurrentUser(this.token)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          console.error('Failed to retrieve basket:', error);
          return of(null);
        })
      )
      .subscribe();
  }

}
