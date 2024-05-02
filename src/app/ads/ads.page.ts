import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, Platform, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';


import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';const { Browser } = Plugins;
import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.page.html',
  styleUrls: ['./ads.page.scss'],
})
export class AdsPage implements OnInit {
  ads = []
  isLoading = true
  token
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    ,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private platform: Platform,
    private camera: Camera,
    private videoEditor: VideoEditor,
    private loadingController: LoadingController,
    private filePath: FilePath,
    private fileTrans: FileTransfer, 
  ) { 

    Preferences.get({key:TOKEN_KEY}).then(token=>{
      if(token && token.value){
        this.token = token.value
      }
    })

    this.syncAds()

  }

  photoOptions: CameraOptions = {
    allowEdit: false,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    mediaType: this.camera.MediaType.PICTURE,
    destinationType: this.camera.DestinationType.FILE_URI
  };
  videoOptions: CameraOptions = {
    allowEdit: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    mediaType: this.camera.MediaType.VIDEO,
    destinationType: this.camera.DestinationType.FILE_URI
  };

  countDays(end){
    const a = new Date(Date.now())
    const d = a.toISOString().split('T')[0]
    const e = new Date(d);
    const b = new Date(end)

    const days = (b.getTime()-e.getTime())/(1000 * 3600 * 24)

    if(days > 0 ){
      return days
    }
    else{
      return 0
    }


  }

  editAds(adId, adStatus){
    this.isLoading = true
    var x 
    if(adStatus == 'active') {x = 'inactive'}else if(adStatus == 'inactive'){x = 'active'}
    this.http.post(`${environment.url}/edit-my-ad`,{id: adId, status : x}).subscribe(
      (res: any)=>{
        this.isLoading=false
        this.syncAds();
        this.presentToast("Başarılı bir şekilde yapıldı...")
        this.syncAds()
      },
      (err)=>{
        this.isLoading=false; 
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    )
  }

  delete(id){
    this.isLoading = true
    this.http.post(`${environment.url}/remove-my-ad`,{id: id}).subscribe(
      (res: any)=>{
        this.isLoading=false
        this.syncAds();
        this.presentToast("Başarılı bir şekilde yapıldı...")
      },
      (err)=>{
        this.isLoading=false; 
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    )
  }

  syncAds(){
    this.isLoading = true
    this.http.get(`${environment.url}/get-my-ads`).subscribe(
      (res: any)=>{
        this.ads = res; 
        this.isLoading=false
        console.log(this.ads)
      },
      (err)=>{
        this.isLoading=false; 
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    )
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.syncAds()
  }

  previewAd(adId){
    this.router.navigateByUrl(`/ads/preview/${adId}`);
  }

  completePayment(adId){
    this.isLoading = true
    this.http.post(`${environment.url}/complete-ad-payment`,{adId: adId}).subscribe(
      (res: any)=>{
        const url = res;
        Browser.addListener('browserFinished',()=>{
          this.syncAds();
        });
        this.isLoading=false
        Browser.open({url: url});

      },
      (err)=>{
        this.isLoading=false; 
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    )
  }

  async editFile(adId, index, fileType){
    console.log(fileType, index, adId);
    if(fileType == 'photo'){
      this.camera.getPicture(this.photoOptions).then(fileUri=>{
        if (this.platform.is('ios')) {
        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
        }
        console.log(fileUri)
        this.uploadImage(fileUri, 'photo', adId, this.ads[index].photo.fileName);
      })
      .catch(err=>{this.presentToast(err)})
    }
    else if(fileType == 'video'){
      const loading = await this.loadingController.create({
        message: this.trans.instant('ADS.NEW_AD.loading'),
      });
      await loading.present();
      this.camera.getPicture(this.videoOptions).then(fileUri=>{
        if (this.platform.is('ios')) {

        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
        }
        this.videoEditor.getVideoInfo({fileUri: fileUri}).then(info=>{
          if(info.duration > this.ads[index].duration){
            loading.dismiss();
            this.presentToast(this.trans.instant('ADS.NEW_AD.videoIsLong') + this.ads[index].duration + this.trans.instant('ADS.NEW_AD.seconds'))
          }
          else if(info.duration <= this.ads[index].duration){
            loading.dismiss();
            this.uploadImage(fileUri, 'video', adId, this.ads[index].video.fileName);
          }
        }).catch(err => {loading.dismiss(); this.presentToast(err)});
        
      }).catch(err => {loading.dismiss(); this.presentToast(err)});

    }

  }

  fileTransObj: FileTransferObject;
  async uploadImage(path, type:string, adId, oldFileName){
    const loading = await this.loadingController.create({message:this.trans.instant('ADS.NEW_AD.uploading')});
    await loading.present();
    this.filePath.resolveNativePath(path).then(nativePath=>{
      console.log(adId)
      this.fileTransObj = this.fileTrans.create();
      //const fPath = path.split('?')[0];
      const name = path.substring(path.lastIndexOf("/") + 1);

      let imageOptions: FileUploadOptions = {
        fileKey: 'file',
        fileName: name,
        chunkedMode: false,
        headers:{'Authorization': `Bearer ${this.token}`},
        mimeType: 'image/jpeg',
        params: {
          'adId': adId,
          'oldFileName': oldFileName,
          'fileType': 'photo'
        }
      }
      let videoOptions: FileUploadOptions = {
        fileKey: 'file',
        fileName: name,
        chunkedMode: false,
        headers:{'Authorization': `Bearer ${this.token}`},
        mimeType: 'video/mp4',
        params: {
          'adId': adId,
          'oldFileName': oldFileName,
          'fileType': 'video'
        }
      }

      let myOptions: FileUploadOptions;

      if(type == "video"){myOptions = videoOptions}
      else if(type == "photo"){ myOptions = imageOptions}
      console.log(myOptions)
      this.fileTransObj.upload(nativePath, `${environment.url}/change-ad-file`, myOptions)
      .then(
        async (res:any)=>{
          this.syncAds();
          await loading.dismiss();
  
        },
        (err)=>{loading.dismiss(); console.log(err);this.presentToast(err.message)}
      ).catch(err => {loading.dismiss(); this.presentToast(err)});

    }).catch(err => {loading.dismiss(); this.presentToast(err)});
  }

  onAdClick(adId, payment, index){
    let fileType = '';
    if(this.ads[index].photo.publicPath){fileType = 'photo'}
    if(this.ads[index].video.publicPath){fileType = 'video'}

    if(payment.status == 'incomplete'){
      const buttons = [
        {
          text: this.trans.instant('ADS.preview'),
          icon: 'eye',
          handler: () => {
            this.previewAd(adId)
          }
        },
        {
          text: this.trans.instant('ADS.completePayment'),
          icon: 'wallet',
          handler: () => {
            this.completePayment(adId)
          }
        }, 
        {
          text: this.trans.instant('ADS.changeFile'),
          icon: 'create',
          handler: () => {
            this.editFile(adId, index, fileType)
          }
        }, 
        {
          text: this.trans.instant('ADS.delete'),
          icon: 'trash',
          handler: () => {
            this.delete(adId)
          }
        }, 
         
    ];

    this.completePaymentAction(buttons);

    }
    else{
      const buttons = [
        {
          text: this.trans.instant('ADS.preview'),
          icon: 'eye',
          handler: () => {
            this.previewAd(adId)
          }
        }, 
        {
          text: this.trans.instant('ADS.changeFile'),
          icon: 'create',
          handler: () => {
            this.editFile(adId, index, fileType)
          }
        }, 
        {
          text: this.trans.instant('ADS.delete'),
          icon: 'trash',
          handler: () => {
            this.delete(adId)
          }
        }, 
         
    ];

    this.completePaymentAction(buttons);
    }
  }

  /* 
  [
        {
          text: 'Preview',
          icon: 'eye',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Complete Payment',
          icon: 'wallet',
          handler: () => {
            console.log('Share clicked');
          }
        }, 
        {
          text: 'Edit File',
          icon: 'create',
          handler: () => {
            console.log('Share clicked');
          }
        }, 
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            console.log('Share clicked');
          }
        }, 
         
    ]
  
  */

  async completePaymentAction(buttons) {
    const actionSheet = await this.actionSheetController.create({
      buttons: buttons
    });
  
    await actionSheet.present();
  }

  async presentToast(m:string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
