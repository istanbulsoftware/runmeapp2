import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import {
	Glassfy,
	GlassfyOffering,
	GlassfyPermission,
	GlassfySku,
	GlassfyTransaction
} from 'capacitor-plugin-glassfy';
import { BehaviorSubject } from 'rxjs';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class GlossifyService {
	// Init an "empty" user
	user = new BehaviorSubject({ gems: 0, skins: [], pro: false });

	private offerings: BehaviorSubject<GlassfyOffering[]> = new BehaviorSubject([]);

	constructor(
    private toastController: ToastController, 
    private alertController: AlertController,
    private http : HttpClient,
    private router : Router,
    private loadingController : LoadingController
    ) {
		this.initGlassfy();
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
	async initGlassfy() {
		try {
			// Initialise Glassfy
			await Glassfy.initialize({
				apiKey: environment.glassfyKey,
				watcherMode: false
			});

			// Get all user permissions
			const permissions = await Glassfy.permissions();
			this.handleExistingPermissions(permissions.all);

			// Get all offerings (products)
			const offerings = await Glassfy.offerings();
			this.offerings.next(offerings.all);
      this.alernow(JSON.stringify(this.offerings))
		} catch (e) {
			console.log('init error: ', e);
		}
	}


  
  async purchase(sku: GlassfySku, listId) {
    try {
      const transaction = await Glassfy.purchaseSku({ sku });
      if (transaction.receiptValidated) {
        this.handleSuccessfulTransactionResult(transaction, sku, listId);
      }
    } catch (e) {
      console.log(e);
      
    }
  }

  boostNow(listId){
    
    this.http.post(`${environment.url}/boost-list-now`, {listId : listId, days : 7}).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/mylists']);
      },
      err => {
        //this.presentToast(err.message);
      },

    )
  }


 async handleExistingPermissions(permissions: GlassfyPermission[]) {
    for (const perm of permissions) {
      if (perm.isValid) {
        if (perm.permissionId === 'apack') {

        } else if (perm.permissionId === 'bpack') {

        } else if (perm.permissionId === 'cpack') {

        } else if (perm.permissionId === 'dpack') {

        }
      }
    }
  }

  async handleSuccessfulTransactionResult(    transaction: GlassfyTransaction,    sku: GlassfySku,    listId  ) {
    if (transaction.productId.indexOf('apack') >= 0) {
     // const user = this.user.getValue();
     // user.gems += +sku.extravars.gems;
     // this.user.next(user);
     this.buyCoins(5)
    }

    if (transaction.productId.indexOf('bpack') >= 0) {
      this.buyCoins(10)
    }

    if (transaction.productId.indexOf('cpack') >= 0    ) {
      this.buyCoins(20)
    }
    if (transaction.productId.indexOf('dpack') >= 0    ) {
      this.buyCoins(50)
    }

  }

	// Helper functions
	getOfferings() {
		return this.offerings.asObservable();
	}

	async restore() {
		const permissions = await Glassfy.restorePurchases();
		console.log(permissions);
		// Handle those permissions!
	}

  buyCoins(coinQauntity: Number) {
    this.http.post(`${environment.url}/buy-coins`, { coinQauntity: coinQauntity }).subscribe((res) => {
      console.log(res);
     this.presentToast("+" + coinQauntity + " Coin yüklendi")
     // this.getCoins()
    })
  }
  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,

      duration: 2000
    });
    toast.present();
  }

}