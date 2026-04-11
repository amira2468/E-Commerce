import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private readonly httpClient = inject(HttpClient);

    wishListCount = signal<number>(0);

    // ADD
  AddProduct(prodId:string):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/wishlist` , {productId:prodId})
  };
    // REMOVE
  removeProduct(Id:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `/api/v1/wishlist/${Id}`)
  };
    // LOGIN
  getLoggedUser():Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/api/v1/wishlist`)
  }
}
