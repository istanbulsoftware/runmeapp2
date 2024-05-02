import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { IconsService } from '../icons.service';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { Subscription } from 'rxjs';


import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnDestroy {
  userId: string;

  req = 0
  mes = 0

  mesSub: Subscription
  reqSub: Subscription

  isListening = false
  testVar: string
  constructor(private http: HttpClient,
    private socket: Socket,
    private userSer: IconsService,
    private route: Router,
    private toastController: ToastController,
    private notfi: NotificationService,
    private navCtrl: NavController
  ) {
    

    this.mesSub = this.notfi.numOfMes().subscribe(res => {
      if (res >= 0) {
        this.mes = res;
      }
    });
    this.reqSub = this.notfi.numOfReq().subscribe(res => {
      if (res >= 0) {
        this.req = res;
      }
    });

    Preferences.get({ key: TOKEN_KEY }).then((token) => {
      if (token && token.value) {
        //this.socket.ioSocket.io.opts.query = { token: token.value } 
        const m = helper.decodeToken(token.value);
        this.userId = m.id;
        console.log(m.id);
        this.socket.connect();
        this.socket.emit('joinChat', { roomId: m.id });

        this.socket.on(m.id + "/profileChanged", async () => {
          console.log('My profile changed');

          this.http.get(`${environment.url}/getNewToken`).subscribe(
            (resToken: any) => {
              Preferences.set({ key: TOKEN_KEY, value: resToken.token })
                .then(() => { this.userSer.syncToken() })
                .catch(err => { console.log(err); })
            },
            (err) => {
              console.log(err);
            },
          )
        });
      }
    })

  }
  goto() {
    this.route.navigateByUrl('/tabs/list', { replaceUrl: true });
  }
  ngOnDestroy() {
    console.log('destroyed');

    this.socket.removeAllListeners(`${this.userId}/profileChanged`);
    this.mesSub.unsubscribe()
    this.reqSub.unsubscribe()
  }


  ionViewDidEnter() {

    if (!this.isListening) {
      this.isListening = true;
      PushNotifications.createChannel({
        id: '123',
        name: 'All',
        description: 'Displays all kinds of notifications',
        sound: 'message_tone.mp3',
        importance: 3,
        visibility: -1,
        lights: true,
        lightColor: '#3bc2ca',
        vibration: true
      })
      PushNotifications.createChannel({
        id: '1234',
        name: 'VideoCall',
        description: 'Displays video calling notifications',
        sound: 'call.mp3',
        importance: 3,
        visibility: -1,
        lights: true,
        lightColor: '#3bc2ca',
        vibration: true
      })
      PushNotifications.createChannel({
        id: '12345',
        name: 'VoiceCall',
        description: 'Displays voice calling notifications',
        sound: 'call.mp3',
        importance: 3,
        visibility: -1,
        lights: true,
        lightColor: '#3bc2ca',
        vibration: true
      })

      PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log(this.route.url)
        const splitedURL = this.route.url.split('/chat/')
        const data = notification.data

        if (data.notType && data.notType == 'request') { this.notfi.incReq() }
        if (data.notType && data.notType == 'message') {
          this.notfi.incMes();
          this.notfi.increase(data.convId)
        }
        if (data.notType && data.notType == 'call') {
          this.notfi.incCall();
        }

        if (data.notType && data.notType == 'request' && this.route.url != '/tabs/tab2') {
          this.presentToast(`${notification.title}: "Yeni bildiriminiz var"}`)
        }  else

              if ((splitedURL.length > 1) && (((this.route.url.split('convId=')[1]).split('&')[0]) != data.convId)) {
                this.testVar = "a"
                this.presentToast(`${notification.title}: "Yeni mesajınız var"}`)
              } else
                if ((splitedURL.length < 2)) {
                  this.testVar = "b"

                  this.presentToast(`${notification.title}:"Yeni mesajınız var"}`)
                }


      });


      PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.notType && data.notType == 'request') {
          this.route.navigateByUrl(`/tabs/tab2`);
        } 
        else if (data.notType && data.convId && data.notType == 'message') {
          this.route.navigateByUrl(`/chat/${encodeURIComponent(data.senderId)}?convId=${encodeURIComponent(data.convId)}&name=${encodeURIComponent(data.senderName)}`);
        }
      });





    }

  }




  async presentToast(m) {



    const toast = await this.toastController.create({
      message: m,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  nav(){
    this.navCtrl.navigateForward(["/advert-create/1"]);
  }

}
