import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product-return-to.dto.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() product?: IProduct;

  constructor(private readonly basketService: BasketService) { }

  ngOnInit(): void {
  }

  addItemToBasket() {
    if (this.product) {
      this.basketService.addItemToBasket(this.product);
    }
  }

}
