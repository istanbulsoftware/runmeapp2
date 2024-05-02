import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { ActionSheetController, IonSlides, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { MapComponent } from './map/map.component';
const { Device } = Plugins;


import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { PicklocationPage } from 'src/app/picklocation/picklocation.page';
import { IconsService } from 'src/app/icons.service';
declare var google: any;

import { Preferences } from '@capacitor/preferences';
const { Browser } = Plugins;
const helper = new JwtHelperService();
const TOKEN_KEY = 'my-token';


@Component({
  selector: 'app-new-ad',
  templateUrl: './new-ad.page.html',
  styleUrls: ['./new-ad.page.scss'],
})
export class NewAdPage implements OnInit {
  @ViewChild(IonSlides) slides
  userTrueToken: number
  pReach;
  pReachLoading = false;
  place: any
  placename: string
  placeid: string
  latitude: string
  longitude: string
  quantityCount: number
  min
  video
  videoPath
  videoThumbnail
  photo
  photoPath
  form1: FormGroup
  form4: FormGroup
  token
  placeType: string
  radius: number = null
  getLanguage : string
  placeName : string = "All"
  ageList = [
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
    70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
    80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
    100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
    110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
    120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
    130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140
  ]
  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private videoEditor: VideoEditor,
    private loadingController: LoadingController,
    private filePath: FilePath,
    private fileTrans: FileTransfer,
    private router: Router,
    private http: HttpClient,
    ,
    private userSer: IconsService,

  ) {
    Device.getLanguageCode().then((langCode) => {
      console.log(langCode.value);
      this.getLanguage = langCode.value

    });
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) { this.token = token.value }
    })


    this.form1 = new FormGroup({
      adCategory: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      adDuration: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      gender: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      quantity: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      ageFrom: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      ageTo: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      iLocation: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      startDate: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      endDate: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),

    })
    this.form3 = new FormGroup({
      buttonSelect: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      buttonLink: new FormControl(null, {
        updateOn: 'change',
      }),

    })
    this.form4 = new FormGroup({
      paymentOption: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),

    })
  }
  ionViewWillEnter() {
    this.getCoins()
  }

  coins = 0;

  async getCoins() {
    const loading = await this.loadingController.create()
    await loading.present()
    this.http.get(`${environment.url}/get-my-coins`).subscribe(
      (res: any) => { this.coins = res.trueCoins; console.log(this.coins); loading.dismiss() },
      err => { this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss() }
    )
  }

  getPrice() {
    if (this.form1.value.adDuration && this.form1.value.adDuration == 5) { return 0.25 }
    else if (this.form1.value.adDuration && this.form1.value.adDuration == 15) { return 0.5 }
    else if (this.form1.value.adDuration && this.form1.value.adDuration == 30) { return 1 }
  }

  getNumOfUsers(valRadius, lat, lng) {
    console.log(this.form1.value.iLocation);
    console.log(valRadius);
    console.log(lat);
    console.log(lng);
    console.log(this.form1.value.gender);



    if (this.form1.value.ageFrom && this.form1.value.ageTo && !this.lat && (this.form1.value.gender == null || this.form1.value.gender == 'all') && this.form1.value.iLocation == 'wholeWorld') {
      this.pReachLoading = true;
      console.log('both 1')
      this.http.post(`${environment.url}/getNumOfPeopleByAge`, {
        from: this.form1.value.ageFrom,
        to: this.form1.value.ageTo
      }).subscribe(
        (res: any) => {
          console.log(res)
          this.pReach = res.people;
          this.pReachLoading = false;

        },
        (err) => { this.pReachLoading = false; this.presentToast(err.error.message) }
      )
    }

    else if (this.form1.value.ageFrom && this.form1.value.ageTo && this.form1.value.iLocation == 'wholeWorld' && (this.form1.value.gender == null || this.form1.value.gender == 'all')) {
      this.pReachLoading = true;
      console.log('both 2')
      this.http.post(`${environment.url}/getNumOfPeopleByAge`, {
        from: this.form1.value.ageFrom,
        to: this.form1.value.ageTo,
      }).subscribe(
        (res: any) => {
          console.log(res)
          this.pReach = res.people;
          this.pReachLoading = false;

        },
        (err) => { this.pReachLoading = false; this.presentToast(err.error.message) }
      )
    }

    else if (this.form1.value.ageFrom && this.form1.value.ageTo && this.lat && this.lng && this.form1.value.iLocation == 'limitedLocations' && (this.form1.value.gender == null || this.form1.value.gender == 'all')) {
      this.pReachLoading = true;
      console.log('both 3')
      console.log(this.form1.value.gender);

      this.http.post(`${environment.url}/getNumOfPeopleByAgeAndLocation`, {
        from: this.form1.value.ageFrom,
        to: this.form1.value.ageTo,
        lat: lat,
        lng: lng,
        radius: valRadius
      }).subscribe(
        (res: any) => {
          console.log(res)
          this.pReach = res.people;
          this.pReachLoading = false;

        },
        (err) => { this.pReachLoading = false; this.presentToast(err.error.message) }
      )
    }
    else if (this.form1.value.ageFrom && this.form1.value.ageTo && this.lat && this.lng && this.raduis && this.form1.value.iLocation == 'limitedLocations' && this.form1.value.gender) {
      this.pReachLoading = true;
      console.log(this.form1.value.gender + 'both 5')
      this.http.post(`${environment.url}/getNumOfPeopleByAgeandgender`, {
        from: this.form1.value.ageFrom,
        to: this.form1.value.ageTo,
        lat: lat,
        lng: lng,
        radius: valRadius,
        gender: this.form1.value.gender
      }).subscribe(
        (res: any) => {
          console.log(res)
          this.pReach = res.people;
          this.pReachLoading = false;

        },
        (err) => { this.pReachLoading = false; this.presentToast(err.error.message) }
      )
    }
    else if (this.form1.value.ageFrom && this.form1.value.ageTo && this.form1.value.iLocation == 'wholeWorld' && this.form1.value.gender) {
      this.pReachLoading = true;
      console.log(this.form1.value.gender + 'both 6')
      this.http.post(`${environment.url}/getNumOfPeopleByAgeandgenderinwhole`, {
        from: this.form1.value.ageFrom,
        to: this.form1.value.ageTo,
        gender: this.form1.value.gender
      }).subscribe(
        (res: any) => {
          console.log(res)
          this.pReach = res.people;
          this.pReachLoading = false;

        },
        (err) => { this.pReachLoading = false; this.presentToast(err.error.message) }
      )
    }



    else if (!this.form1.value.ageFrom && !this.form1.value.ageTo && this.lat && this.lng && this.raduis) {
      this.pReachLoading = true;
      console.log('both 4')
      this.http.post(`${environment.url}/getNumOfPeopleByLocation`, {
        lat: lat,
        lng: lng,
        radius: valRadius
      }).subscribe(
        (res: any) => {
          console.log(res)
          this.pReach = res.people;
          this.pReachLoading = false;

        },
        (err) => { this.pReachLoading = false; this.presentToast(err.error.message) }
      )
    }
  }

  min2
  ngOnInit() {
    //document.documentElement.dir = 'rtl'
    const now = new Date(Date.now())
    this.min = now.toISOString().split('T')[0];
    this.min2 = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
    console.log(this.min2);

  }

  //FORM 111 GETTER
  get adCategory() { return this.form1.get('adCategory') }
  get adDuration() { return this.form1.get('adDuration') }
  get gender() { return this.form1.get('gender') }
  get quantity() { return this.form1.get('quantity') }
  get ageFrom() { return this.form1.get('ageFrom') }
  get ageTo() { return this.form1.get('ageTo') }
  get iLocation() { return this.form1.get('iLocation') }
  get startDate() { return this.form1.get('startDate') }
  get endDate() { return this.form1.get('endDate') }

  //FORM 333 GETTER
  form3: FormGroup
  get buttonSelect() { return this.form3.get('buttonSelect') }
  get buttonLink() { return this.form3.get('buttonLink') }

  //FORM 4444 GETTER
  get paymentOption() { return this.form4.get('paymentOption') }

  ionViewDidEnter() {
    this.slides.lockSwipes(true)
  }
  onNextSlide1() {
    if (this.form1.invalid) { this.presentToast(this.trans.instant('ADS.NEW_AD.pleaseCompleteForm')) }
    else if (this.s2n(this.form1.value.ageFrom) > this.s2n(this.form1.value.ageTo)) { this.presentToast(this.trans.instant('ADS.NEW_AD.pleaseSelectAge')) }
    else if (this.form1.value.iLocation == 'limitedLocations') {
      if (!this.lat || !this.lng || !this.raduis) { this.presentToast(this.trans.instant('ADS.NEW_AD.pleaseSelectLocation')) }
      else { this.onNextSlide() }
    }
    else { this.onNextSlide() }

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

  async onPhoto() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: this.trans.instant('ADS.NEW_AD.choosePhoto'),
        icon: 'image',
        handler: () => {
          this.camera.getPicture(this.photoOptions).then(fileUri => {
            if (this.platform.is('ios')) {
              return fileUri
            } else if (this.platform.is('android')) {
              fileUri = 'file://' + fileUri;
              return fileUri
            }
          })
            .then((path) => {
              this.photoPath = path
              this.filePath.resolveNativePath(path).then(native => {
                console.log(native);
                this.photo = Capacitor.convertFileSrc(native);
                console.log(this.photo);

                this.video = null;
                this.onNextSlide()


              }).catch(err => this.presentToast(err));

            }).catch(err => { this.presentToast(err) })
        }
      }]
    });

    await actionSheet.present();
  }
  async onVideo() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: this.trans.instant('ADS.NEW_AD.chooseVideo'),
        icon: 'film',
        handler: async () => {
          const loading = await this.loadingController.create({
            message: this.trans.instant('ADS.NEW_AD.loading'),
          });
          await loading.present();
          this.camera.getPicture(this.videoOptions).then(fileUri => {
            if (this.platform.is('ios')) {
              //return fileUri
            } else if (this.platform.is('android')) {
              fileUri = 'file://' + fileUri;
              //return fileUri
            }
            console.log(fileUri);
            this.videoPath = fileUri
            this.videoEditor.getVideoInfo({ fileUri: fileUri }).then(info => {
              if (info.duration > this.form1.value.adDuration) {
                loading.dismiss();
                this.presentToast(this.trans.instant('ADS.NEW_AD.videoIsLong') + this.form1.value.adDuration + this.trans.instant('ADS.NEW_AD.seconds'))
              }
              else if (info.duration <= this.form1.value.adDuration) {
                loading.dismiss();
                this.video = Capacitor.convertFileSrc(fileUri);
                this.photo = null
                this.onNextSlide()
              }
            }).catch(err => { loading.dismiss(); this.presentToast(err) });

          }).catch(err => { loading.dismiss(); this.presentToast(err) });
        }
      }]
    });

    await actionSheet.present();
  }


  onNextSlide2() {
    if (this.videoPath || this.photoPath) {
      if (this.videoPath) {
        this.videoEditor.getVideoInfo({ fileUri: this.videoPath }).then(info => {
          if (info.duration > this.form1.value.adDuration) {
            this.presentToast(this.trans.instant('ADS.NEW_AD.videoIsLong') + this.form1.value.adDuration + this.trans.instant('ADS.NEW_AD.seconds'))
          }
          else if (info.duration <= this.form1.value.adDuration) {
            this.video = Capacitor.convertFileSrc(this.videoPath);
            this.photo = null
            this.onNextSlide()
          }
        }).catch(err => { this.presentToast(err) });
      }
      else if (this.photoPath) { this.onNextSlide() }
    }
  }

  onNextSlide3() {
    if (this.form3.valid) { this.onNextSlide() }
  }
  onNextSlide() {
    this.slides.lockSwipes(false)
    this.slides.slideNext(500)
    this.slides.lockSwipes(true)
  }
  onPreviousSlide() {
    this.slides.lockSwipes(false)
    this.slides.slidePrev(500)
    this.slides.lockSwipes(true)
  }

  onSelectLocation() {
    this.presentModal()
  }

  s2n(s: string) {
    return Number(s)
  }


  lat: number = null
  lng: number = null
  raduis: number = null
  async presentModal() {
    const modal = await this.modalController.create({
      component: MapComponent,
      componentProps: { value: 456 }
    });

    await modal.present();

    const data = await modal.onDidDismiss();

    if (data.data.canceled) {
      console.log('canceled');

    } else {
      console.log(data.data);
      this.lat = data.data.lat;
      this.lng = data.data.lng;
      //  this.raduis = data.data.radius;
      if (this.placeType == 'country') { // ülke
        this.radius = 700000
      } else if (this.placeType == 'administrative_area_level_1') {
        this.radius = 150000
      }
      else if (this.placeType == 'locality') { // il 
        this.radius = 50000
      } else if (this.placeType == 'administrative_area_level_2' || this.placeType == 'administrative_area_level_3') { //ilçe 
        this.radius = 5000
      } else if (this.placeType == 'administrative_area_level_4' || this.placeType == 'sublocality_level_1' || this.placeType == 'sublocality_level_2' || this.placeType == 'sublocality_level_3' || this.placeType == 'sublocality_level_4' || this.placeType == 'sublocality_level_5' || this.placeType == 'administrative_area_level_5' || this.placeType == 'neighborhood') { // mahalle
        this.radius = 1000
      } else if (this.placeType == 'route') { // köy sokak
        this.radius = 500
      } else if (this.placeType == 'point_of_interest' || this.placeType == 'premise' || this.placeType == 'subpremise') { //bir nokta
        this.radius = 300
      } else {
        this.radius = 300
      }
    }
  }



  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 3000,
      position: 'middle',
    });
    toast.present();
  }

  calculateDays() {
    const endDate = new Date(this.form1.value.endDate.split("T")[0]);
    const startDate = new Date(this.form1.value.startDate.split("T")[0]);
    const numOfDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    return numOfDays
  }

  fileTransObj: FileTransferObject;
  async uploadImage(path, type: string) {
    const loading = await this.loadingController.create({ message: this.trans.instant('ADS.NEW_AD.uploading') });
    await loading.present();
    this.filePath.resolveNativePath(path).then(nativePath => {
      this.fileTransObj = this.fileTrans.create();
      //const fPath = path.split('?')[0];
      const name = path.substring(path.lastIndexOf("/") + 1);

      let imageOptions: FileUploadOptions = {
        fileKey: 'file',
        fileName: name,
        chunkedMode: false,
        headers: { 'Authorization': `Bearer ${this.token}` },
        mimeType: 'image/jpeg',
        params: {
          'accountTarget': this.form1.value.adCategory,
          'ageFrom': this.form1.value.ageFrom,
          'ageTo': this.form1.value.ageTo,
          'locationTarget': this.form1.value.iLocation,
          'lat': this.lat,
          'lng': this.lng,
          'duration': this.form1.value.adDuration,
          'gender': this.form1.value.gender,
          'quantity': this.form1.value.quantity,
          'radius': this.raduis,
          'placename' : this.placeName,
          'language' : this.getLanguage,

          'startDate': this.form1.value.startDate,
          'endDate': this.form1.value.endDate,
          'action': this.form3.value.buttonSelect,
          'link': this.form3.value.buttonLink,
          'fileType': 'photo'
        }
      }
      let videoOptions: FileUploadOptions = {
        fileKey: 'file',
        fileName: name,
        chunkedMode: false,
        headers: { 'Authorization': `Bearer ${this.token}` },
        mimeType: 'video/mp4',
        params: {
          'accountTarget': this.form1.value.adCategory,
          'ageFrom': this.form1.value.ageFrom,
          'ageTo': this.form1.value.ageTo,
          'locationTarget': this.form1.value.iLocation,
          'lat': this.lat,
          'lng': this.lng,
          'duration': this.form1.value.adDuration,
          'gender': this.form1.value.gender,
          'quantity': this.form1.value.quantity,
          'placename' : this.placeName,
          'language' : this.getLanguage,

          'radius': this.raduis,
          'startDate': this.form1.value.startDate,
          'endDate': this.form1.value.endDate,
          'action': this.form3.value.buttonSelect,
          'link': this.form3.value.buttonLink,
          'fileType': 'video'
        }
      }

      let myOptions: FileUploadOptions;

      if (type == "video") { myOptions = videoOptions }
      else if (type == "photo") { myOptions = imageOptions }

      this.fileTransObj.upload(nativePath, `${environment.url}/create-new-ad`, myOptions)
        .then(
          async (res: any) => {
            await loading.dismiss();
            console.log(res.response);
            if (this.coins < 2) {
              this.router.navigateByUrl('/walletcoin')
            } else {
              this.router.navigateByUrl('/ads')
              // Browser.addListener('browserFinished', () => {

              //   this.router.navigateByUrl('/ads')
              // });
              // const url: string = JSON.parse(res.response)
              // await Browser.open({ url: url })
            }

          },
          (err) => { loading.dismiss(); alert(JSON.stringify(err)) }
        )

    }).catch(err => this.presentToast(err));
  }
  async pickPlace() {
    const modal = await this.modalController.create({
      component: PicklocationPage,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss()
      .then((data) => {
        this.place = data // Here's your selected user!
        this.placeName = this.place.data.structured_formatting.main_text
        this.placeid = this.place.data.place_id
        this.placeType = this.place.data.types[0]
        console.log(this.placeType);


        if (this.placeType == 'country') { // ülke
          this.radius = 700000
        } else if (this.placeType == 'administrative_area_level_1') {
          this.radius = 150000
        }
        else if (this.placeType == 'locality') { // il 
          this.radius = 50000
        } else if (this.placeType == 'administrative_area_level_2' || this.placeType == 'administrative_area_level_3') { //ilçe 
          this.radius = 5000
        } else if (this.placeType == 'administrative_area_level_4' || this.placeType == 'sublocality_level_1' || this.placeType == 'sublocality_level_2' || this.placeType == 'sublocality_level_3' || this.placeType == 'sublocality_level_4' || this.placeType == 'sublocality_level_5' || this.placeType == 'administrative_area_level_5' || this.placeType == 'neighborhood') { // mahalle
          this.radius = 1000
        } else if (this.placeType == 'route') { // köy sokak
          this.radius = 500
        } else if (this.placeType == 'point_of_interest' || this.placeType == 'premise' || this.placeType == 'subpremise') { //bir nokta
          this.radius = 300
        } else {
          this.radius = 300
        }
        this.geoCode(this.placeid, this.lat, this.lng, this.radius)
      });

    return await modal.present();
  }
  geoCode(placeid: any, lat, lng, getRadius) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: placeid }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      this.lat = results[0].geometry.location.lat();
      this.lng = results[0].geometry.location.lng();
      this.raduis = getRadius
      this.getNumOfUsers(this.radius, lat, lng)

    });
  }
  onFinish() {
    if (this.photoPath) { this.uploadImage(this.photoPath, 'photo') }
    else if (this.videoPath) { this.uploadImage(this.videoPath, 'video') }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.trans.instant('ADS.NEW_AD.loading'),
    });
    await loading.present();
  }
  ionchanges(a) {
    var b = a.target.value
    this.quantityCount = Number(2 * b)
    console.log(a.target.value);
  }
}
