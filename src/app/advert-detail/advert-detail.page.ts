import { Component, OnInit } from '@angular/core';

import { ActionSheetController, AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import * as moment from 'moment';
import createHTMLMapMarker from '../HTMLMapMarker';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

moment.locale('tr');
declare var google: any;
import { Geolocation } from '@capacitor/geolocation';

import { Preferences } from '@capacitor/preferences';
import { ActivatedRoute, Router } from '@angular/router';
import { IconsService } from '../icons.service';
import { Location } from '@angular/common';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-advert-detail',
  templateUrl: './advert-detail.page.html',
  styleUrls: ['./advert-detail.page.scss'],
})
export class AdvertDetailPage implements OnInit {
  list: any[] = new Array(5);
  markers2: any = {}
  service = new google.maps.places.AutocompleteService();
  latitude: number = 0;
  longitude: number = 0;
  geo: any
  getloc: string
  getltd: number
  getlng: number
  token
  eventData: any
  convId
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
    slidesPerView: 1.5,
    loop: false,
    centeredSlides: false
  };
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 2.5,
    loop: false,
    centeredSlides: false
  };
  images: any
  listId: string
  details: any
  detailInputs: any
  favIcon: string
  isFav: boolean
  isListReq: boolean
  myId: string
  otherId: string
  user: any = { name: '', profilePicture: { publicPath: null } }
  showDetails: boolean
  showdesc: boolean
  userInfoname: string
  userInfopicture: string
  condition: number = 0;
  inner: Number
  myLat: Number
  myLong: Number
  reqs: any
  isShare: any
  isRequested: any
  distance: any
  duratinTime: any
  myCoins: number
  messReq: boolean
  dailyReqCount : number
  isRate : boolean
  constructor(
    private camera: Camera,
    private fileTrans: FileTransfer,
    private filePath: FilePath,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private toastController: ToastController,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    private userSer: IconsService,
    private router: Router,
    private location: Location,
    private socialSharing: SocialSharing,

  ) {
    this.isShare = false
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        this.token = token.value
      }
    })
    this.showDetails = true
    this.listId = this.activatedRoute.snapshot.params['id']
    this.listDetail(this.listId)
    this.checkFav(this.listId)
    this.checkListFav(this.listId)
    this.listReq(this.listId)
  }
  openRate (){
    if(this.messReq === true){
      this.isRate = true
      setTimeout(() => {
        this.isRate = false
      }, 5000);
    }else {
      this.presentToast('Oy vermek için ortak etkinliğiniz olmalı')
    }

  }
  closeRate (){
    this.isRate = false
  }
  ionViewWillEnter() {
    this.getCoins()
    this.dailyReq()
  }
  show(a) {
    console.log(a);
    if (a === 'details') {
      this.showDetails = true
      this.showdesc = false
    } else {
      this.showDetails = false
      this.showdesc = true
    }

  }
  ngOnInit() {
  
    this.userSer.getUser().subscribe((user: any) => {
      console.log(user);

      if (user && user.email) {

        this.user = user
        console.log(this.user);
        this.myId = this.user.id
        this.myPosition()

      }
    })
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Onaylanmış br katılım isteğiniz olmadığı için mesajlaşma için  5 coin düşecektir.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('aaa');

          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log('aaa');
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }



  watchPosition

  calcdistances(addressLat, addressLong) {
    this.watchPosition = Geolocation.watchPosition({ enableHighAccuracy: true }, (data: any, err) => {
      if (err) { }
      if (data && data.coords) {
        console.log(data);
        //const latLng = { lat: data.coords.latitude, lng: data.coords.longitude }
        let secondLat = addressLat
        let secondLong = addressLong
        var origin = new google.maps.LatLng(data.coords.latitude, data.coords.longitude); // using google.maps.LatLng class
        var destination = secondLat + ',' + secondLong // using string
        console.log(origin);

        var directionsService = new google.maps.DirectionsService();
        var request = {
          origin: origin, // LatLng|string
          destination: destination, // LatLng|string
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request).then((response) => {
          console.log(response);
          this.distance = response.routes[0].legs[0].distance.value
          this.duratinTime = response.routes[0].legs[0].duration.text
        })
      }
    });
  }


  ionViewDidLeave() {
    if (this.watchPosition) {
      Geolocation.clearWatch({ id: this.watchPosition })
    }
  }



  map2: any
  markers = []
  watch
  myPosition() {
    this.showMap(this.getltd, this.getlng).then(() => {
      this.watch = Geolocation.watchPosition({ enableHighAccuracy: true }, (data: any, err) => {
        if (err) { }
        if (data && data.coords) {
          console.log(data);

          const latLng = { lat: data.coords.latitude, lng: data.coords.longitude }
          // this.placeMarkerAndPanTo(latLng, this.map2);
          this.myLat = data.coords.latitude
          this.myLong = data.coords.longitude
        }
      });

    })
  }


  async shareVia(shareData, sharingText, sharingImage, sharingUrl) {

    this.socialSharing[`${shareData}`](sharingText, sharingImage, sharingUrl)
      .then((res) => {
        console.log(res);

      })
      .catch((e) => {
        console.log('error', e)
        console.log(e);
      });

  }

  ShareWhatsapp(text) {
    this.socialSharing.shareViaWhatsApp(text, '', '')
  }

  ShareFacebook(text) {
    this.socialSharing.shareViaFacebookWithPasteMessageHint(text, null, null /* url */, 'Dodo!')
  }

  SendEmail() {
    this.socialSharing.shareViaEmail('text', 'subject', ['email@address.com'])
  }

  SendTwitter(text,) {
    this.socialSharing.shareViaTwitter(text, null, null)
  }

  showShare() {
    if (this.isShare === true) {
      this.isShare = false
    } else {
      this.isShare = true

    }
  }


  placeMarkerAndPanTo(latitude, longitude, map) {
    const latLng = { lat: latitude, lng: longitude }
    const marker = new google.maps.Marker({
      position: latLng,
      zoom: 1.5,
      map: map,
      draggable: false,
      animation: google.maps.Animation.BOUNCE,
    });
    map.panTo(latLng);
    //this.markers.push(marker);
  }
  goBack() {
    this.router.navigateByUrl("/tabs/advert-real")
  }

  review(userrate, ratecount, i, id) {
    this.isRate = false
    this.condition = i + 1;
    i = i + 1;
    let totalrate = +userrate + +i
    console.log(id, i, totalrate)
    var writebyid = 0
    this.http.post(`${environment.url}/user-rating`, {
      rating: totalrate,
      userId: id,
      ratecount: +ratecount + +1,
      rates: Number(userrate + +i) / Number(+ratecount + +1)
    }).subscribe(

      (res: any) => {
        console.log(res)
      },
      (err) => {
        this.isRate = false
        this.presentToast('İkinci kez değerlendirme yapılamaz')
      }
    );

  }
  showMap(latval, lngval) {
    return new Promise((resolve, reject) => {
      this.map2 = new google.maps.Map(document.querySelector('#myMap2'), {
        center: new google.maps.LatLng(latval, lngval),
        zoom: 12.5,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
        traffic_model: 'best_guess',
        transit_mode: 'bus',
        styles: [
          {
            featureType: "transit",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.attraction",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.government",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.medical",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.park",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.place_of_worship",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.school",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.sports_complex",
            stylers: [{ visibility: "on" }]
          },

        ],

      });
      resolve(true)
    })
  }
  isAccepted: boolean
  listDetail(id) {
    this.http.get(`${environment.url}/list-details/${id}`).subscribe(
      (res: any) => {
        console.log(res.list);
        this.details = res.list[0]
        this.otherId = res.list[0].userId._id
        this.userInfoname = res.list[0].userId.profilePicture.fileName
        this.userInfoname = res.list[0].userId.name
        var loc = []
        this.checkMesReq(this.otherId)
        this.condition = this.inner = Number(res.list[0].userId.rating / (+res.list[0].userId.ratecount))
        // this.placeMarkerAndPanTo(res.list[0].listlat,res.list[0].listlong, this.map2)
        this.showMap(res.list[0].listlat, res.list[0].listlong)
        this.calcdistances(res.list[0].listlat, res.list[0].listlong)
        this.http.get(`${environment.url}/list-list-req/${id}`).subscribe(
          (resss: any) => {
            console.log(resss.list);
            this.reqs = resss.list
            this.isRequested = this.reqs.filter(x => x.sender._id === this.myId);
            console.log(this.isRequested.length);
            if (this.isRequested.length > 0) {
              this.createSpecialMarker(res.list[0]._id, res.list[0].userId.profilePicture.publicPath, res.list[0].listlat, res.list[0].listlong, '#3d6cb9', 'person')
            } else {
              this.createSpecialMarkerno(res.list[0]._id, res.list[0].userId.profilePicture.publicPath, this.myLat, this.myLong, '#3d6cb9', 'person')
            }

            // Get result and access the foo property

          },
          err => {
            //
          },

        )


        console.log(this.details);
        this.images = res.list[0].photos

      },
      err => {
        //
      },

    )
  }

  listReq(id) {
    this.http.get(`${environment.url}/list-list-req/${id}`).subscribe(
      (res: any) => {
        console.log(res.list);
        this.reqs = res.list
        this.isRequested = this.reqs.filter(x => x.sender._id === this.myId);
        console.log(this.isRequested.length);

        // Get result and access the foo property

      },
      err => {
        //
      },

    )
  }



  createSpecialMarker(id: string, profilePicture: any, lat: any, lng: any, color: string, iconNem: string) {
    const html = `
    
    <div style=" height : 50px; width : 50px">
    <ion-avatar id="${id}" class="${iconNem}"  style = " background: var(--ion-color-dark-contrast);position: relative;width: 70%;height: 70%;border: 3px solid ${color};border-radius: 50%;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
    <ion-icon  name="location" style="width: 100%;height: 100%;color:  ${color};"></ion-icon>
    </ion-avatar>
    <div style = " background: var(--ion-color-warning); padding:6px; border-radius:6px; text-align : center; color: #fff; margin:6px; width:100px ">Etkinlik konumu</div>
    </div>
      `




    const marker = createHTMLMapMarker({
      latlng: new google.maps.LatLng(lat, lng),
      map: this.map2,
      id: id,
      html: html
    });
    //this.markers[index] = marker;
    this.markers2[id] = marker;
    // marker.addListener("click", () => {
    //     if (this.isListReq === false) {
    //     this.createlistReq('add')
    //  } else {
    //     this.createlistReq('remove')
    //  }
    // this.router.navigateByUrl(`/profile/${id}`)
    //  });

  }

  createSpecialMarkerno(id: string, profilePicture: any, lat: any, lng: any, color: string, iconNem: string) {
    const html = `


  <div style = " background: var(--ion-color-warning); padding:6px; border-radius:6px; text-align : center; color: #fff; margin:6px; width:100px " >Koşu Konumu</div>
  `




    const marker = createHTMLMapMarker({
      latlng: new google.maps.LatLng(lat, lng),
      map: this.map2,
      id: id,
      html: html
    });
    //this.markers[index] = marker;
    this.markers2[id] = marker;
    marker.addListener("click", () => {
      if (this.isListReq === false) {
        this.createlistReq('add')
      } else {
        this.createlistReq('remove')

      }
      // this.router.navigateByUrl(`/profile/${id}`)
    });

  }


  boostNow(f) {
    console.log(f);

    this.http.post(`${environment.url}/boost-list-now`, { listId: this.listId, days: f }).subscribe(
      (res: any) => {
        console.log(res);
      },
      err => {
        //
      },

    )
  }

  createMessagereq(){
    this.http.post(`${environment.url}/save-mes-req`, {  otherId: this.otherId }).subscribe(
      (res: any) => {
        console.log(res);
          this.decCoins(10)
      },
      err => {
        //
      },
    )
  }
  checkMesReq(id) {

    this.http.post(`${environment.url}/check-message-req`, { otherId: id }).subscribe(
      (res: any) => {
        console.log(res);
        if (res.message === 'var') {
          this.messReq = true
        } else {
          this.messReq = false

        }
        console.log(this.isListReq);

      },
      err => {
        this.isListReq = false

        //
      },

    )
  }

  checkListFav(id) {
    console.log(id);

    this.http.post(`${environment.url}/check-list-req`, { listId: id }).subscribe(
      (res: any) => {
        console.log(res);
        if (res.message === 'var') {
          this.isListReq = true
        } else {
          this.isListReq = false
        }
        console.log(this.isListReq);

      },
      err => {
        this.isListReq = false

        //
      },

    )
  }

  sendNotificationInd(u,m) {
    
    var postData = {
      "id": u,
      "mesaj" : m
    }

    this.http.post(`${environment.url}/send-single-notifications`, postData).subscribe(
      (resTAlep: any) => {
        console.log(resTAlep);
      }
    )
  }


  createlistReq(f) {
    console.log(f);
    if(f === 'remove'){

        this.http.post(`${environment.url}/save-list-req`, {  listId: this.listId, otherId: this.otherId}).subscribe(
          (res: any) => {
            console.log(res);
            if (f === 'add') {
              this.isListReq = true
              this.presentToast('İsteğiniz onaylandığında konumu görebilirsiniz.')
              this.decCoins(1)
            } else {
              this.isListReq = false
              this.presentToast('İsteğiniz iptal edilmiştir.')
            }
          },
          err => {
            //
          },
        )
      
    }else {
      if(this.dailyReqCount < 10){
        if (this.myCoins < 1) {
          console.log('b');
          return this.router.navigateByUrl("/walletcoin")
        } else if (this.myCoins > 0) {
          this.http.post(`${environment.url}/save-list-req`, { listId: this.listId, f: f, otherId: this.otherId, type: 'messaging' }).subscribe(
            (res: any) => {
              console.log(res);
              if (f === 'add') {
                this.isListReq = true
                this.presentToast('İsteğiniz onaylandığında konumu görebilirsiniz.')
                this.decCoins(1)
                this.sendNotificationInd(this.otherId, 'Etkinlik talebiniz geldi')
                this.changeDaily(1)
              } else {
                this.isListReq = false
                this.presentToast('İsteğiniz iptal edilmiştir.')
              }
            },
            err => {
              //
            },
          )
        }
      } else if(this.dailyReqCount == 10){
        this.presentToast('Günlük istek hakkınız doldu')
      }

      
    }

  }


