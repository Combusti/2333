import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Product } from 'src/app/core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // API routes
  private readonly ROUTE_PRODUCT_LIST = '/product/list';

  // Local data store
  private readonly _productList = new BehaviorSubject<Array<Product>>([]);
  readonly productList$ = this._productList.asObservable();

  constructor(private readonly _http: HttpClient) { }

  /**
   * Product List
   */
  // Load products list from the API
  getProductList(): Observable<Array<Product> | undefined> {
    return this._http.get<Array<Product>>(`${environment.apiUrl}/${this.ROUTE_PRODUCT_LIST}`).pipe(
      tap((productList) => {
        this._productList.next(productList);
      }),
      switchMap(() => this.productList$)
    );
  }

  // public getter to retrieve product list from local store
  get productList(): Array<Product> {
    return this._productList.getValue();
  }
}
