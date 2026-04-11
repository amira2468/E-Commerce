import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

    const pLATFORM_ID = inject(PLATFORM_ID)

    if(isPlatformBrowser(pLATFORM_ID)){
        if(localStorage.getItem('freshToken')){
      req = req.clone({
      setHeaders:{
        Token:localStorage.getItem('freshToken') !
      }
    })
  }  if(localStorage.getItem('freshToken')){
    req = req.clone({
      setHeaders:{
        Token:localStorage.getItem('freshToken') !
      }
    })
  }
    }
  return next(req);
};
