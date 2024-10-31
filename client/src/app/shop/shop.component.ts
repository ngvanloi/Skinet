import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product-return-to.dto.model';
import { ShopService } from './shop.service';
import { IType } from '../shared/models/product-type';
import { IBrand } from '../shared/models/brand';
import { IPagination, Pagination } from '../shared/models/pagination';
import { ShopParams } from '../shared/models/shopParams';
import { catchError, debounceTime, forkJoin, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
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

  private unsubscribe$: Subject<void> = new Subject<void>();
  private searchDebounce$: Subject<string> = new Subject<string>();
  private filterChange$: Subject<void> = new Subject<void>();

  constructor(private readonly shopService: ShopService) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSearchDebounce();
    this.setupFilterChange();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadInitialData(): void {
    forkJoin({
      products: this.getProducts(true),
      brands: this.shopService.getBrands().pipe(
        catchError((error) => {
          console.error('Failed to retrieve brands:', error);
          return of([{ id: 0, name: 'All' }]);
        })
      ),
      types: this.shopService.getTypes().pipe(
        catchError((error) => {
          console.error('Failed to retrieve types:', error);
          return of([{ id: 0, name: 'All' }]);
        })
      )
    })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ products, brands, types }) => {
        if (products) {
          this.products = products.data;
          this.totalCount = products.count;
        }
        this.brands = [{ id: 0, name: 'All' }, ...brands];
        this.types = [{ id: 0, name: 'All' }, ...types];
      });
  }

  private setupFilterChange(): void {
    this.filterChange$
      .pipe(
        switchMap(() => this.getProducts()),
        catchError((error) => {
          console.error('Failed to retrieve products during filter change:', error);
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(res => {
        if (res) {
          this.products = res.data;
          this.totalCount = res.count;
        }
      });
  }

  private setupSearchDebounce(): void {
    this.searchDebounce$
      .pipe(
        debounceTime(300),
        switchMap(search => {
          this.onUpdateShopParams({ search });
          return this.getProducts();
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(res => {
        if (res) {
          this.products = res.data;
          this.totalCount = res.count;
        }
      });
  }

  private onUpdateShopParams(paramsUpdate: Partial<ShopParams>): void {
    this.shopParams = { ...this.shopParams, ...paramsUpdate, pageNumber: 1 };
    this.shopService.setShopParams(this.shopParams);
    this.filterChange$.next(); 
  }

  onBrandSelected(brandId: number): void {
    this.onUpdateShopParams({ brandId });
  }

  onTypeSelected(typeId: number): void {
    this.onUpdateShopParams({ typeId });
  }

  onSortSelected(evt: Event): void {
    const sort = (evt.target as HTMLInputElement).value;
    this.onUpdateShopParams({ sort });
  }

  onPageChange(page: any): void {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== page) {
      this.onUpdateShopParams({ pageNumber: page });
    }
  }

  onSearch(): void {
    const searchValue = this.searchInput?.nativeElement.value || '';
    this.searchDebounce$.next(searchValue);
  }

  onReset(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

  getProducts(useCache: boolean = false): Observable<Pagination | null> {
    return this.shopService.getProducts(useCache)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((res: IPagination | null) => {
          if (res) {
            this.products = res.data;
            this.totalCount = res.count;
          }
        }),
      )
  }
}
