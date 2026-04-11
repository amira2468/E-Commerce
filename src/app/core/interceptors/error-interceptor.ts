import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService)
// Req
  return next(req).pipe(
    catchError((err)=>{
    toastrService.error(err.error.message , 'FreshCart' , {progressBar:true , closeButton:true})
      return throwError(()=>err);
    })
  );
};
