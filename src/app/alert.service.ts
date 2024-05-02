import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private alertCTL: AlertController,
    public loadingCtl: LoadingController
  ) { }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCTL.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(m) {
    const loading = await this.loadingCtl.create();
    if (m) {
      await loading.present();
    }
    if (!m) {
      await loading.dismiss();
    }
  }
}
