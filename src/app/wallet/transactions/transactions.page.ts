import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  isLoading = false
  data = [];
  constructor(
    private http: HttpClient,
    ,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController
  ) { 

    this.syncTransactions()

   }

   syncTransactions(){
     this.isLoading=true;
     this.http.get(`${environment.url}/my-transactions2`).subscribe(
       (res:any)=>{
         this.isLoading = false;
         console.log(res)
         this.data = res;
       },
       (res:any)=>{
         this.isLoading=false
         this.presentToast("Hata oluştu lütfen tekrar deneyin")
        }
     )
   }

  ngOnInit() {
  }

  onClick(batchId, status){
    if(status != 'SUCCESS' && status != 'UNCLAIMED' && status != 'ONHOLD' && status != 'PENDING'){
      this.presentActionSheet(batchId);
    }
  }

  async presentActionSheet(batchId) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [ 
        {
        text: this.trans.instant('WALLET.returnCoins'),
        icon: 'wallet',
          handler: async() => {
            const loading = await this.loadingController.create();
            await loading.present();
            this.http.post(`${environment.url}/return-coins`,{batchId: batchId}).subscribe(
              (res:any)=>{
                loading.dismiss();
                this.presentToast("Başarılı bir şekilde yapıldı...")
              },
              (res:any)=>{
                loading.dismiss();
                this.presentToast("Hata oluştu lütfen tekrar deneyin")
              },
            )
          }
        }
      ]
    });
  
    await actionSheet.present();
  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
