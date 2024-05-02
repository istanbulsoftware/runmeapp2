import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController, ToastController, IonSlides, IonContent, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { InternetService } from '../internet.service';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { IconsService } from '../icons.service';

import { NotificationService } from '../notification.service';
import { FilterPage } from '../filter/filter.page';
import { IntroPage } from '../intro/intro.page';
import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('mySlider', {static: true}) Slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;

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
    slidesPerView: 5,
    loop: false,
    centeredSlides: false
  };
  myId
  conversations: any = []
  internetAccess: boolean;
  chats = {}
  vipusers : any
  newusers : any
  randomusers : any
  user: any = {name:'', profilePicture:{publicPath: null}}

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
    private navCtrl : NavController
  ) {

    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const de = helper.decodeToken(token.value);
        this.myId = de.id;
        this.listvipUsers('vip')
        this.listNewUsers('person')
        this.socket.emit('joinChat', { roomId: de.id });
      }
    })

    this.internet.getNetworkState().subscribe(s => {
      this.internetAccess = s;
    });



  }
  searchText: string = ''
  search(value: string) {
    this.searchText = value
  }

  newConversation() {
    this.router.navigateByUrl('/search');
  }

  ngOnInit(){

    this.userSer.getUser().subscribe((user: any)=>{
      if(user && user.email){
        
        this.user = user
        console.log(this.user.profilePicture.fileName);
        if(this.user.profilePicture.fileName === null) {
          
        }else {
        }

        this.isLoading = false
      }
      
    })
  
  }
  ionViewWillEnter() {
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const de = helper.decodeToken(token.value);
        this.myId = de.id;
        this.listRandom('')
        this.socket.emit('joinChat', { roomId: de.id });
      }
    })
  }
  tabHeight = '75px'


  error = false
  isLoading = false









  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }



  listvipUsers(value){
    this.http.post(`${environment.url}/listvip`, { name: value }).subscribe(
      (res: any) => {
        console.log(res.foundedUsers);
        this.vipusers = res.foundedUsers
      }
    )
  }
  listNewUsers(value){
    this.http.post(`${environment.url}/listnew`, { name: value }).subscribe(
      (res: any) => {
        console.log(res.foundedUsers);
        this.newusers = res.foundedUsers.reverse();
      }
    )
  }
  listRandom(value){
    this.http.post(`${environment.url}/listrandom`, { name: value }).subscribe(
      (res: any) => {
        console.log(res.foundedUsers);
        this.randomusers = res.foundedUsers
      }
    )
  }

  shufleRondom(){
    this.http.post(`${environment.url}/listrandom`, { name: "" }).subscribe(
      (res: any) => {
        console.log(res.foundedUsers);
        this.randomusers = this.randomArrayShuffle(res.foundedUsers)
        this.content.scrollToTop(400);
      }
    )
  }
  randomArrayShuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  goP(val){
    this.router.navigateByUrl(`/profile/${val}`);

  }
  gotorpfie(user1, user2) {

    if (user1 != this.myId) {
      this.router.navigateByUrl(`/profile/${user1}`);
    } else {
      this.router.navigateByUrl(`/profile/${user2}`);

    }

  }
  async goSetopt() {
    console.log("ff");
    
    this.navCtrl.navigateRoot('/setopt')
  }
  async goBoost() {
    this.router.navigateByUrl('/boost')
  }
  async goFilter() {
      const modal = await this.modalController.create({
        component: FilterPage,
        cssClass: 'filter-page-css',
        swipeToClose: true,
        presentingElement: await this.modalController.getTop()
      });
      return await modal.present();
  }
  async goIntro() {
    const modal = await this.modalController.create({
      component: IntroPage,
     // cssClass: 'filter-page-css',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
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
