import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


import { BehaviorSubject } from 'rxjs';

const { Browser } = Plugins;

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {
  adId
  adDetail
  isLoading = true
  isVideoReady = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private route: ActivatedRoute,
    ,
    private router: Router
  ) {
    
    this.route.params.pipe(take(1)).subscribe(params=>{
      this.adId = params.id
      this.http.get(`${environment.url}/get-my-ad/${params.id}`).subscribe(
        (res:any)=>{
          if(res){
            console.log(res);
            this.adDetail = res;
            this.isLoading = false
            this.isVideoReady.next(true);
          }
        },
        (err)=>{
          this.presentToast("Hata oluştu lütfen tekrar deneyin");
        }
      )
       
    })
   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.isVideoReady.subscribe(a=>{
      if(a){
        setTimeout(() => {
          if(this.adDetail && this.adDetail.video && this.adDetail.video.publicPath){
            const video:any =  document.getElementById(this.adDetail._id)
            video.currentTime = 0
            video.addEventListener("seeked", function() { video.play(); }, true);
            video.oncanplay = ()=>{
              video.play()
            }
            
          }
        }, 1000);
      }
    })
    
  }

  ionViewWillLeave(){
    const video:any =  document.getElementById(this.adDetail._id)
    video.currentTime = 0
    video.pause();
  }

  onVisitProfile(userId){
    this.router.navigateByUrl(`/profile/${userId}`)
  }

  onMore(link){
    Browser.open({url: link});
  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }


}
