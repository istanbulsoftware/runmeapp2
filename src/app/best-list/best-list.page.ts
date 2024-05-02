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
import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-best-list',
  templateUrl: './best-list.page.html',
  styleUrls: ['./best-list.page.scss'],
})
export class BestListPage  {

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
  randomusers : any
  user: any = {name:'', profilePicture:{publicPath: null}}
  questions
  convId
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

  ) {
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const de = helper.decodeToken(token.value);
        this.myId = de.id;

        this.listWeekly()
        this
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
        console.log(this.user.subscribeStatus);

        this.isLoading = false
      }
      
    })
  
  }
  ionViewWillEnter() {

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
  listWeekly(){
    this.http.get(`${environment.url}/list-weekly`).subscribe((res : any) => {
      this.randomusers = res.weekly
      console.log(res.weekly);


    })
  }

  onSendMessage(id) {
    console.log(id);
    
    if (this.myId == id) {
      return this.presentToast("Kendinize mesaj atamazsınız")
    }
    this.http.post(`${environment.url}/get-conv-id`, { otherId: id }).subscribe(
      (res: any) => {
        console.log(res);
        
        if (res && res.convId) {
          this.convId = res.convId;
          this.router.navigate([`/chat/${id}`], { queryParams: { convId: this.convId, name: '' } });
        }
      },
      (err) => {
        this.presentToast("Hata oluştu");
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
  listLastQuestions() {
    this.http.get(`${environment.url}/last-questions`).subscribe(
      (res: any) => {
        console.log(res);
        this.questions = res
      },
      err => {
        this.presentToast("1" + err.message);
      },
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
