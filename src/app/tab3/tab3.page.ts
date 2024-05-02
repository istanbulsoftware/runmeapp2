import { Component, OnInit } from '@angular/core';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { MenuController } from '@ionic/angular';
import { InternetService } from '../internet.service';
import { Router } from '@angular/router';

import createHTMLMapMarker from '../HTMLMapMarker';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IconsService } from '../icons.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();
const TOKEN_KEY = 'my-token';

import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';

declare var google;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  centerLat: number
  centerlng: number
  users = []

  markers = []
  markers2: any = {}
  internetAccess: boolean = true;
  userLocation: { lat: number, lng: number } = { lat: null, lng: null }
  locationAccess = true
  map: any;

  mapCenter = new google.maps.LatLng(23.4852424, 35.7394385)
  zoom = 15
  isLoading = false;
  isMapReady = false;
  display = 'flex'
  appUser
  watchPosition
  userId: string

  cafeBar = []
  hotel = []
  other = []
  storecloseIcon: string
  allchecked: string = 'true'
  checkLocation : boolean
  constructor(
    private router: Router,
    private internet: InternetService,
    private socket: Socket,
    private http: HttpClient,
    //private geolocation: Geolocation,
    private userSer: IconsService,
    private toastController: ToastController,
    private alertController: AlertController,
    private trans: TranslateService,
    private loadingController: LoadingController
  ) {
    this.storecloseIcon = "chevron-forward-outline"

    //===============
    this.userSer.getUser().subscribe(
      (res: any) => {
        if (res && res.location) {
          this.appUser = res;
          console.log(this.appUser);
          
          if (res.location == 'fixedLocation' || res.location == 'liveLocation') {
            this.mapCenter = new google.maps.LatLng(res.lat, res.lng)
            this.zoom = 10.5
            console.log(res.lat + '-' + res.lng);
            this.centerLat = res.lat
            this.centerlng = res.lng

          }
          else {
            this.mapCenter = new google.maps.LatLng(23.4852424, 35.7394385)
            this.centerLat = 23.4852424
            this.centerlng = 35.7394385
            this.zoom = 2.5
          }

        }
      }
    )
  }
