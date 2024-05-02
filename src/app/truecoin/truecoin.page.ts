import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-truecoin',
  templateUrl: './truecoin.page.html',
  styleUrls: ['./truecoin.page.scss'],
})
export class TruecoinPage implements OnInit {
  metamaskForm
  credentials
  userTrue:number

  constructor(
    private authSer:AuthenticationService, 
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController,
    ,
    private alertController: AlertController

  ) { 
    
    this.getCoins()


    this.metamaskForm = new FormGroup({

      metamask: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      quantity: new FormControl(null,{
        validators: [Validators.required]

      }),
    });

    

  }
  get metamask(){return this.metamaskForm.get('metamask')}
  get quantity(){return this.metamaskForm.get('quantity')}

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

  async sendResetCode()
  {
    const loading = await this.loadingController.create();
    await loading.present();
    this.http.get(`${environment.url}/get-my-coins`).subscribe(
      (res:any) => {
       if(this.metamaskForm.value.quantity < res.trueCoins) {
        this.authSer.changeUserToken(this.metamaskForm.value.metamask, this.metamaskForm.value.quantity)
        .subscribe(
          async (res) => {
            this.userTrue = this.metamaskForm.value.metamask
            await loading.dismiss();
            this.getCoins()
            this.presentToast("Başarılı bir şekilde yapıldı...");
    
          },
          async (res) => {
            await loading.dismiss();
            this.presentToast("Hata oluştu lütfen tekrar deneyin");
          }
        );
       }else {
        async (res) => {
          await loading.dismiss();
          this.presentToast("Hata oluştu lütfen tekrar deneyin");
        }
       }

     })

  }
  async presentWarn(warn) {
    const alert = await this.alertController.create({
      message: warn
    })
  }
  async presentAlert(amount) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: this.trans.instant('WALLET.receiverInfo'),
      inputs: [
        {
          name: 'metamask',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'text',
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
