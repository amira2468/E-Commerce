import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
private readonly httpClient = inject(HttpClient)
  // brands.service.ts

getAllBrands(): Observable<any> {
  return this.httpClient.get(`${environment.baseUrl}/api/v1/brands`);
}

getBrandById(id: string): Observable<any> {
  return this.httpClient.get(environment.baseUrl + `/api/v1/brands/${id}`);
}
}
