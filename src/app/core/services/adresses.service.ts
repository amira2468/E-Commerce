import { environment } from './../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly httpClient = inject(HttpClient);

  getAddresses(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/addresses`);
  }

  addAddress(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/addresses`, data);
  }

  removeAddress(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/addresses/${id}`);
  }

  updateAddress(id: string, data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/addresses/${id}`, data);
  }


  // Update User Data
    saveChanges( data:object):Observable<any>{
      return this.httpClient.put(`${environment.baseUrl}/api/v1/users/updateMe` , data)
    }

    // UpdateUserPassword
    UpdateUserPassword(data:object):Observable<any>{
      return this.httpClient.put(`${environment.baseUrl}/api/v1/users/changeMyPassword` , data)
    }
    // Change Password
      changePassword(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/users/changeMyPassword`, data);
  }
}
