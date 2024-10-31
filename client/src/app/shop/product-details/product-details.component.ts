import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product-return-to.dto.model';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product?: IProduct;
  id?: number;
  quantity: number = 1;

  private unsubscribe$: Subject<void> = new Subject<void>();

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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getProduct(id: number): void {
    this.shopService.getProduct(id)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(res => {
          this.product = res;
          this.bcService.set('@productDetails', this.product.name)
        })
      )
      .subscribe()
  }

  incrementItemQuantity() {
    this.quantity++;
  }

  decrementItemQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;
    this.basketService.addItemToBasket(this.product, this.quantity);
  }
}
