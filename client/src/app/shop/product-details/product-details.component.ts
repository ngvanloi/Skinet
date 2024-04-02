import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product-return-to.dto.model';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketItem } from 'src/app/shared/models/basket-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product?: IProduct;
  id?: number;
  quantity: number = 1;

  constructor(
    private readonly shopService: ShopService,
    private readonly route: ActivatedRoute,
    private readonly bcService: BreadcrumbService,
    private readonly basketService: BasketService,
  ) {
    this.id = parseInt(this.route.snapshot.params['id']);
    this.bcService.set('@productDetails', '')
  }

  ngOnInit(): void {
    if (this.id) {
      this.getProduct(this.id);
    }
  }

  getProduct(id: number): void {
    this.shopService.getProduct(id)
      .subscribe(res => {
        this.product = res;
        this.bcService.set('@productDetails', this.product.name)
      }, error => {
        console.log(error);
      })
  }

  incrementItemQuantity() {
    this.quantity++;
  }

  decrementItemQuantity() {
    if(this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(){
    if(!this.product) return;
    this.basketService.addItemToBasket(this.product, this.quantity);
  }
}
