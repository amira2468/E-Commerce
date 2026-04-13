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


      // SearchBar

  searchProducts(filters: {
    title?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Observable<any> {
    let params = new HttpParams();
    if (filters.title) params = params.set('title', filters.title);
    if (filters.categories?.length) {
      filters.categories.forEach(cat => {
        params = params.append('category', cat);
      });
    }
    if (filters.minPrice !== undefined) params = params.set('price[gte]', filters.minPrice);
    if (filters.maxPrice !== undefined) params = params.set('price[lte]', filters.maxPrice);
    if (filters.sort) params = params.set('sort', filters.sort);
    return this.httpClient.get(environment.baseUrl + `/api/v1/products`, { params });
  }

}
