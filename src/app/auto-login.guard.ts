import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { filter, map, take } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authService: AuthenticationService, private alertController : AlertController, private router: Router, ) { }
 
  canLoad(): Observable<boolean> {    
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {

        console.log('Found previous token, automatic login');
        if (isAuthenticated) {

          // Directly open inside area       
          this.router.navigateByUrl('/tabs/advert-real', { replaceUrl: true });

        } else {          

          // Simply allow access to the login
          this.router.navigateByUrl('/login')    
          return true;
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
