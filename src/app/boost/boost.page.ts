import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-boost',
  templateUrl: './boost.page.html',
  styleUrls: ['./boost.page.scss'],
})
export class BoostPage implements OnInit {
  truecoin = 0
  tiems : number
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private platform: Platform,
    private ref: ChangeDetectorRef,
    private modalController : ModalController

  ) {
    


    this.getCoins()
    this.listVip()
  }



  async getCoins() {
    const loading = await this.loadingController.create()
    await loading.present()
    this.http.get(`${environment.url}/get-my-coins`).subscribe(
      (res: any) => { this.truecoin = res.trueCoins; loading.dismiss() },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }

  ngOnInit() { }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  boostNow(coinQauntity: Number, duration: any) {
  
    this.tiems = (new Date().getTime()/1000.0)
    var a = this.tiems + duration

    console.log(this.tiems);
    console.log(a -this.tiems );
    

    this.http.post(`${environment.url}/boost-profile`, { coinQauntity: coinQauntity, duration : a }).subscribe((res) => {
      console.log(res);
      this.dismiss()
    })
  }


  buyCoins(coinQauntity: Number) {
    this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
      console.log(res);

      this.presentToast("+" + coinQauntity + " Coin yüklendi")
      this.getCoins()
    })
  }

  

  addToWeekly(coinQauntity: Number){
    this.http.post(`${environment.url}/add-weekly`, { token: coinQauntity }).subscribe((res) => {
      console.log(res);
      this.listWeekly()
    })
  }
  listWeekly(){
    this.http.get(`${environment.url}/list-weekly`).subscribe((res) => {
      console.log(res);
    })
  }

  listVip(){

    this.tiems = (new Date().getTime()/1000.0)
    this.http.get(`${environment.url}/list-boosts/${this.tiems}`).subscribe((res) => {
      console.log(res);
    })
  }






  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,

      duration: 2000
    });
    toast.present();
  }



  async alernow(val) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: val,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
