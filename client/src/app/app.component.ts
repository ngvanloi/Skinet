import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './shared/models/product-return-to.dto.model';
import { IPagination } from './shared/models/pagination';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Skinet';
  basketId: string | null | undefined;

  constructor(private readonly basketService: BasketService) { }

  ngOnInit(): void {
    this.basketId = localStorage.getItem('basket_id');
    if (this.basketId) {
      this.basketService.getBasket(this.basketId)
        .subscribe((res) => { }, error => {
          console.log(error);
        });
    }
  }

}
