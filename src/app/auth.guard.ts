import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  
  loading
  constructor(
    private alertController : AlertController,
    private authService: AuthenticationService, private router: Router) {}
 
  canLoad(): Observable<boolean> {    
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        if (isAuthenticated) {    
      
          return true;
        } else {     

          this.router.navigateByUrl('/login')    
          return false;
        }
      })
    );
  }
  async presentAlert(m) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: m,
      buttons: ['OK'],
    });

    await alert.present();
  }

  
}
