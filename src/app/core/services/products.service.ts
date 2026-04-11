import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(subcategoryId?: string): Observable<any> {
    let params = new HttpParams();
    if (subcategoryId) {
      params = params.set('subcategory', subcategoryId);
    }
    return this.httpClient.get(environment.baseUrl + `/api/v1/products`, { params });
  }

  getSpecificProduct(productId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products/${productId}`);
  }


        // Sec / Detalis
  getProductsByCategory(categoryId: string): Observable<any> {
  let params = new HttpParams().set('category', categoryId).set('limit', '10');
  return this.httpClient.get(environment.baseUrl + `/api/v1/products`, { params });
}
}
