import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product-return-to.dto.model';
import { ShopService } from './shop.service';
import { error } from 'console';
import { IType } from '../shared/models/product-type';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true }) searchInput?: ElementRef;

  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  sortOptions = [
    { name: "Alphabetical", value: "name" },
    { name: "Price: Low to High", value: "priceAsc" },
    { name: "Price: High to Low", value: "pricedesc" },
  ];

  shopParams = new ShopParams();
  totalCount: number = 0;

  constructor(private readonly shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  onBrandSelected(brandId: number): void {
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number): void {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(evt: Event): void {
    this.shopParams.sort = (evt.target as HTMLInputElement).value;
    this.getProducts();
  }

  onPageChange(page: any): void {
    if (this.shopParams.pageNumber !== page) {
      this.shopParams.pageNumber = page;
      this.getProducts();
    }
  }

  onSearch(): void {
    this.shopParams.search = this.searchInput?.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.shopParams = new ShopParams();
    this.getProducts();
  }

  getProducts(): void {
    this.shopService.getProducts(this.shopParams)
      .subscribe((res: IPagination | null) => {
        if (res) {
          this.products = res.data;
          this.shopParams.pageNumber = res.pageIndex;
          this.shopParams.pageSize = res.pageSize;
          this.totalCount = res.count;
        }
      }, error => {
        console.log(error);
      })
  }


  getBrands(): void {
    this.shopService.getBrands()
      .subscribe((res: IBrand[]) => {
        this.brands = [{ id: 0, name: "All" }, ...res];
      }, error => {
        console.log(error);
      })
  }

  getTypes(): void {
    this.shopService.getTypes()
      .subscribe((res: IType[]) => {
        this.types = [{ id: 0, name: "All" }, ...res];
      }, error => {
        console.log(error);
      })
  }
}
