import { Component, OnInit } from '@angular/core';

import { ActionSheetController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import * as moment from 'moment';
moment.locale('tr');

import { Preferences } from '@capacitor/preferences';
import { ActivatedRoute } from '@angular/router';
import { IconsService } from '../icons.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../language.service';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.page.html',
  styleUrls: ['./uploads.page.scss'],
})
export class UploadsPage implements OnInit {
  token
  eventData: any

  options: CameraOptions = {
    allowEdit: false,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    mediaType: this.camera.MediaType.PICTURE,
    destinationType: this.camera.DestinationType.FILE_URI
  };
  cameraOptions: CameraOptions = {
    allowEdit: false,
    sourceType: this.camera.PictureSourceType.CAMERA,
    mediaType: this.camera.MediaType.PICTURE,
    destinationType: this.camera.DestinationType.FILE_URI
  };
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    loop: false,
    centeredSlides: false
  };
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 2.5,
    loop: false,
    centeredSlides: false
  };
  images  : any
  listId : string
  details : any
  detailInputs : any
  favIcon : string
  isFav : boolean
  myId : string
  user: any = { name: '', profilePicture: { publicPath: null } }
showDetails : boolean
showdesc : boolean
selectedLang : string
  constructor(
    private trans: TranslateService,

    private camera: Camera,
    private fileTrans: FileTransfer,
    private filePath: FilePath,
    private actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private toastController: ToastController,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private activatedRoute : ActivatedRoute,
    private userSer: IconsService,
    private languaageservice : LanguageService


  ) { 
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        this.token = token.value
      }
    })
    this.showDetails = true
    this.listId = this.activatedRoute.snapshot.params['id']
    this.eventData = {title : '', image : this.listId}

    this.listDetail(this.listId)
    this.checkFav(this.listId)
  }
show(a){
  console.log(a);
  if(a=== 'details') {
    this.showDetails = true
    this.showdesc = false
  }else {
    this.showDetails = false
    this.showdesc = true
  }
  
}
  ngOnInit() {
    this.selectedLang = this.languaageservice.getLanguage()

    this.userSer.getUser().subscribe((user: any) => {
      if (user && user.email) {

        this.user = user
        console.log(this.user);
        this.myId = this.user.id
        if (this.user.profilePicture.fileName === null) {

        } else {
        }

      }

    })
  }
  listDetail(id) {
    this.http.get(`${environment.url}/list-details/${id}`).subscribe(
      (res: any) => {
        console.log(res.list);
        this.details = res.list[0]
        console.log(this.details);
        this.images = res.list[0].photos.reverse()

      },
      err => {
        //this.presentToast(err.message);
      },
    )
  }
  boostNow(f){
    console.log(f);
    
    this.http.post(`${environment.url}/boost-list-now`, {listId : this.listId, days : f}).subscribe(
      (res: any) => {
        console.log(res);
      },
      err => {
        //this.presentToast(err.message);
      },

    )
  }
  createFav(f){
    console.log(f);
    
    this.http.post(`${environment.url}/save-fav`, {listId : this.listId, f : f}).subscribe(
      (res: any) => {
        console.log(res);
        if(f === 'add') {
          this.isFav = true
        }else {
          this.isFav = false
        }
      },
      err => {
        //this.presentToast(err.message);
      },

    )
  }
  onTel(mobile) {
    window.open(`tel:${mobile}`, '_system');
  }
  checkFav(id){
    console.log(id);
    
    this.http.post(`${environment.url}/check-fav`, {listId : id}).subscribe(
      (res: any) => {
        console.log(res);
        if(res.message === 'var') {
          this.isFav = true
        }else {
          this.isFav = false
        }
        console.log(this.isFav);
        
      },
      err => {
        this.isFav = false

        //this.presentToast(err.message);
      },

    )
  }
  onImageSelect(): Promise<any> {
    return this.camera.getPicture(this.options)
      .then(async (fileUri) => {
        const loading = await this.loadingCtrl.create();
        await loading.present();

        if (this.platform.is('ios')) {
          await loading.dismiss()
          return fileUri;
        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
          await loading.dismiss()
          return fileUri;
        }
      })
      .then((path) => {
        this.uploadImage(path);
        //return path;
      }).catch(err => { this.presentToast(JSON.stringify(err)) })
  }


  onCameraSelect(): Promise<any> {
    return this.camera.getPicture(this.cameraOptions)
      .then(async (fileUri) => {
        const loading = await this.loadingCtrl.create();
        await loading.present();

        if (this.platform.is('ios')) {
          await loading.dismiss()
          return fileUri;
        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
          await loading.dismiss()
          return fileUri;
        }
      })
      .then((path) => {
        this.uploadImage(path);
       // return path;
      }).catch(err => { this.presentToast(err) })
  }

  onAdd() {
    //this.saveList()
    this.presentActionSheet(this.listId)
  }
  onDelete(id: string) {
    this.http.post(`${environment.url}/photos/delete`, { id: id }).subscribe(
      (res: any) => {
        this.syncPhotos(this.listId)
        this.presentToast(this.trans.instant('ALERT.success'));
      },
      err => {
        this.presentToast('Tekrar deneyiniz');
      },
    )
  }

  delListPhoto(id) {
    this.http.post(`${environment.url}/listphotos/delete`, { id: id, listId: this.listId }).subscribe(
      (res: any) => {
        this.syncPhotos(this.listId)
        this.presentToast(this.trans.instant('ALERT.success'));
      },
      err => {
      },
    )

  }

  fileTransObj: FileTransferObject;
  async uploadImage(path) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
      const fileTransfer: FileTransferObject = this.fileTrans.create();
      const name = path.name

      let options: FileUploadOptions = {
        fileKey: 'file',
        params: this.eventData,
        fileName: name,
        chunkedMode: false,
        headers: { 'Authorization': `Bearer ${this.token}` },
        mimeType: 'image/jpeg',

      }
    fileTransfer.upload(path, `${environment.url}/list/add`, options)
        .then(
          async (res) => {
            this.syncPhotos(this.listId)
            await loading.dismiss()

            this.presentToast(this.trans.instant('ALERT.success'));
          },
          async (err) => {
            await loading.dismiss()
          }
        )

  }

  syncPhotos(id) {
    this.http.get(`${environment.url}/list-photos/${id}`).subscribe(
      (res: any) => {
        console.log(res);

        this.images = res;
      },
      err => {
        this.presentToast('Resminiz yüklenmedi');
      },

    )
  }


  async delPhoto(v : string) {

    const actionSheet = await this.actionSheetController.create({
      header :"Resimi silmek istedğinize emin misiniz?",
      mode : "ios",
      buttons: [{
        text: 'Evet. Silmek istiyorum',
        icon: 'trash',
        handler: () => {
          this.delListPhoto(v);
        }
      }, {
        text: 'Hayır. İptal et',
        icon: 'close',
        handler: () => {
        //  this.onImageSelect();
        }
      }]
    });

    await actionSheet.present();
  }

  async presentActionSheet(id) {

    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Yeni fotoğraf çek',
        icon: 'camera',
        handler: () => {
          this.onCameraSelect();
        }
      }, {
        text: 'Galeriden seç',
        icon: 'image',
        handler: () => {
          this.onImageSelect();
        }
      }]
    });

    await actionSheet.present();
  }

  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
