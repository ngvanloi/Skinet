import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './shared/models/product-return-to.dto.model';
import { IPagination } from './shared/models/pagination';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Skinet';
  basketId: string | null | undefined;
  token: string | null | undefined;

  constructor(
    private readonly basketService: BasketService,
    private readonly accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadBasket() {
    this.basketId = localStorage.getItem('basket_id');
    if (this.basketId) {
      this.basketService.getBasket(this.basketId)
        .subscribe(() => { }, error => {
          console.log(error);
        });
    }
  }

  loadCurrentUser() {
    this.token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(this.token)
      .subscribe(() => { console.log('Loaded user') }, error => {
        console.log(error);
      });
  }

}
