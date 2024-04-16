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
  @ViewChild('search', { static: false }) searchInput?: ElementRef;

  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  sortOptions = [
    { name: "Alphabetical", value: "name" },
    { name: "Price: Low to High", value: "priceAsc" },
    { name: "Price: High to Low", value: "pricedesc" },
  ];

  shopParams: ShopParams;
  totalCount: number = 0;

  constructor(private readonly shopService: ShopService) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getBrands();
    this.getTypes();
  }

  onBrandSelected(brandId: number): void {
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onTypeSelected(typeId: number): void {
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected(evt: Event): void {
    const params = this.shopService.getShopParams();
    params.sort = (evt.target as HTMLInputElement).value;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onPageChange(page: any): void {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== page) {
      params.pageNumber = page;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }
  }

  onSearch(): void {
    const params = this.shopService.getShopParams();
    params.search = this.searchInput?.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onReset(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

  getProducts(useCache: boolean = false): void {
    this.shopService.getProducts(useCache)
      .subscribe((res: IPagination | null) => {
        if (res) {
          this.products = res.data;
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
