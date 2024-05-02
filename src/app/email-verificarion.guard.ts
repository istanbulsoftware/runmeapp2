import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificarionGuard implements CanLoad {
  constructor(private authService: AuthenticationService, private router: Router) { }
 
  canLoad(): Observable<boolean> {    
    return this.authService.isVerified.pipe(
      filter(val => val !== null),
      take(1), 
      map(isVerified => {
        if (isVerified) {
          return true;
        } else {          
          this.router.navigateByUrl('/email-verification', { replaceUrl: true });
        }
      })
    );
  }
}
