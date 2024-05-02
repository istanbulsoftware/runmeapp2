import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Location } from "@angular/common";
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, NavParams, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../authentication.service';
import { IconsService } from '../icons.service';
@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.page.html',
  styleUrls: ['./photo-viewer.page.scss'],
})
export class PhotoViewerPage implements OnInit {
  image
  images
  isLoading : boolean
  otherId : any
  otherwho : string
  constructor(
    private activeRoute: ActivatedRoute, 
    private location : Location, 
    private http : HttpClient, 
    public loadingCtrl : LoadingController, 
    private authSer : AuthenticationService,
    private userSer: IconsService,
    private toast : ToastController

    ) { 
      this.otherId = this.activeRoute.snapshot.params['id']
      this.otherwho = this.activeRoute.snapshot.params['who']
      console.log(this.otherwho);
      
      this.syncPhotos(this.otherId)

  }

  ngOnInit() {
  }
  myBackButton() {
    this.location.back()
  }

  syncPhotos(id){
    this.http.get(`${environment.url}/photos-modal/${id}`).subscribe(
      (res: any)=>{
        console.log(res);
        
        this.images = res;
        this.isLoading = false
    },
      err=>{
        //this.presentToast(err.message);
    },
    
    )
  }

  async changeProfile(a) {
    const loading = await this.loadingCtrl.create()
    await loading.present()

    this.authSer.changeProfileImage(a).subscribe(
      async () => {
        this.userSer.syncToken();
        await loading.dismiss().then(() => {
          this.presentToast("Başarılı bir şekilde yapıldı...");
        })
      },
      async (err) => {
        await loading.dismiss().then(() => { this.presentToast("Hata oluştu lütfen tekrar deneyin"); })
      }
    )

  }
  
  async presentToast(m) {
    const alert = await this.toast.create({
      message: m,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
