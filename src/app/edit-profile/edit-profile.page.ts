import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { JwtHelperService } from "@auth0/angular-jwt";


import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { cities } from  '../../environments/cities'
import { IconsService } from '../icons.service';



const helper = new JwtHelperService();

import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';
const TOKEN_KEY = 'my-token';

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage implements OnInit {
  form: FormGroup;
  other = false
  croppedImage = null;

  token
  horoscops = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  iller = cities.iller
  user: {
    name: string,
    email: string,
    gender: string,
    accountType: string,
    businessCategory: string,
    birthday: any,
    bio: string,
    city: string,
    profilePicture: any,
    mobile: string,
    idnumber: string,
    bllodgroup : string,
    iddate : string
  } =
    {
      name: '',
      email: '',
      gender: '',
      accountType: '',
      businessCategory: '',
      birthday: null,
      bio: '',
      city: '',
      profilePicture: null,
      mobile: '',
      idnumber: "",
      bllodgroup : "",
      iddate : ""
    }

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
  optionsvideo: CameraOptions = {
    quality: 50,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.FILE_URI,
    mediaType: this.camera.MediaType.VIDEO,
    correctOrientation: true,
    saveToPhotoAlbum: false,
    targetHeight: 512,
    targetWidth: 512,
  };

  constructor(
    private camera: Camera,

    private platform: Platform,
    private actionSheetCtl: ActionSheetController,
    public loadingCtrl: LoadingController,
    private authSer: AuthenticationService,
    private router: Router,
    private fileTrans: FileTransfer,
    private filePath: FilePath,
    private toastCtl: ToastController,
    private userSer: IconsService,
    private trans: TranslateService,
    private alertController: AlertController
  ) {

    this.loadToken();

    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),

      gender: new FormControl(null, {
        updateOn: "change",
        //validators: [Validators.required],
      }),
      bio: new FormControl(null, {
        updateOn: "change",
        //validators: [],
      }),
      city: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      mobile: new FormControl(null, {
        updateOn: "change",
        //validators: [Validators.pattern("[0-9+]{7,17}")],
      }),
      birthday: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      businessCategory1: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      idnumber: new FormControl(null, {
        updateOn: "change",
        //validators: [],
      }),
      bllodgroup: new FormControl(null, {
        updateOn: "change",
        //validators: [],
      }),
    });


  }
  get horoscop() { return this.form.get('horoscop') }
  get name() { return this.form.get('name') }
  get gender() { return this.form.get('gender') }
  get bio() { return this.form.get('bio') }
  get city() { return this.form.get('city') }
  get mobile() { return this.form.get('mobile') }
  get birthday() { return this.form.get('birthday') }
  get businessCategory1() { return this.form.get('businessCategory1') }
  get businessCategory2() { return this.form.get('businessCategory2') }

  ngOnInit() {


  }



  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.token = token.value;

      try {
        const detoken = helper.decodeToken(token.value)
        this.user.city = detoken.city
        this.form.controls.city.setValue(this.user.city);

        this.user.name = detoken.name;
        this.form.controls.name.setValue(this.user.name);


        this.user.idnumber = detoken.horoscop;
        this.form.controls.idnumber.setValue(this.user.idnumber);

        this.user.iddate = detoken.horoscop;
        this.form.controls.iddate.setValue(this.user.iddate);

        this.user.bllodgroup = detoken.horoscop;
        this.form.controls.bllodgroup.setValue(this.user.bllodgroup);



        this.user.email = detoken.email

        this.user.gender = detoken.gender
        this.form.controls.gender.setValue(this.user.gender);

        this.user.accountType = detoken.accountType

        this.user.businessCategory = detoken.businessCategory


        this.user.birthday = detoken.birthday

        this.form.controls.birthday.setValue(this.user.birthday);

        this.user.bio = detoken.bio
        this.form.controls.bio.setValue(this.user.bio);

        this.user.mobile = detoken.mobile
        this.form.controls.mobile.setValue(this.user.mobile);

        this.user.profilePicture = detoken.profilePicture
        this.croppedImage = detoken.profilePicture.publicPath;
        this.setIconName()
      } catch (err) { 
        console.log(err);
         }

    }

  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtl.create({
      header: this.trans.instant('EDIT_PROFILE.editProfImg'),
      cssClass: 'my-custom-class',
      buttons: [{
        text: this.trans.instant('EDIT_PROFILE.takePhoto'),
        icon: 'camera',
        handler: () => {
          this.onCameraSelect()
        }
      }, {
        text: this.trans.instant('EDIT_PROFILE.choose'),
        icon: 'image',
        handler: () => {
          this.onImageSelect()
        }
      },
      {
        text: this.trans.instant('EDIT_PROFILE.removeImg'),
        icon: 'trash',
        handler: () => {
          this.onRemoveImage()
        }
      },
      ]
    });
    await actionSheet.present();
  }

  ionViewDidEnter() {
    this.myF().then(result => {

      if (result) {
        this.form.controls.businessCategory1.setValue(this.user.businessCategory);
      }
      if (!result) {
        this.form.controls.businessCategory1.setValue('other');
        this.form.controls.businessCategory2.setValue(this.user.businessCategory);

      }

    })
  }

  async myF() {
    const a = document.querySelectorAll('ion-select-option')
    let b = false
    var bar = new Promise((resolve, reject) => {
      a.forEach((el, index, array) => {
        if (el.value == this.user.businessCategory) { b = true };
        if (index === array.length - 1) resolve(true);
      });
    });

    return bar.then(() => {
      return b
    });

  }

  onEditPhoto() {
    this.presentActionSheet()
  }

  async changeProfile() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
      this.authSer.editProfile({
        name: this.form.value.name,
        bio: this.form.value.bio,
        city: this.form.value.city,
        mobile: this.form.value.mobile,
        birthday: this.form.value.birthday,
        idnumber: this.form.value.idnumber,
        businessCategory: null,
        gender: this.form.value.gender,
        bllodgroup : this.form.value.bllodgroup,

      }).subscribe(async () => {
        this.userSer.syncToken();
        await loading.dismiss().then(() => { 
          this.presentToast("Profiliniz güncellendi")
         })
      },

        async (err) => {
          console.log(err);
          
          await loading.dismiss().then(() => { this.presentToast("Hata oluştu lütfen tekrar deneyin"); })
        }
      )
    

    // if (this.user.accountType == 'business') {

    //   if (this.form.value.businessCategory1 == 'other') {
    //     this.authSer.editProfile({
    //       name: this.form.value.name,
    //       bio: this.form.value.bio,
    //       city: this.form.value.city,
    //       mobile: this.form.value.mobile,
    //       birthday: this.form.value.birthday,
    //       businessCategory: null,
    //       gender: this.form.value.gender,
    //       idnumber: this.form.value.idnumber,
    //       bllodgroup : this.form.value.bllodgroup,


    //     }).subscribe(async () => {
    //       this.userSer.syncToken();
    //       await loading.dismiss().then(() => { this.router.navigateByUrl('/edit-account') })
    //     },

    //       async (err) => {
    //         await loading.dismiss().then(() => { this.presentToast("Hata oluştu lütfen tekrar deneyin"); })
    //       }
    //     )
    //   }

    //   if (this.form.value.businessCategory1 != 'other') {
    //     this.authSer.editProfile({
    //       name: this.form.value.name,
    //       bio: this.form.value.bio,
    //       city: this.form.value.city,
    //       mobile: this.form.value.mobile,
    //       birthday: this.form.value.birthday,
    //       businessCategory: null,
    //       gender: this.form.value.gender,
    //       idnumber: this.form.value.idnumber,
    //       bllodgroup : this.form.value.bllodgroup

    //     }).subscribe(async () => {
    //       this.userSer.syncToken();
    //       await loading.dismiss().then(() => { this.router.navigateByUrl('/edit-account') })
    //     },

    //       async (err) => {
    //         await loading.dismiss().then(() => { this.presentToast("Hata oluştu lütfen tekrar deneyin"); })
    //       }
    //     )
    //   }

    // }
  }

  onImageSelect(): Promise<any> {
    const optionsgaleri: CameraOptions = {
      quality: 90,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI
    };
    return this.camera.getPicture(optionsgaleri)
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
      }).catch(err => {
        this.presentToast('Resim Seçmediniz')
      })
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
  // image upload
  fileTransObj: FileTransferObject;
  async uploadImage(path) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.filePath.resolveNativePath(path).then(nativePath => {
      //if(this.platform.is('ios')){nativePath=path}
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

      this.fileTransObj.upload(nativePath, `${environment.url}/edit-profile-photo`, options)
        .then(
          (res) => {
            Preferences.set({ key: TOKEN_KEY, value: JSON.parse(res.response).token })
              .then(async () => {
                this.userSer.syncToken();
                this.croppedImage = Capacitor.convertFileSrc(path.split('?')[0]);
                await loading.dismiss().then(() => { this.router.navigateByUrl('/edit-account'); this.presentToast("Başarılı bir şekilde yapıldı..."); })
              })
          },
          async (err) => {
            await loading.dismiss().then(() => {
              this.presentAlert("2" + JSON.stringify(err))

            })
          }
        )

    }).catch(err => {
      this.presentAlert("" + JSON.stringify(err))
    });
  }

  async onRemoveImage() {
    const loading = await this.loadingCtrl.create()
    await loading.present()

    this.authSer.removeProfileImage().subscribe(
      async () => {
        this.userSer.syncToken();
        await loading.dismiss().then(() => {
          this.router.navigateByUrl('/edit-account')
          this.presentToast("Başarılı bir şekilde yapıldı...");
        })
      },
      async (err) => {
        await loading.dismiss().then(() => { this.presentToast("Hata oluştu lütfen tekrar deneyin"); })
      }
    )

  }

  //toast
  async presentToast(m: string) {
    const toast = await this.toastCtl.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }

  icon: string = 'other'
  async setIconName() {
    const loading = await this.loadingCtrl.create()
    await loading.present()
    if (this.user.accountType == 'personal') { this.icon = 'person'; loading.dismiss() }
    if (this.user.accountType == 'business') {
      if (
        (this.user.businessCategory == 'restaurant') ||
        (this.user.businessCategory == 'fastFood') ||
        (this.user.businessCategory == 'cafe') ||
        (this.user.businessCategory == 'taxi') ||
        (this.user.businessCategory == 'bakery') ||
        (this.user.businessCategory == 'pastry') ||
        (this.user.businessCategory == 'hotel') ||
        (this.user.businessCategory == 'bar') ||
        (this.user.businessCategory == 'barber') ||
        this.user.businessCategory == 'carService' ||
        this.user.businessCategory == 'carStore' ||
        this.user.businessCategory == 'carRepair' ||
        this.user.businessCategory == 'gym' ||
        this.user.businessCategory == 'store' ||
        this.user.businessCategory == 'pharmacy'

      ) { this.icon = this.user.businessCategory; loading.dismiss() }
      else { this.icon = 'other'; this.other = true; loading.dismiss() }

    }
  }

  async presentAlert(m) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: m,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
