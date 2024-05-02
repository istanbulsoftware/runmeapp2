import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { InternetService } from '../internet.service';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { NotificationService } from '../notification.service';
import { Preferences } from '@capacitor/preferences';
import { LanguageService } from '../language.service';
import { Location } from '@angular/common';
const TOKEN_KEY = 'my-token';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  myId
  conversations: any = []
  internetAccess: boolean;
  chats = {}
  getlang : string
  constructor(
    private internet: InternetService,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private socket: Socket,
    private notifi: NotificationService,
    private modalController: ModalController,
    private langservice : LanguageService,
    private location : Location
  ) {
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const de = helper.decodeToken(token.value);
        this.myId = de.id;
        this.socket.emit('joinChat', { roomId: de.id });
        this.syncConvs();
        this.socket.on('convDeleted', (data) => {
          this.syncConvs()
        })
        this.socket.on('newPrivateMessage', (data) => {
          this.syncConvs()
        });
      }
    })

    this.internet.getNetworkState().subscribe(s => {
      this.internetAccess = s;
    });

    this.syncConvs();
    this.notifi.myChats().subscribe(chats => {
      this.chats = chats;
    })


  }
  goBack(){
    this.location.back()
  }
  searchText: string = ''
  search(value: string) {
    this.searchText = value
  }

  newConversation() {
    this.router.navigateByUrl('/search');
  }


  ionViewWillEnter() {
    this.getlang = this.langservice.getLanguage()
    this.syncConvs();
    this.notifi.resetMes();
    Preferences.get({ key: 'new-notification' }).then(a => {
      if (a && a.value) { console.log(a.value) }
    })
  }
  tabHeight = '75px'
  ionViewDidEnter() {
    const tab = document.querySelector('ion-tab-bar');
    const height = tab.clientHeight;
    this.tabHeight = `${height}px`
  }

  error = false
  isLoading = false

  onRefresh() {
    this.isLoading = true
    this.syncConvs()
  }

  async syncConvs() {

    this.http.get(`${environment.url}/get-my-convs`).subscribe(
      (data: any) => {
        this.conversations = data.convs;
        console.log(this.conversations)
        this.error = false
        this.isLoading = false
      },
      err => {
        this.error = true
        this.isLoading = false
      },
    )
  }

  openConv(user1, user2, convId, user1Name, user2Name, user1image, user2image) {
    console.log(user1, user2, convId, user1Name, user2Name, user1image, user2image);

    if (user1 == this.myId) {
      this.router.navigate([`/chat/${user2}`], { queryParams: { convId: convId, name: user2Name, profileimg: user2image } });
    }
    if (user2 == this.myId) {
      this.router.navigate([`/chat/${user1}`], { queryParams: { convId: convId, name: user1Name, profileimg: user1image } });
    }
  }

  deleteConv(convId, e) {
    e.target.innerHTML = `<ion-spinner style="color: var(--ion-color-light); height:80%;"></ion-spinner>`;
    this.http.post(`${environment.url}/delete-conv`, { convId: convId }).subscribe(
      (res: any) => {
        this.syncConvs()
      },
      (err) => { this.presentToast("Hata oluştu. Tekrar deneyin") }
    )
  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

  openProfile(id) {
    this.router.navigateByUrl(`/callvideo/${id}`);
  }

  gotorpfie(user1, user2) {

    if (user1 != this.myId) {
      this.router.navigateByUrl(`/profile/${user1}`);
    } else {
      this.router.navigateByUrl(`/profile/${user2}`);

    }

  }
}
