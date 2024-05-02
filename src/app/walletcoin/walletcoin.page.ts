import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
// import { Admob, AdmobOptions } from '@awesome-cordova-plugins/admob/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { GlassfySku } from 'capacitor-plugin-glassfy';
import { GlossifyService } from '../glossify.service';

const ACOINPACK: string = 'apack'; //25
const BCOINPACK: string = 'bpack'; //60
const CCOINPACK: string = 'cpack'; // 100
const DCOINPACK: string = 'dpack'; // 175



@Component({
  selector: 'app-walletcoin',
  templateUrl: './walletcoin.page.html',
  styleUrls: ['./walletcoin.page.scss'],
})

export class WalletcoinPage implements OnInit {
  offerings = this.glossfy.getOfferings();
  truecoin = 0
  listId: string
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private platform: Platform,
    private ref: ChangeDetectorRef,
   // private admob: Admob,
    private activaedRoute: ActivatedRoute,
    private router: Router,
    private glossfy : GlossifyService

  ) {
    this.listId = this.activaedRoute.snapshot.params['listId']
  }




  async getCoins() {
    const loading = await this.loadingController.create()
    await loading.present()
    this.http.get(`${environment.url}/get-my-coins`).subscribe(
      (res: any) => { this.truecoin = res.trueCoins; loading.dismiss() },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }

  ngOnInit() {

  }



  boostNow(days) {
    this.http.post(`${environment.url}/boost-list-now`, { listId: this.listId, days: days }).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/mylists']);
      },
      err => {
        //this.presentToast(err.message);
      },
    )
  }

  buyCoins(coinQauntity: Number) {
    this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
      console.log(res);
      this.presentToast("+" + coinQauntity + " Coin yüklendi")
      this.getCoins()
    })
  }



	async purchase(sku: GlassfySku, id) {
		await this.glossfy.purchase(sku, id);
	}

	async restore() {
		await this.glossfy.restore();
	}





  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,

      duration: 2000
    });
    toast.present();
  }


  // showAwarAds() {
  //   // Admob options config
  //   const admobOptions: AdmobOptions = {
  //     publisherId: "ca-app-pub-4339594984970735~2930857698",  // Required
  //     bannerAdId: 'ca-app-pub-9253164879619401/6316915500',
  //     interstitialAdId: 'ca-app-pub-9253164879619401/7438425485',
  //     rewardedAdId: 'ca-app-pub-4339594984970735/3906147570',
  //     isTesting: false,
  //     autoShowBanner: false,
  //     autoShowInterstitial: false,
  //     autoShowRewarded: true,
  //     adSize: admob.AD_SIZE.BANNER
  //   };

  //   // Set admob options
  //   this.admob.setOptions(admobOptions).then(() => {
  //     // Request a rewarded ad
  //     this.admob.requestRewardedAd()
  //       .then(() => {
  //         // this.buyCoins(1)
  //         // this.getCoins()

  //         // Request a rewarded ad
  //         this.admob.requestRewardedAd()
  //           .then(() => {
  //             this.admob.onAdLoaded().subscribe((ad) => {
  //               if (ad.adType === this.admob.AD_TYPE.REWARDED) {
  //                 this.admob.showRewardedAd()
  //                   .then((res) => {
  //                     this.admob.onRewardedAd().subscribe(() => {
  //                       this.buyCoins(1)
  //                       this.getCoins()

  //                     }),
  //                       error => {
  //                         console.log(error);
  //                         this.alernow(JSON.stringify(error))
  //                       }


  //                   })
  //                   .catch(err => {
  //                     this.presentToast("Coin yüklenemedi")

  //                   });
  //               }
  //             });
  //           })
  //           .catch(err => {
  //             this.alernow(JSON.stringify(err))

  //           });
  //       })
  //       .catch(err => {
  //         this.alernow(JSON.stringify(err))

  //       });
  //   }).catch(err => {
  //     this.alernow("1" + JSON.stringify(err))
  //     this.alernow("2" + err)

  //   })
  // }

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
