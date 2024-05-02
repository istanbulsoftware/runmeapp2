import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { ActionSheetController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';
moment.locale('tr');

import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    loop: false,
    centeredSlides: false
  };
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
  questions: any

  storedPostId: any
  showBtns: boolean = true

  showMsh: boolean = false

  constructor(
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private toastController: ToastController,
    private fileTrans: FileTransfer,
    private filePath: FilePath,
    private http: HttpClient,
    private modalCtrl: ModalController
  ) {

  }
  ionViewWillEnter() {
    console.log(this.storedPostId);
    this.loadToken();
    this.loadId()
  }
  ngOnInit() {
  }
  mesajgonder() {
    this.showMsh = true
  }
  token
  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) { this.token = token.value; }
  }

  async loadId() {
    const aa = await Preferences.get({ key: 'storedPostId' });
    console.log("senaryo 1 : daha önce izlemişmi");

    if (aa && aa.value) {
      console.log("senaryo 2 : daha önce izlemiş" + aa.value);
      this.storedPostId = aa.value

      this.checkLast(this.storedPostId);


      //  this.storedPostId = "6302ac1a155dd435a2386e83"

    } else {
      this.firstQuestion()
      console.log("senaryo 1 : daha önce izlememiş");


    }
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
        mimeType: 'image/jpeg',
        params: {
          text: "jfjj"
        }
      }

      this.fileTransObj.upload(nativePath, `${environment.url}/create-question`, options)
        .then(
          async (res) => {

            this.listLastQuestions(this.storedPostId);
            this.presentToast('Hikayeniz eklendi')
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

        this.listLastQuestions(this.storedPostId)

      },
      err => {
        this.isLoading = false
        this.presentToast("2" + err.message);
      },
    )
  }
  async firstQuestion() {
    const loading = await this.loadingCtrl.create({ message: "Yükleniyor." });
    await loading.present()


    this.http.get(`${environment.url}/get-first-question`).subscribe(
      (res: any) => {
        if (res.length > 0) {

          //Preferences.set({ key: 'storedPostId', value: res[0]._id })

          this.questions = res
          this.showBtns = true
          loading.dismiss()
          this.showMsh = false
          Preferences.set({ key: 'storedPostId', value: res[0]._id })
        } else {
          this.presentToast("Şuan yüklenecek hikaye bulunmuyor")
          loading.dismiss()
          this.showBtns = false
          this.showMsh = false

        }
      },
      err => {
        this.presentToast("1" + err.message);
      },
    )
  }


  parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
  }

  checkDateWithin(t) {
    const then = new Date();
    const now = new Date();

    const msBetweenDates = Math.abs(then.getTime() - now.getTime());

    // 👇️ convert ms to hours                  min  sec   ms
    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

    console.log(hoursBetweenDates);

    if (hoursBetweenDates < 24) {
      return true
    } else {
      return false
    }
  }


  async checkLast(id) {
    const loading = await this.loadingCtrl.create({ message: "Yükleniyor.." });
    await loading.present()
    console.log(id);

    this.http.get(`${environment.url}/last-questions/${id}`).subscribe(
      (res: any) => {
        console.log(res);
        if (res.length > 0) {

          if(this.checkDateWithin(res[0].createdAt) === true) {
            console.log("senaryo 3 : daha önce izlememiş. 24 saat içinde mi kontrol et ve  24 saat içinde izlemişse  :" + res[0].createdAt);
            loading.dismiss()

            this.listLastQuestions(id)
            
          }else if(this.checkDateWithin(res.createdAt) === false) {
            console.log("senaryo 4 : daha önce izlememiş. 24 saat içinde mi kontrol et ve  24 saat içinde izlememiş  :" + res[0].createdAt);
            loading.dismiss()

            this.firstQuestion()
            
          }

        } else {
          loading.dismiss()

          this.presentToast("Şuan yüklenecek hikaye bulunmuyor")
          this.showBtns = false
          this.showMsh = false

        }
      },
      err => {
        this.presentToast("1" + err.message);
      },
    )
  }

  async listLastQuestions(id) {
    console.log("senaryo 5 : gösterilen:" + id);
    
    const loading = await this.loadingCtrl.create({ message: "Yükleniyor..." });
    await loading.present()
    console.log(id);

    this.http.get(`${environment.url}/last-questions/${id}`).subscribe(
      (res: any) => {
        console.log(res);
        if (res.length > 0) {

          Preferences.set({ key: 'storedPostId', value: res[0]._id })
          console.log(" eklenen" +Preferences.get({ key: 'storedPostId' }));

          this.questions = res
          this.showBtns = true
          loading.dismiss()
          this.showMsh = false
          

        } else {
          this.presentToast("Şuan yüklenecek hikaye bulunmuyor")
          loading.dismiss()
          this.showBtns = false
          this.showMsh = false

        }
      },
      err => {
        this.presentToast("1" + err.message);
      },
    )
  }




  dislike(id) {
    console.log(id);

    this.http.post(`${environment.url}/question-like`, { qId: id, like: "dislike" }).subscribe(
      (res: any) => {
        this.listLastQuestions(id)
      },
      err => {
        this.presentToast("1" + err.message);
      },
    )
  }


  likeIt(id) {
    console.log(id);

    this.http.post(`${environment.url}/question-like`, { qId: id, like: "like" }).subscribe(
      (res: any) => {
        this.listLastQuestions(id)
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
        text: 'YEni fotoğraf çek',
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
  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  async openModal() {
    this.cancel()
    const modal = await this.modalCtrl.create({
      component: ListPage,
    });
    modal.present();

  }
  cancel() {
    console.log("aa");

    this.modalCtrl.dismiss(null, 'cancel');

  }
}
