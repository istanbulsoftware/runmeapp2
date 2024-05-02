import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { InAppPurchase2, IAPProduct } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
//import { Admob, AdmobOptions } from '@awesome-cordova-plugins/admob/ngx';
import { Preferences } from '@capacitor/preferences';


const AACOINPACK: string = 'aoneday';
const ACOINPACK: string = 'coin10';
const BCOINPACK: string = 'coin50';
const CCOINPACK: string = 'coin100';
const DCOINPACK: string = 'coin500';
const ECOINPACK: string = 'coin1000';
const FCOINPACK: string = 'coin2000';
const GCOINPACK: string = 'bbulkmessage';

const HCOINPACK: string = 'asubpack';
const ICOINPACK: string = 'subbpack';
const JCOINPACK: string = 'subbpackb';
const KCOINPACK: string = 'subbpacke';

@Component({
  selector: 'app-watch-ads',
  templateUrl: './watch-ads.page.html',
  styleUrls: ['./watch-ads.page.scss'],
})
export class WatchAdsPage implements OnInit {
  products: IAPProduct[] = [];
  truecoin = 0
isDailyToken : boolean 
getShare : boolean
isShareCollected : boolean
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private platform: Platform,
    private store: InAppPurchase2,
    private ref: ChangeDetectorRef,
    //private admob: Admob,

  ) {


    this.platform.ready().then(() => {
      // Only for debugging!
      this.store.verbosity = this.store.DEBUG;

      this.registerProducts();
      this.setupListeners();

      // Get the real product information
      this.store.ready(() => {
        this.products = this.store.products;
        this.ref.detectChanges();
      });

    });
    this.getCoins()
    this.checkWithin()
    this.checkShare()
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

  registerProducts() {
    this.store.register({
      id: AACOINPACK,
      type: this.store.CONSUMABLE,
    });
    this.store.register({
      id: ACOINPACK,
      type: this.store.CONSUMABLE,
    });

    this.store.register({
      id: BCOINPACK,
      type: this.store.CONSUMABLE,
    });
    this.store.register({
      id: CCOINPACK,
      type: this.store.CONSUMABLE,
    });
    this.store.register({
      id: DCOINPACK,
      type: this.store.CONSUMABLE,
    });
    this.store.register({
      id: ECOINPACK,
      type: this.store.CONSUMABLE,
    });
    this.store.register({
      id: FCOINPACK,
      type: this.store.CONSUMABLE,
    });
    this.store.register({
      id: GCOINPACK,
      type: this.store.CONSUMABLE,
    });


    this.store.register({
      id: HCOINPACK,
      type: this.store.PAID_SUBSCRIPTION,
    });
    this.store.register({
      id: ICOINPACK,
      type: this.store.PAID_SUBSCRIPTION,
    });
    this.store.register({
      id: JCOINPACK,
      type: this.store.PAID_SUBSCRIPTION,
    });
    this.store.register({
      id: KCOINPACK,
      type: this.store.PAID_SUBSCRIPTION,
    });
    this.store.refresh();
  }

  setupListeners() {
    // General query to all products
    this.store.when('product').approved((p: IAPProduct) => {
      // Handle the product deliverable
      if (p.id === ACOINPACK) {
        this.buyCoins(10);
      } else if (p.id === BCOINPACK) {
        this.buyCoins(50);
      } else if (p.id === CCOINPACK) {
        this.buyCoins(100);
      } else if (p.id === DCOINPACK) {
        this.buyCoins(500);
      } else if (p.id === ECOINPACK) {
        this.buyCoins(1000);
      } else if (p.id === FCOINPACK) {
        this.buyCoins(2000);
      } else if (p.id === GCOINPACK) {
        this.buyCoins(2000);
      } else if (p.id === HCOINPACK) {
        this.buyCoins(2000);
      } else if (p.id === ICOINPACK) {
        this.buyCoins(2000);
      } else if (p.id === JCOINPACK) {
        this.buyCoins(2000);
      } else if (p.id === KCOINPACK) {
        this.buyCoins(2000);
      }

      this.ref.detectChanges();
      return p.verify();
    })
      .verified((p: IAPProduct) => p.finish());
  }


  async checkShare() {

    // 1 - paylaşım yapıldı mı
    const aa = await Preferences.get({ key: 'getShare' });
    if (aa && aa.value) {
          // 2 - paylaşım yapıldı

      console.log(aa.value);
      console.log("hiç paylaşmış");
      var d = new Date().getTime();
      var yesTime = d - 24*60*60*1000;
      var cc = Number(aa.value)
      if(yesTime < cc) {
        //bugün paylaşım ypaıldı
       this.getShare = true

       
       const dd = await Preferences.get({ key: 'getShareCollected' });

       var ee = Number(dd.value)
       if (dd && dd.value) {
        if(yesTime < ee) {
          //bugün coin toplandı
           this.isShareCollected = true
         }else {
           this.isShareCollected = false
           //bugün coin toplanmadı

         }
       }else {
        this.isShareCollected = false
       }





      }else {
       // bugün paylaşım yapılmadı 

        this.getShare = false
      }
    }else {
     // 3 -paylşaım yapılaöadı 
      console.log("hiç paylaşmamış");
      
      this.getShare = false
    }
  }

  async shareCoins(coinQauntity: Number) {
    var a = Date.now()
    var b = a + ""
    console.log(b);
    const aa = await Preferences.get({ key: 'getShare' });
    if (aa && aa.value) {
      console.log("senaryo 2 : daha önce paylaşım yapmış" + aa);
      console.log("senaryo 3 : tarihi kontrol et" + aa.value);
      console.log(aa.value);
      
      var d = new Date().getTime();
      var yesTime = d - 24*60*60*1000;

      var shareTime = Number(aa.value)

      if(yesTime < shareTime) {
        //24 saat içibde paylaşım yapılmış
        const dd = await Preferences.get({ key: 'getShareCollected' });
        if (dd && dd.value) {
          var shareCollectedTime = Number(dd.value)

          if(yesTime < shareCollectedTime) {
           //bugün coin toplandı
           this.presentToast("Paylaşım jetonu daha önce yüklenmiş")

            this.isShareCollected = true
          }else {
            this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
              console.log(res);
              this.isShareCollected = true

              var a = Date.now()
              var b = a + ""
              Preferences.set({ key: 'getShareCollected', value: b })
              this.presentToast("+" + coinQauntity + " paylaşım  jetonu yüklendi")
              this.getCoins()
            })
 
          }
        }else {
          this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
            console.log(res);
            this.isShareCollected = true

            var a = Date.now()
            var b = a + ""
            Preferences.set({ key: 'getShareCollected', value: b })
            this.presentToast("+" + coinQauntity + " paylaşım jetonu yüklendi")
            this.getCoins()
          })


        }
 
        
      }else if(yesTime > shareTime) {

          this.presentToast("24 saat içinde  hikaye paylaşılmamış")
        
      }
    } else {
      this.presentToast("Daha önce hiç hikaye paylaşılmamışş")

    }

  }

 async checkWithin() {
    const aa = await Preferences.get({ key: 'getDaily' });
    if (aa && aa.value) {
      console.log(aa.value);
      
      var d = new Date().getTime();
      var yesTime = d - 24*60*60*1000;

      var cc = Number(aa.value)

      if(yesTime < cc) {
       this.isDailyToken = true
        
      }else {
        this.isDailyToken = false

      }
    }else {
      this.isDailyToken = false

    }

  }


  async dailyCoins(coinQauntity: Number) {
    this.isDailyToken = false
    var a = Date.now()
    var b = a + ""
    console.log(b);
    const aa = await Preferences.get({ key: 'getDaily' });
    if (aa && aa.value) {
      console.log("senaryo 2 : daha önce reklam izlemiş" + aa);
      console.log("senaryo 3 : tarihi kontrol et" + aa.value);
      console.log(aa.value);
      
      var d = new Date().getTime();
      var yesTime = d - 24*60*60*1000;

      var cc = Number(aa.value)

      if(yesTime < cc) {
        this.presentToast("Günlük coin daha önce yüklenmiş")
        this.isDailyToken = true
      }else if(yesTime > cc) {
        this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
          console.log(res);
          Preferences.set({ key: 'getDaily', value: b })
          this.isDailyToken = true
          this.presentToast("+" + coinQauntity + " Günlük coin yüklendi")
          this.getCoins()
        })
      }
    } else {
      //ilk kez alıyor
      this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
        console.log(res);
        Preferences.set({ key: 'getDaily', value: b })
        this.isDailyToken = true
        this.presentToast("+" + coinQauntity + " Günlük coin yüklendi")
        this.getCoins()
      })

    }

  }

  buyCoins(coinQauntity: Number) {
    this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
      console.log(res);
      this.presentToast("+" + coinQauntity + " Coin yüklendi")
      this.getCoins()
    })

  }
  purchase(product: IAPProduct) {

    this.store.order(product).then(p => {

      if (p.id === ACOINPACK) {
        console.log(p.id);

      } else if (p.id === BCOINPACK) {
        console.log(p.id);
      } else if (p.id === CCOINPACK) {
        console.log(p.id);
      } else if (p.id === DCOINPACK) {
        console.log(p.id);
      } else if (p.id === ECOINPACK) {
        console.log(p.id);
      } else if (p.id === FCOINPACK) {
        console.log(p.id);
      }
      else if (p.id === GCOINPACK) {
        console.log(p.id);
      } else if (p.id === HCOINPACK) {
        console.log(p.id);
      } else if (p.id === ICOINPACK) {
        console.log(p.id);
      } else if (p.id === JCOINPACK) {
        console.log(p.id);
      } else if (p.id === KCOINPACK) {
        console.log(p.id);
      }




    }, e => {
      this.presentToast('Hatalı')

    });
  }


  restore() {
    this.store.refresh();
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
  //     publisherId: "ca-app-pub-9253164879619401~7856679140",  // Required
  //     bannerAdId: 'ca-app-pub-9253164879619401/6316915500',
  //     interstitialAdId: 'ca-app-pub-9253164879619401/7438425485',
  //     rewardedAdId: 'ca-app-pub-9253164879619401/1099699101',
  //     isTesting: true,
  //     autoShowBanner: false,
  //     autoShowInterstitial: false,
  //     autoShowRewarded: false,
  //     adSize: this.admob.AD_SIZE.BANNER
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
