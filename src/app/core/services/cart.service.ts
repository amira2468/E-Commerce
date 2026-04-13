import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly httpClient = inject(HttpClient);

      // cartID = signal<string>('');
  cartCount = signal<number>(0);

  addProductToCart(prodId:string):Observable<any>{
return this.httpClient.post(environment.baseUrl + `/api/v2/cart` , {
  productId: prodId
})
  }

  getLoggedUserCart():Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/api/v2/cart`)
  }

  removeProductItem(id:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart/${id}` )
  }

  updateCartCount(id : string , count:number):Observable<any>{
    return this.httpClient.put(environment.baseUrl + `/api/v2/cart/${id}` , {"count": count})
  }

  clearAllData():Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart`)
  }

  // PayMent

  CreateCashOrder(cartId:string , data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/${cartId}` , data)
  }

  CreateVisaOrder(cartId: string, data: object): Observable<any> {
  return this.httpClient.post(environment.baseUrl + `/api/v1/orders/checkout-session/${cartId}?url=${environment.url}`,data);
}


          // Orders
getUserOrders(userId: string | null): Observable<any> {
  return this.httpClient.get<any>(environment.baseUrl + `/api/v1/orders/user/${userId}`);
}

  getAllOrders():Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/api/v1/orders/`)
  }
}
