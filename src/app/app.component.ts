import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LanguageService } from './language.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { register } from 'swiper/element/bundle';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private langService : LanguageService,
    private platform: Platform,
    private http : HttpClient,
    private zone: NgZone,
    private router : Router
  ) {
    this.initializeApp();
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
          // Example url: https://beerswift.app/tabs/tab2
          // slug = /tabs/tab2
          const slug = event.url.split(".app").pop();
          if (slug) {
              this.router.navigateByUrl(slug);
          }
          // If no match, do nothing - let regular routing
          // logic take over
      });
  });
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.langService.setInitialAppLanguage();
      this.platform.ready().then(() => {
  

  
        this.platform.pause.subscribe(async () => {
          this.http.post(`${environment.url}/edit-online`, {isOnline : "offline", onlineTime : new Date()}).subscribe(
            (data: any) => {
              console.log(data); 
            })
        });
  
        this.platform.resume.subscribe(async () => {
          this.http.post(`${environment.url}/edit-online`, {isOnline : "online"}).subscribe(
            (data: any) => {
              console.log(data); 
            })
        });
        this.http.post(`${environment.url}/edit-online`, {isOnline : "online"}).subscribe(
          (data: any) => {
            console.log(data); 
          })
  
      });
    });
  }
}
