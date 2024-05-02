import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';

import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';

const D_TOKEN = "device-token"

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private platform: Platform,
    private loadingController: LoadingController,
    private alertCtrl : AlertController
  ) { }


  initPush(d) {
    this.registerPush(d);

  }

  private async removeAllChannels() {
    const list = await PushNotifications.listChannels();
    for (const el of list.channels) {
      await PushNotifications.deleteChannel(el);
    }
    return true
  }

  private registerPush(d) {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        this.saveTokenToDatabase(token.value, d);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
      }
    );



    /* PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {

        console.log('Push received: ' + JSON.stringify(notification));


      }
    ); */

    /* PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.notType && data.notType == 'request') {
          this.router.navigateByUrl(`/tabs/tab2`);
        }
        else if (data.notType && data.convId && data.notType == 'message') {
          this.router.navigateByUrl(`/chat/${encodeURIComponent(data.senderId)}?convId=${encodeURIComponent(data.convId)}&name=${encodeURIComponent(data.senderName)}`);
        }
      }
    ); */
  }
  async presentAlert(m){
    const alert = await this.alertCtrl.create({
      header: 'fcm',
      message: m,
      buttons: ['OK'],
    });
    await alert.present();
  }
  async saveTokenToDatabase(token, d) {
    const loading = await this.loadingController.create()
    await loading.present();
    const info = await Device.getInfo();
    if (!token) return;
    else {
      this.http.post(`${environment.url}/register-device`, { token: token, uuid: d }).subscribe(
        async (res) => {
        //  this.presentAlert('22222' + token)
          await loading.dismiss();
        },
        async (err) => {     
        //  this.presentAlert('3333' + token)
        //  this.presentAlert(JSON.stringify(err))
        //  this.presentAlert(JSON.stringify(info))

        await loading.dismiss(); }
      )
    }
  }

  async removeAll(): Promise<any> {
    const del = await this.removeAllChannels();
    const loading = await this.loadingController.create()
    await loading.present();
    const info = await Device.getInfo();

    PushNotifications.removeAllListeners()
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.url}/remove-registered-device`, { uuid: info }).subscribe(
        async (res) => {
          console.log('device registared');
          await loading.dismiss();
          resolve(true)
        },
        async (err) => { console.log(err); await loading.dismiss(); resolve(false) }
      )
    })


  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
