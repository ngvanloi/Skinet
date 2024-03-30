import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product-return-to.dto.model';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product?: IProduct;
  id?: number;

  constructor(
    private readonly shopService: ShopService,
    private readonly route: ActivatedRoute,
    private readonly bcService: BreadcrumbService
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

}
