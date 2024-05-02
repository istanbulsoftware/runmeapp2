import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
//import { environment } from './../environments/environment'
import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';

@Injectable({
    providedIn: 'root'
  })
  export class AuthenticationInterceptor implements HttpInterceptor {
  
    constructor( ) { 
    }
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return from( Preferences.get({ key: TOKEN_KEY }) )
      .pipe(
        switchMap(token =>{
          const authReq = req.clone({ 
            headers: req.headers.set("Authorization" , "Bearer " + token.value)
          });
          return next.handle(authReq);
      })
      );   
    }
    
  }
  