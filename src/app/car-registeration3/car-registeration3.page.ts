import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { HttpClient } from '@angular/common/http';
import { ActionSheetController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();
@Component({
  selector: 'app-car-registeration3',
  templateUrl: './car-registeration3.page.html',
  styleUrls: ['./car-registeration3.page.scss'],
})
export class CarRegisteration3Page implements OnInit {
  token : string
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
  myId : string
  constructor(
    private camera: Camera,
    private http: HttpClient,
    private fileTrans: FileTransfer,
    private filePath: FilePath,
    private toastController : ToastController,
    private platform : Platform,
    private loadingCtrl : LoadingController,
    private actionCtrl : ActionSheetController
  ) {
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        this.token = token.value
        const de = helper.decodeToken(token.value);
        this.myId = de.id;

      }
    })
   }

  ngOnInit() {
  }
  async presentActionSheet() {
    const actionSheet = await this.actionCtrl.create({
      header: "Resim yükle",
      cssClass: 'my-custom-class',
      buttons: [{
        text: "Kameradan yükle",
        icon: 'camera',
        handler: () => {
          this.onCameraSelect()
        }
      }, {
        text: "Galeriden yükle",
        icon: 'image',
        handler: () => {
          this.onImageSelect()
        }
      }
      ]
    });
    await actionSheet.present();
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
        this.uploadImage(path);
        return path;
      }).catch(err => { this.presentToast(err) })
  }
  fileTransObj: FileTransferObject;
  async uploadImage(path) {
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
        mimeType: 'image/jpeg'
      }

      this.fileTransObj.upload(nativePath, `${environment.url}/list-add-photo`, options)
        .then(
          async (res) => {

            this.presentToast('Photo Added Successfully')
            await loading.dismiss()

          },
          async (err) => {
            await loading.dismiss().then(() => { this.presentToast(err.message) })
          }
        )

    }).catch(err => this.presentToast(err.message));
  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
