import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController,
    ,
    private alertController: AlertController

  ) { 
    
    
    this.getCoins()

  }


  coins = 0;
  
  async getCoins(){
    const loading = await this.loadingController.create()
    await loading.present()
    this.http.get(`${environment.url}/get-my-coins`).subscribe(
      (res:any) => {this.coins = res.trueCoins; console.log(this.coins);
       loading.dismiss()},
      err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }

  ngOnInit() {
   
  }


  async presentAlert(amount) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: this.trans.instant('WALLET.receiverInfo'),
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: this.trans.instant('WALLET.paypalEmail')
        },
        
      ],
      buttons: [
        {
          text: this.trans.instant('WALLET.cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler:()=>{
            
          }

        }, {
          text: this.trans.instant('WALLET.ok'),
          handler:()=>{

          }

        }
      ]
    });

    

    alert.onDidDismiss().then(
      async(result)=>{
        if(result && result.data && result.data.values.email){
          const loading = await this.loadingController.create({
            message: this.trans.instant('ADS.NEW_AD.loading'),
          });
          await loading.present();

          const paypalEmail = result.data.values.email;
          this.http.post(`${environment.url}/send-paypal-money`,{
            paypalEmail: paypalEmail,
            amount: amount
          }).subscribe(
            (res:any)=>{
              loading.dismiss()
              this.getCoins()
              this.presentToast("Başarılı bir şekilde yapıldı...")
            },
            (err)=>{console.log(err);this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
          )

        }
      },
      err => {console.log(err)}
    )

    await alert.present();

  }

  paypal(amount){
    if(this.coins > (amount*100)){
      this.presentAlert(amount)
    }
    else{
      this.presentToast(this.trans.instant("WALLET.notEnoughCoins"))
    }
  }


  async presentToast(m:string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }
}
