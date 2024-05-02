import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { InAppPurchase2, IAPProduct } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { Router } from '@angular/router';
const AACOINPACK: string = 'aoneday';
const GCOINPACK: string = 'bbulkmessage';
const HCOINPACK: string = 'asubpack';
const ICOINPACK: string = 'subbpack';
const JCOINPACK: string = 'subbpackb';
const KCOINPACK: string = 'subbpacke';

@Component({
  selector: 'app-walletsubs',
  templateUrl: './walletsubs.page.html',
  styleUrls: ['./walletsubs.page.scss'],
})
export class WalletsubsPage implements OnInit {
  products: IAPProduct[] = [];
  truecoin = 0
  currenttime : any
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private platform: Platform,
    private store: InAppPurchase2,
    private ref: ChangeDetectorRef,
    private navCtrl : NavController,
    private router: Router

  ) {
    
    
    this.platform.ready().then(() => {
      // Only for debugging!
      this.store.verbosity = this.store.DEBUG;

      this.registerProducts();

      // Get the real product information
      this.store.ready(() => {
        this.products = this.store.products;
        this.ref.detectChanges();
      });

    });

    this.getCoins()

  }

  ionViewWillEnter(){
    this.products  = [];
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



  buyCoins(coinQauntity: Number) {
    this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
      console.log(res);
      this.presentToast("+" + coinQauntity + " Coin yüklendi")
      this.getCoins()
    })

  }
  purchase(product: IAPProduct) {

    this.store.order(product).then(p => {

    if (p.id === GCOINPACK) {
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
      color : "success",
      duration: 2000
    });
    toast.present();
  }
}
