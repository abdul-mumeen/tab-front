import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap , catchError } from "rxjs/operators";
import { HttpClient, HttpInterceptor, HttpResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';


@Injectable()
export class InterceptService implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private router:Router
  ){}

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(catchError((err: HttpResponse<any>) => {
        if (err.status == 401){ //UNAUTHORIZED
          this.router.navigate(['/login']);
        }else if(err.status == 403){
          this.snackBar.open(
            'You are not authorized to access this resource',
            'UNAUTHORIZED', { duration: 2000,}
          )
        }
        return throwError(err);
      }))
      .pipe(tap((res: HttpResponse<any>) => {
      }, (err: any) => {
        //anything other than a 200 or 401 which is caught above will show up here
        console.log("Caught error in HttpService: " + err);
      }));
  }
  
  

}