goTo(){
  this.router.navigate(['/tabs/my-profile'])
}
  ngOnInit() {


    this.socket.fromEvent('changePosition').subscribe(data => {
      console.log(data);

      if (data && data['id'] && this.markers2[data['id']]) {
        this.markers2[data['id']].setPosition(new google.maps.LatLng(data['location'].lat, data['location'].lng))
        this.markers2[data['id']].latlng = new google.maps.LatLng(data['location'].lat, data['location'].lng);

        /* this.markers.forEach(element => {
          if(element.div.id == data['id']){
            element.setPosition(new google.maps.LatLng(data['location'].lat, data['location'].lng))
            element.latlng = new google.maps.LatLng(data['location'].lat, data['location'].lng)
          }
        }); */
        if (data['id'] == this.appUser.id) { this.appUser.lat = data['location'].lat; this.appUser.lng = data['location'].lng }
      }
    });

    this.socket.fromEvent('removeMarker').subscribe((data: any) => {
      console.log(data);

      if (data && data['id'] && this.markers2[data['id']]) {
        this.markers2[data['id']].remove();
        this.markers2[data['id']].setMap(null);
        delete this.markers2[data['id']];

        /*         this.markers.forEach((element, index) => {
                  if(element.div.id == data['id']){
                    element.remove()
                    element.setMap(null)
                    this.markers.splice(index,1)
                  }
                }); */

      }
    });

    this.socket.fromEvent('addMarker').subscribe(data => {
      if (data && data['id']) {
        console.log(this.markers);
        //if(this.markers.length > 0){
        //this.markers.forEach(element => {
        if (this.markers2[data['id']]) {
        }
        else {

          if (data['accountType'] == 'personal' && data['gender'] == 'male') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#3d6cb9', 'person') }
          else if (data['accountType'] == 'personal' && data['gender'] == 'female') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#ea7dc7', 'person') }
          else if (data['accountType'] == 'personal' && data['gender'] == 'other') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], 'var(--ion-color-warning-shade)', 'person') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'bakery') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#582233', 'bakery') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'bar') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#278ea5', 'bar') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'barber') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#3f3b3b', 'barber') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'cafe') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#430d27', 'cafe') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'carRepair') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#1e4ba0', 'carRepair') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'carStore') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#3d5af1', 'carStore') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'carService') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#88bef5', 'carService') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'fastFood') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#be6a15', 'fastFood') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'gym') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#0b8457', 'gym') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'hotel') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#fc85ae', 'hotel') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'pastry') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#ee5a5a', 'pastry') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'pharmacy') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#10316b', 'pharmacy') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'restaurant') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#b31e6f', 'restaurant') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'store') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#40514e', 'store') }
          else if (data['accountType'] == 'business' && data['businessCategory'] == 'taxi') { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], '#eac100', 'taxi') }
          else { this.createSpecialMarker(data['rating'], data['ratecount'], this.markers.length, data['id'], data['profilePicture'], data['location'], 'var(--ion-color-secondary-shade)', 'other') }

        }
        //});
        //}
        /* else{
          if(data['accountType'] == 'personal' && data['gender'] == 'male'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#3d6cb9', 'person')}
            else if(data['accountType'] == 'personal' && data['gender'] == 'female'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#ea7dc7', 'person')}
            else if(data['accountType'] == 'personal' && data['gender'] == 'other'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], 'var(--ion-color-warning-shade)', 'person')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'bakery'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#582233', 'bakery')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'bar'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#278ea5', 'bar')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'barber'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#3f3b3b', 'barber')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'cafe'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#430d27', 'cafe')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'carRepair'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#1e4ba0', 'carRepair')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'carStore'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#3d5af1', 'carStore')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'carService'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#88bef5', 'carService')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'fastFood'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#be6a15', 'fastFood')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'gym'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#0b8457', 'gym')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'hotel'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#fc85ae', 'hotel')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'pastry'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#ee5a5a', 'pastry')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'pharmacy'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#10316b', 'pharmacy')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'restaurant'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#b31e6f', 'restaurant')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'store'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#40514e', 'store')}
            else if(data['accountType'] == 'business' && data['businessCategory'] == 'taxi'){this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], '#eac100', 'taxi')}
            else{this.createSpecialMarker(this.markers.length,data['id'], data['profilePicture'], data['location'], 'var(--ion-color-secondary-shade)', 'other')}
          
        } */


      }
    });



  }

  ionViewWillEnter() {
    Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(data => {
      this.centerLat = data.coords.latitude
      this.centerlng = data.coords.longitude
      this.userLocation.lat = data.coords.latitude
      this.userLocation.lng = data.coords.longitude

      this.http.post(`${environment.url}/user-last-location`, {
        lat: data.coords.latitude,
        lng: data.coords.longitude
      }).subscribe(
        (res: any) => { console.log(res) },
        (err) => { console.log(err) }
      );
      this.locationAccess = true
      this.display = 'flex'
    }).catch(err => {
      console.log(err)
      this.locationAccess = false
      this.display = 'none'
    })

    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const a = helper.decodeToken(token.value);
        this.userId = a.id;

        if (a.location == 'liveLocation') {
          this.watchPosition = Geolocation.watchPosition({ enableHighAccuracy: true }, (data: any, err) => {
            if (err) { this.presentToast(err.message); }
            if (data && data.coords) {
              if (this.markers2[a.id]) {
                this.markers2[a.id].setPosition(new google.maps.LatLng(data.coords.latitude, data.coords.longitude))
                this.markers2[a.id].latlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
              }
              this.socket.emit('onLocationChange', { id: a.id, location: { lat: data.coords.latitude, lng: data.coords.longitude } })
              console.log({ id: a.id, location: { lat: data.coords.latitude, lng: data.coords.longitude } });
            }
          });
        }
      }
    })

  }

  ionViewDidLeave() {
    if (this.watchPosition) {
      Geolocation.clearWatch({ id: this.watchPosition })
    }
  }

  tabHeight = '75px'
  ionViewDidEnter() {
    const tab = document.querySelector('ion-tab-bar');
    const height = tab.clientHeight;
    this.tabHeight = `${height}px`
    //==================
    if (!this.isMapReady) {
      this.showMap()
      setTimeout(() => {
        this.syncMarkersToMap()
      }, 1000);
    }
  }

  gotosearch() {
    this.router.navigateByUrl('/tabs/search')
  }

  search(value: string) {
    this.isLoading = true
    var mapusers = []
    this.http.post(`${environment.url}/search`, { name: value }).subscribe(
      (res: any[]) => {
        if (res) {
          this.users = res

          this.users.forEach((user, index) => {
            if (user.accountType == 'personal' && user.gender == 'male') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#3d6cb9', 'person') }
            else if (user.accountType == 'personal' && user.gender == 'female') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#ea7dc7', 'person') }
            else if (user.accountType == 'personal' && user.gender == 'other') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#8400ff', 'person') }
            else if (user.accountType == 'business' && user.businessCategory == 'bakery') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#582233', 'bakery') }
            else if (user.accountType == 'business' && user.businessCategory == 'bar') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#278ea5', 'bar') }
            else if (user.accountType == 'business' && user.businessCategory == 'barber') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#3f3b3b', 'barber') }
            else if (user.accountType == 'business' && user.businessCategory == 'cafe') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#430d27', 'cafe') }
            else if (user.accountType == 'business' && user.businessCategory == 'carRepair') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#1e4ba0', 'carRepair') }
            else if (user.accountType == 'business' && user.businessCategory == 'carStore') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#3d5af1', 'carStore') }
            else if (user.accountType == 'business' && user.businessCategory == 'carService') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#88bef5', 'carService') }
            else if (user.accountType == 'business' && user.businessCategory == 'fastFood') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#be6a15', 'fastFood') }
            else if (user.accountType == 'business' && user.businessCategory == 'gym') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#0b8457', 'gym') }
            else if (user.accountType == 'business' && user.businessCategory == 'hotel') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#fc85ae', 'hotel') }
            else if (user.accountType == 'business' && user.businessCategory == 'pastry') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#ee5a5a', 'pastry') }
            else if (user.accountType == 'business' && user.businessCategory == 'pharmacy') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#10316b', 'pharmacy') }
            else if (user.accountType == 'business' && user.businessCategory == 'restaurant') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#b31e6f', 'restaurant') }
            else if (user.accountType == 'business' && user.businessCategory == 'store') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#40514e', 'store') }
            else if (user.accountType == 'business' && user.businessCategory == 'taxi') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#eac100', 'taxi') }
            else { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, 'var(--ion-color-secondary-shade)', 'other') }
          });
        } else {
          console.log('1')
        }

      },
      (err) => { this.presentToast(err.message); }
    )
  }

  refreshMap() {
    this.removeAllMarkers().then(() => {
      this.syncMarkersToMap();
      console.log(this.markers2)
    })
  }

  async showAlert() {
    const alert = await this.alertController.create({
      message: this.trans.instant('TAB3.locationdesc'),
      buttons: ['OK'],
    });

    await alert.present();
  }
  syncMarkersToMap() {
    this.http.get(`${environment.url}/locations`).subscribe(
      (res: any[]) => {
        console.log(res);

        if (res && res.length > 0) {
          this.users = res;
          this.users.forEach((user, index) => {
            if (user.accountType == 'personal' && user.gender == 'male') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#3d6cb9', 'person') }
            else if (user.accountType == 'personal' && user.gender == 'female') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#ea7dc7', 'person') }
            else if (user.accountType == 'personal' && user.gender == 'other') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#8400ff', 'person') }
            else if (user.accountType == 'business' && user.businessCategory == 'bakery') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#582233', 'bakery') }
            else if (user.accountType == 'business' && user.businessCategory == 'bar') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#278ea5', 'bar') }
            else if (user.accountType == 'business' && user.businessCategory == 'barber') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#3f3b3b', 'barber') }
            else if (user.accountType == 'business' && user.businessCategory == 'cafe') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#430d27', 'cafe') }
            else if (user.accountType == 'business' && user.businessCategory == 'carRepair') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#1e4ba0', 'carRepair') }
            else if (user.accountType == 'business' && user.businessCategory == 'carStore') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#3d5af1', 'carStore') }
            else if (user.accountType == 'business' && user.businessCategory == 'carService') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#88bef5', 'carService') }
            else if (user.accountType == 'business' && user.businessCategory == 'fastFood') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#be6a15', 'fastFood') }
            else if (user.accountType == 'business' && user.businessCategory == 'gym') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#0b8457', 'gym') }
            else if (user.accountType == 'business' && user.businessCategory == 'hotel') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#fc85ae', 'hotel') }
            else if (user.accountType == 'business' && user.businessCategory == 'pastry') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#ee5a5a', 'pastry') }
            else if (user.accountType == 'business' && user.businessCategory == 'pharmacy') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#10316b', 'pharmacy') }
            else if (user.accountType == 'business' && user.businessCategory == 'restaurant') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#b31e6f', 'restaurant') }
            else if (user.accountType == 'business' && user.businessCategory == 'store') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#40514e', 'store') }
            else if (user.accountType == 'business' && user.businessCategory == 'taxi') { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, '#eac100', 'taxi') }
            else { this.createSpecialMarker(user.rating, user.ratecount, index, user.id, user.profilePicture, user.location, 'var(--ion-color-secondary-shade)', 'other') }
          });

        }
      },
      (err) => { this.presentToast(err.message); }
    );


  }

  removeAllMarkers() {
    return new Promise(
      (resolve, reject) => {
        for (const [key, value] of Object.entries(this.markers2)) {
          this.markers2[key].remove();
          this.markers2[key].setMap(null);
          delete this.markers2[key];
        }
        resolve(true);
        /* if(this.markers.length > 0){

          var i = this.markers.length;
          while (i--) {
            this.markers[i].remove()
            this.markers[i].setMap(null)
            this.markers.splice(i,1)
          }
          resolve(true)
        }
        else{
          resolve(true)
        } */
      }
    )

  }

  createSpecialMarker(aa, cc, index, id: string, profilePicture: any, location: any, color: string, iconNem: string) {

    var a
    a = (aa / cc).toFixed(2)
    if (!isNaN(a) == true) { a = a } else { a = '0.00' }

    if (iconNem == 'person') {
      if (profilePicture == null || profilePicture == undefined) {
        const html = `
        <ion-avatar id="${id}" class="${iconNem}"  style = " background: var(--ion-color-dark-contrast);position: relative;width: 70%;height: 70%;border: 3px solid ${color};border-radius: 50%;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
        <ion-icon src='./../../assets/images/${iconNem}.svg' style="width: 100%;height: 100%;color:  ${color};"></ion-icon>
        </ion-avatar>
        `
        const marker = createHTMLMapMarker({
          latlng: new google.maps.LatLng(location.lat, location.lng),
          map: this.map,
          id: id,
          html: html
        });
        //this.markers[index] = marker;
        this.markers2[id] = marker;
        marker.addListener("click", () => {
          this.router.navigateByUrl(`/profile/${id}`)
        });
      } else {
        const img = `
        <ion-avatar  id="${id}"  class="${iconNem}"  style = " background: var(--ion-color-light);position: relative;width: 70%;height: 70%;border: 3px solid ${color};border-radius: 50%;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
        <ion-img src='${profilePicture}' style="width: 100%;height: 100%;padding: 0;margin: 0;"></ion-img>
        </ion-avatar>
        `
        const marker = createHTMLMapMarker({
          latlng: new google.maps.LatLng(location.lat, location.lng),
          id: id,
          map: this.map,
          html: img
        });
        //this.markers[index] = marker;
        this.markers2[id] = marker;
        marker.addListener("click", () => {
          this.router.navigateByUrl(`/profile/${id}`)
        });
      }
    } else {
      if (profilePicture == null || profilePicture == undefined) {
        const html = `
        <ion-avatar  id="${id}"  class="${iconNem}"  style = " background: var(--ion-color-dark-contrast);position: relative;width: 70%;height: 70%;border: 3px solid ${color};border-radius: 10px;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
        <ion-icon src='./../../assets/images/${iconNem}.svg' style="width: 100%;height: 100%;color:  ${color};"></ion-icon>
        </ion-avatar>
        `
        const marker = createHTMLMapMarker({
          latlng: new google.maps.LatLng(location.lat, location.lng),
          map: this.map,
          id: id,
          html: html
        });
        //this.markers[index] = marker;
        this.markers2[id] = marker;
        marker.addListener("click", () => {
          this.router.navigateByUrl(`/profile/${id}`)
        });
      } else {
        const img = ` 
        <ion-avatar  id="${id}"  class="${iconNem}"  style = " background: var(--ion-color-light);position: relative;width: 70%;height: 70%;border: 3px solid ${color};border-radius: 10px;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
        <ion-img src='${profilePicture}' style="width: 100%;height: 100%;padding: 0;margin: 0;"></ion-img>
        </ion-avatar>
        `
        const marker = createHTMLMapMarker({
          latlng: new google.maps.LatLng(location.lat, location.lng),
          id: id,
          map: this.map,
          html: img
        });
        //this.markers[index] = marker;
        this.markers2[id] = marker;
        marker.addListener("click", () => {
          this.router.navigateByUrl(`/profile/${id}`)
        });
      }
    }


  }


  showMap() {
    // alert(this.centerLat +'-'+ this.centerlng)
    this.map = new google.maps.Map(document.querySelector('#myMap'), {

      center: new google.maps.LatLng(this.centerLat, this.centerlng),
      zoom: this.zoom,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: false,
      styles: [
        {
          featureType: "transit",
          stylers: [{ visibility: "on" }]
        },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }]
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

      ]
    });
    this.isMapReady = true;

  }


  myLocation() {

    if (this.appUser.location == 'off') {
      this.router.navigateByUrl('/location-settings')
    }
    else {
      this.map.setZoom(16)
      this.map.setCenter({ lat: this.appUser.lat, lng: this.appUser.lng })
    }
  }


  tryAgain() {
    this.isLoading = true;
    Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(data => {
      console.log(data.coords);
      this.userLocation.lat = data.coords.latitude
      this.userLocation.lng = data.coords.longitude
      this.locationAccess = true
      this.isLoading = false
      this.display = 'flex'
    }).catch(err => {
      console.log(err)
      this.locationAccess = false
      this.isLoading = false
      this.display = 'none'
    })
  }

  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }

  onAdClick(cat) {
    this.router.navigate([`/present-ad`], { queryParams: { cat: cat, lat: this.userLocation.lat, lng: this.userLocation.lng } });
  }

  onSurveyClick() {
    this.router.navigate([`/present-survey`], { queryParams: { lat: this.userLocation.lat, lng: this.userLocation.lng } });
  }

  hideNow(event, val) {
    var isChecked = event.currentTarget.checked;
    console.log(isChecked);
    if (isChecked == true) {
      const a = document.getElementsByClassName(val)
      for (let i = 0; i < a.length; i++) {
        if (a[i].id != '') {
          console.log(a[i].id);
          document.getElementById(a[i].id).style.display = "none";
        }
      }
    } else {
      const a = document.getElementsByClassName(val)
      for (let i = 0; i < a.length; i++) {
        if (a[i].id != '') {
          console.log(a[i].id);
          document.getElementById(a[i].id).style.display = "block";
        }
      }
    }
  }
  hideAll() {
    this.allchecked = "false"
    var stores = ['person', 'taxi', 'bakery', 'bar,', 'barber', 'cafe', 'carRepair', 'carStore', 'carService', 'fastFood', 'gym', 'hotel', 'pastry', 'pharmacy', 'restaurant', 'store', 'other']
    stores.forEach(function (value) {
      const a = document.getElementsByClassName(value)
      for (let i = 0; i < a.length; i++) {
        if (a[i].id != '') {
          console.log(a[i].id);
          document.getElementById(a[i].id).style.display = "none";
        }
      }
    });
  }

  showStores(val, storecloseIcon) {

    console.log(storecloseIcon);
    console.log(val);

    if (storecloseIcon == 'close') {
      document.getElementById('stores').style.display = "none";
      this.storecloseIcon = 'chevron-forward-outline'

    } else {
      document.getElementById('stores').style.display = "block";
      this.storecloseIcon = 'close'
    }
  }


  async changeLocationSettings(e) {
    const loading = await this.loadingController.create({
      message: 'Kaydediliyor',
    });
    await loading.present();

    if (e.detail.checked === false) {
      console.log(e.detail.checked);


      this.socket.emit('removeMarker', { id: this.userId })
      //this.socket.emit('onLocationChange',{id: this.id, location:{lat:null, lng:null}})
      this.saveDataToServer(loading, 'off')
    }

    if (e.detail.checked === true) {
      console.log(e.detail.checked);

      this.saveDataToServer(loading, 'liveLocation')
    }
  }

  saveDataToServer(loading, v) {
    this.http.post(`${environment.url}/changeLocationSetting`, { location: v }).subscribe(
      async (res) => {
        await loading.dismiss();
      },
      async (err) => { await loading.dismiss(); this.presentToast(this.trans.instant('ALERT.fail')); },
    )
  }
}
