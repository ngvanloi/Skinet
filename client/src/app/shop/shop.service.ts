import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map } from 'rxjs';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/product-type';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product-return-to.dto.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl: string = "https://localhost:7191/api/";

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams): Observable<IPagination | null> {
    let params = new HttpParams();
    if (shopParams.brandId !== 0) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId !== 0) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search !== undefined) {
      params = params.append('search', shopParams.search.toString());
    }

    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + "products", { observe: 'response', params })
      .pipe(
        map((res) => {
          return res.body;
        })
      )
  }

  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(this.baseUrl + "products/" + id);
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(this.baseUrl + "products/brands");
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(this.baseUrl + "products/types");
  }
}
