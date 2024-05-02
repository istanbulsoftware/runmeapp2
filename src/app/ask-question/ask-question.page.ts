import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { ActionSheetController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.page.html',
  styleUrls: ['./ask-question.page.scss'],
})
export class AskQuestionPage implements OnInit {
  images = []
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
  myQuestions: any
  beforeupload : boolean
  questionPhoto : string
  questionText : string
  pathUrl : string
  constructor(
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private fileTrans: FileTransfer,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private toastController: ToastController,
    private filePath: FilePath,
    private http: HttpClient,
    private router : Router
  ) {
    this.beforeupload = true
    this.loadToken();
    this.listMyQuestions();
  }

  ngOnInit() {
  }

  token
  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) { this.token = token.value; }
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
        this.beforeupload = false
        this.questionPhoto = path

        return path;
      }).catch(err => { this.presentToast(err) })
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
        this.beforeupload = false
        this.questionPhoto = path
        
        
       
        return path;
      }).catch(err => { this.router.navigateByUrl("/list") })
  }

  onAdd() { this.presentActionSheet() }
  onDelete(id: string) {
    this.http.post(`${environment.url}/photos/delete`, { id: id }).subscribe(
      (res: any) => {
        this.syncPhotos()
        this.presentToast('Photo Deleted Successfully');
        this.isLoading = false
      },
      err => {
        this.isLoading = false
        this.presentToast(err.message);
      },
    )
  }

getText(){
  
  this.uploadImage(this.questionPhoto, this.questionText)
}

  
  fileTransObj: FileTransferObject;
  async uploadImage(path, text) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.filePath.resolveNativePath(path).then(nativePath => {
      this.fileTransObj = this.fileTrans.create();
      const fPath = path.split('?')[0];
      const name = fPath.substring(fPath.lastIndexOf("/") + 1);

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: name,
        chunkedMode: false,
        headers: { 'Authorization': `Bearer ${this.token}` },
        mimeType: 'image/jpeg',
        params: {
          text : text
        }
      }

      this.fileTransObj.upload(nativePath, `${environment.url}/create-question`, options)
        .then(
          async (res) => {
            var a = Date.now()
            var b = a + ""
            Preferences.set({ key: 'getShare', value: b })
            this.presentToast('Sorunuz eklendi')
            this.router.navigateByUrl("/tabs/list")
            await loading.dismiss()

          },
          async (err) => {
            await loading.dismiss().then(() => { this.presentToast(err.message) })
          }
        )

    }).catch(err => this.presentToast(err.message));
  }

  isLoading = true
  syncPhotos() {
    this.http.get(`${environment.url}/photos`).subscribe(
      (res: any) => {
        console.log(res);

        this.images = res;
        this.isLoading = false
      },
      err => {
        this.presentToast(err.message);
      },

    )
  }


  addQuestion() {
    var text = "aaaa"
    this.http.post(`${environment.url}/create-question`, { text: text }).subscribe(
      (res: any) => {
        console.log(res);
        
        this.listMyQuestions()

      },
      err => {
        this.isLoading = false
        this.presentToast("2" + err.message);
      },
    )
  }


  listMyQuestions() {
    this.http.get(`${environment.url}/my-questions`).subscribe(
      (res: any) => {
        console.log(res);
        this.myQuestions = res
      },
      err => {
        this.presentToast("1" + err.message);
      },
    )
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Yeni fotoğraf çek',
        icon: 'camera',
        handler: () => {
          this.onCameraSelect();
        }
      }, {
        text: 'Albümden yükle',
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
