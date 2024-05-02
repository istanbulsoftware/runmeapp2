import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';

import { environment } from './../../environments/environment'
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();


import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-relation-test',
  templateUrl: './relation-test.page.html',
  styleUrls: ['./relation-test.page.scss'],
})
export class RelationTestPage implements OnInit {
  rtctoken: string
  Allusers: any
  userInfo: any = { name: '', email: '', gender: '', accountType: '', businessCategory: '', birthday: '', bio: '' }
  myId
  id: string
  user1: string
  user2: string
  user1Name: string
  user2Name: string
  roomid: string
  callstatus: string
  isLoading = true
  other = false
  convId
 
  showData = false;
  smallPreview: boolean;
  IMAGE_PATH: any;
  colorEffect = 'none';
  setZoom = 1;
  flashMode = 'off';
  isToBack = false;
  timer: any
  calmasuresi: number
  localId : string = '1'
  createdcallId : string
  constructor(
    private loadingCtrl : LoadingController,
    private acticeRoute: ActivatedRoute,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private router: Router,
    
    private navParams: NavParams,
    private modalController: ModalController,
    private socket: Socket
  ) { 
        //this.startCameraAbove()
        this.user1 = this.navParams.get('user1');
        this.user2 = this.navParams.get('user2');
        this.user1Name = this.navParams.get('user1Name');
        this.user2Name = this.navParams.get('user2Name');
        this.id = this.user2;
        console.log(this.user1, this.user2, this.convId, this.user1Name, this.user2Name)
        this.loadToken();
        Preferences.get({ key: TOKEN_KEY }).then(token => {
          if (token && token.value) {
            const a = helper.decodeToken(token.value);
            this.myId = a.id
          }
        })
    
        // if (this.form.value.message.trim().length > 0) {
        this.socket.emit('newCallingvideo', { roomId: this.convId, senderId: this.user1, message: 'CallVideoo', mesType: 'text' });
        //  this.form.controls.message.setValue('');
        // }
    
    
    
    
        //this.startCameraAbove()
        //this.startCameraBelow()
    
    
    
        Preferences.get({ key: TOKEN_KEY }).then(token => {
          if (token && token.value) {
            const m = helper.decodeToken(token.value);
            this.myId = m.id
          }
        })
    
    
    
    
    
    
        this.socket.emit('joinvideo', { roomId: this.convId });
        // this.socket.on('removedBlockedUser', (data) => {
        //   if (data && data.user1 && data.user2) {
        //     this.checkBlock()
        //   }
        // })
        // this.socket.on('newBlockedUser', (data) => {
        //   if (data && data.user1 && data.user2) {
        //     if (data.user1 == this.myId && data.user2 == this.id || data.user2 == this.myId && data.user1 == this.id) {
        //       this.checkBlock()
        //     }
        //   }
        // })
    
        this.socket.on('convDeleted', (data) => {
          console.log(data)
          if (data && data.convId && data.convId == this.convId) {
            this.router.navigateByUrl('/tabs/tab1')
            this.presentToast('This Conversation Has Been Deleted by a User');
          }
        })
        this.socket.on('gelencevap', (data) => {
          console.log(data);
          if(data.isDeclined == 'declined') {
            //this.dismiss()
          }
        })
    
        
        this.socket.on('newPrivatevidecall', (data) => {
          console.log(data);
    
          if (data && data._id && data.senderId && data.message) {
            //  this.newMessages.push(data);
    
    
          }
        })
  }

  ngOnInit() {
  }
  token
  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) { this.token = token.value; }
  }
  createNewCall() {
    
    this.http.post(`${environment.url}/create-new-relation-test`, {
      senderId: this.user2,
      receiverId: this.user1,
      callType: 'uyum',
      callStatus: 'offer',

    }).subscribe(
      (res: any) => {
       // this.presentToast("Başarılı bir şekilde yapıldı...")
        console.log(res)
        this.createdcallId = res.message._id 
        console.log(this.createdcallId)

      },
      err => { this.presentToast("Hata oluştu lütfen tekrar deneyin") }
    );
  }


  async presentLoadingWithOptions() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Cevap vermesi bekleniyor...',
      duration: 5000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  
  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

  dismiss() {




        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
          'dismissed': true
        });
      
      err => { this.presentToast("Hata oluştu lütfen tekrar deneyin") }
    

  }
}
