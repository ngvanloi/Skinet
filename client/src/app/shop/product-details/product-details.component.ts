import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product-return-to.dto.model';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';

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
    private readonly route: ActivatedRoute
  ) {
    this.id = parseInt(this.route.snapshot.params['id']);
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
      }, error => {
        console.log(error);
      })
  }

}