splitString(str){
  var a = str.split('.');
  return a

}





  checkFav(id) {
    console.log(id);

    this.http.post(`${environment.url}/check-fav`, { listId: id }).subscribe(
      (res: any) => {
        console.log(res);
        if (res.message === 'var') {
          this.isFav = true
        } else {
          this.isFav = false
        }
        console.log(this.isFav);

      },
      err => {
        this.isFav = false

        //
      },

    )
  }


  createFav(f) {
    console.log(f);

    this.http.post(`${environment.url}/save-fav`, { listId: this.listId, f: f }).subscribe(
      (res: any) => {
        console.log(res);
        if (f === 'add') {
          this.isFav = true
        } else {
          this.isFav = false
        }
      },
      err => {
        //
      },

    )
  }
  async getCoins() {
    this.http.get(`${environment.url}/get-my-coins`).subscribe(
      (res: any) => {
        this.myCoins = res.trueCoins


      },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }

  async dailyReq() {
    this.http.get(`${environment.url}/get-my-dailyReq`).subscribe(
      (res: any) => {
        console.log(res);
        
        this.dailyReqCount = res.dailyReq


      },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }


  async decCoins(quantity) {
    this.http.post(`${environment.url}/dec-coin`, { quantity: quantity }).subscribe(
      (res: any) => {
        this.myCoins = res.trueCoins


      },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }
  async changeDaily(quantity) {
    this.http.post(`${environment.url}/change-dailyReq`, { quantity: quantity }).subscribe(
      (res: any) => {
        this.dailyReqCount = this.dailyReqCount + +1


      },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }


  onSendMessage() {

    console.log(this.myCoins);

    if (this.myId == this.otherId) {
      console.log('a');

      return this.presentToast('Kendinize mesaj atamazsınız')


    } else if (this.messReq === true || this.isListReq === true) {
      console.log('b');


        this.http.post(`${environment.url}/get-conv-id`, { otherId: this.otherId }).subscribe(
          (res: any) => {
            if (res && res.convId) {
              this.convId = res.convId;
              this.router.navigate([`/chat/${this.otherId}`], {
                queryParams: {
                  convId: this.convId, name: this.userInfoname, profileimg: this.userInfopicture
                }
              });
            }
          },
          (err) => {
            this.presentToast("Hata oluştu lütfen tekrar deneyin");
          }
        )

    } else  if (this.messReq === false) {
      console.log('c');

      if (this.myCoins < 10) {
        console.log('d');
        return this.router.navigateByUrl("/walletcoin")
      } else if (this.myCoins > 9) {
        console.log('e');

        this.http.post(`${environment.url}/get-conv-id`, { otherId: this.otherId }).subscribe(
          (res: any) => {
            if (res && res.convId) {
              this.convId = res.convId;
              this.createMessagereq()

              this.router.navigate([`/chat/${this.otherId}`], {
                queryParams: {
                  convId: this.convId, name: this.userInfoname, profileimg: this.userInfopicture
                }
              });
            }
          },
          (err) => {
            this.presentToast("Hata oluştu lütfen tekrar deneyin");
          }
        )
      } else {
        console.log('f');
      }
    }
  }






  onDelete(id: string) {
    this.http.post(`${environment.url}/photos/delete`, { id: id }).subscribe(
      (res: any) => {
        this.syncPhotos(this.listId)
        this.presentToast('Resminiz silindi');
      },
      err => {
        this.presentToast('Tekrar deneyiniz');
      },
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



  async presentToast(m: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      message: m,
      duration: 3000
    });
    toast.present();
  }

}
