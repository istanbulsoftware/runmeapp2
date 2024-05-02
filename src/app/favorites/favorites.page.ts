import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController, ToastController, IonSlides, IonContent } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { InternetService } from '../internet.service';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { IconsService } from '../icons.service';

import { NotificationService } from '../notification.service';
//import { FilterPage } from '../filter/filter.page';
//import { IntroPage } from '../intro/intro.page';
import { Preferences } from '@capacitor/preferences';
import { async } from '@angular/core/testing';
import { LanguageService } from '../language.service';
const TOKEN_KEY = 'my-token';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  cats
  segment: string = "standard";
  slideOpts = {
    slidesPerView: 6,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  }

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('mySlider', { static: true }) Slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;
  public pagingEnabled: boolean = true;
  limit: number
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 4,
    loop: false,
    centeredSlides: false
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 1,
    loop: false,
    centeredSlides: false
  };
  slideOptsFour = {
    initialSlide: 0,
    slidesPerView: 7,
    loop: false,
    centeredSlides: false
  };
  myId
  conversations: any = []
  internetAccess: boolean;
  chats = {}
  vipusers: any
  newusers: any
  randomusers: any
  user: any = { name: '', profilePicture: { publicPath: null } }
  questions
  convId
  tiems
  dataList: any
  favs: any
  getLang
  constructor(
    private internet: InternetService,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private socket: Socket,
    private lang : LanguageService,

    private userSer: IconsService,

  ) {
    this.limit = 0;

    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        console.log(token.value);

        const de = helper.decodeToken(token.value);
        this.myId = de.id;
        if (this.checkDateWithin() === true) {
          console.log("tr");

        } else if (this.checkDateWithin() === false) {
          console.log("fl");

        }

        this.socket.emit('joinChat', { roomId: de.id });


      }
    })

    this.internet.getNetworkState().subscribe(s => {
      this.internetAccess = s;
    });



  }

  token
  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) { 
      this.token = token.value;
     }else {
      this.router.navigate(['/signin'])
     }
  }


  searchText: string = ''
  search(value: string) {
    this.searchText = value
  }

  newConversation() {
    this.router.navigateByUrl('/search');
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  checkDateWithin() {
    const then = new Date('2022-08-29T09:30:20');
    const now = new Date();

    const msBetweenDates = Math.abs(then.getTime() - now.getTime());

    // 👇️ convert ms to hours                  min  sec   ms
    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

    console.log(hoursBetweenDates);

    if (hoursBetweenDates < 24) {
      return true
    } else {
      return false
    }
  }

  ngOnInit() {

    this.userSer.getUser().subscribe((user: any) => {
      if (user && user.email) {

        this.user = user
        console.log(this.user.subscribeStatus);

        this.isLoading = false
      }

    })

  }
  ionViewWillEnter() {
    this.getLang = this.lang.getLanguage()
    this.loadToken()
    this.listCategories()
    //this.createcategory()

  }
  tabHeight = '75px'


  error = false
  isLoading = false









  async presentToast(m, c) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000,
      color : c
    });
    toast.present();
  }

  onSendMessage(id, uName) {
    console.log(id);

    if (this.myId == id) {
      return this.presentToast("Kendinize mesaj atamazsınız", 'danger')
    }
    this.http.post(`${environment.url}/get-conv-id`, { otherId: id }).subscribe(
      (res: any) => {
        console.log(res);

        if (res && res.convId) {
          this.convId = res.convId;
          this.router.navigate([`/chat/${id}`], { queryParams: { convId: this.convId, name: uName } });
        }
      },
      (err) => {
        this.presentToast("Hata", 'danger');
      }
    )
  }
  createcategory() {
    var a = {
      name: 'E-Ticaret',
      image: 'eticaret.png'
    }
    this.http.post(`${environment.url}/create-new-category`, a).subscribe((res: any) => {
      this.cats = res
      console.log(this.cats);
    })
  }


  listCategories() {
    this.http.get(`${environment.url}/list-my-favs`).subscribe((res: any) => {
      this.favs = res
      console.log(this.favs);
    })
  }
  
  calculateDiff(sentOn){

    let todayDate = new Date();
    let sentOnDate = new Date(sentOn);
    sentOnDate.setDate(sentOnDate.getDate());
    let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
    // To calculate the no. of days between two dates
    let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
    return differenceInDays;
}

  createFavorite(a,c) {
    console.log(a);

    var b = {
      listId: a,
      f: c,
      
    }
    this.http.post(`${environment.url}/save-fav`, b).subscribe((res: any) => {
      console.log(res);
      this.listCategories()
      if(c === 'add') {
        this.presentToast('İlan favorilere eklendi','success')
      }else {
        this.presentToast('İlan favorilerden çıkartıldı','danger')

      }
    })
  }
}
