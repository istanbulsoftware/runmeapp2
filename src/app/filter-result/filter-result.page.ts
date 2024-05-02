import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController, ToastController, IonSlides } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { InternetService } from '../internet.service';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { IconsService } from '../icons.service';
import { take } from "rxjs/operators";


import { NotificationService } from '../notification.service';
import { Preferences } from '@capacitor/preferences';
import { FilterPage } from '../filter/filter.page';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-filter-result',
  templateUrl: './filter-result.page.html',
  styleUrls: ['./filter-result.page.scss'],
})
export class FilterResultPage  {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('mySlider', {static: true}) Slides: IonSlides;

  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 5,
    loop: false,
    centeredSlides: false
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 7,
    loop: false,
    centeredSlides: false
  };
  myId
  conversations: any = []
  internetAccess: boolean;
  chats = {}
  vipusers : any
  newusers : any


  city : string
  minAge : number
  maxAge : number
  gender : string
  filteredUsers : any
  constructor(
    private internet: InternetService,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private socket: Socket,
    private notifi: NotificationService,
    private modalController: ModalController,
    private userSer: IconsService,
    private activeRoute : ActivatedRoute

  ) {




    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const de = helper.decodeToken(token.value);
        this.myId = de.id;

      }
    })





  }



  ionViewWillEnter() {
    this.activeRoute.queryParams.pipe(take(1)).subscribe(query => {
      console.log(query);
      
      this.city = query.city;
      this.minAge = query.minAge;
      this.maxAge = query.maxAge;
      this.gender = query.gender;
    });
    this.http.post(`${environment.url}/filter`, { gender: this.gender, city : this.city  }).subscribe(
      (res: any) => {
        console.log(res.foundedUsers);
        this.filteredUsers = res.foundedUsers
      }
    )
  }
  ionViewDidEnter() {

  }








  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }


  async goFilter() {
    const modal = await this.modalController.create({
      component: FilterPage,
      cssClass: 'filter-page-css',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    modal.onDidDismiss().then((modelData) => {
      this.activeRoute.queryParams.pipe(take(1)).subscribe(query => {
        console.log(query);
        
        this.city = query.city;
        this.minAge = query.minAge;
        this.maxAge = query.maxAge;
        this.gender = query.gender;
      });    
      this.http.post(`${environment.url}/filter`, { gender: this.gender, city : this.city  }).subscribe(
        (res: any) => {
          console.log(res.foundedUsers);
          this.filteredUsers = res.foundedUsers
        }
      )
    });
    return await modal.present();
  }

  dateToSgin(a){

    let c = new Date(a); // yyyy-mm-dd
    let m  =   Number(c.toLocaleString('default', { month: 'numeric' }));
    let d =   Number(c.toLocaleString('default', { day: 'numeric' }));

    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
    const signs = ["Kova", "Balık", "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay", "Oğlak"];
    

    if(m == 0 && d <= 20){
        
        m = 11;         
    }else if(d < days[m]){
        
        m--;
    };

    return signs[m];
  }

  getAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
}
}
