import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router)

  isLogged = signal<boolean>(false);

  singOut():void{
      // Remove Token
  localStorage.removeItem('freshToken');
      // Remove Fresh User
  localStorage.removeItem('freshUser')
      // Remove User Data
  localStorage.removeItem('UserData')

  this.isLogged.set(false);
  this.router.navigate(['/login']);
  }

  signUp(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/auth/signup` ,data )
  };

  singIn(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/auth/signin` ,data )
  };

  forgotPassword(data : object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/auth/forgotPasswords` , data)
  };

  verifyCode(data : object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/auth/verifyResetCode` , data)
  };

  resetPassword(data : object):Observable<any>{
    return this.httpClient.put(environment.baseUrl + `/api/v1/auth/resetPassword` , data)
  };


  // لفك الTOKEN
decodeUserToken():void{
  const token = localStorage.getItem('freshToken');
if(token){
    const userData = jwtDecode(token);
    console.log(userData , 'UserData');
    localStorage.setItem('UserData' , JSON.stringify(userData));
}
}
}
