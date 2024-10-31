import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { IPagination, Pagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/product-type';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product-return-to.dto.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl: string = environment.apiUrl;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination: Pagination = new Pagination();
  shopParams: ShopParams = new ShopParams();

  constructor(private http: HttpClient) { }

  getProducts(useCache: boolean): Observable<IPagination | null> {
    if (useCache === false) {
      this.products = [];
    }

    if (this.products.length > 0 && useCache === true) {
      const pagesReceived = Math.ceil(this.products.length / this.shopParams.pageSize);
      if (this.shopParams.pageNumber <= pagesReceived) {
        this.pagination.data = this.products.slice(
          (this.shopParams.pageNumber - 1) * this.shopParams.pageSize,
          this.shopParams.pageNumber * this.shopParams.pageSize);
        return of(this.pagination);
      }
    }
    let params = new HttpParams();
    if (this.shopParams.brandId !== 0) {
      params = params.append('brandId', this.shopParams.brandId.toString());
    }

    if (this.shopParams.typeId !== 0) {
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    if (this.shopParams.search !== undefined) {
      params = params.append('search', this.shopParams.search.toString());
    }

    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + "products", { observe: 'response', params })
      .pipe(
        map((res) => {
          if (res.body) {
            this.products = [...this.products, ...res.body.data]
            this.pagination = res.body;
          }
          return res.body;
        }),
        catchError((error) => {
          console.error('Failed to retrieve products from server:', error);
          return of(null);
        })
      )
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number): Observable<IProduct> {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return of(product);
    }
    return this.http.get<IProduct>(this.baseUrl + "products/" + id)
      .pipe(
        catchError((error) => {
          console.error('Failed to retrieve product from server:', error);
          return of();
        })
      );
  }

  getBrands(): Observable<IBrand[]> {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IBrand[]>(this.baseUrl + "products/brands")
      .pipe(
        map(res => {
          this.brands = res;
          return res;
        }),
        catchError((error) => {
          console.error('Failed to retrieve brands from server:', error);
          return of([]);
        })
      );
  }

  getTypes(): Observable<IType[]> {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IType[]>(this.baseUrl + "products/types")
      .pipe(
        map(res => {
          this.types = res;
          return res;
        }),
        catchError((error) => {
          console.error('Failed to retrieve types from server:', error);
          return of([]);
        })
      );
  }
}
