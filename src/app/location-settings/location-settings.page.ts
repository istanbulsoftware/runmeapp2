import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { IconsService } from '../icons.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { TranslateService } from '@ngx-translate/core';
import { LocationSetPage } from '../location-set/location-set.page';
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';

const helper = new JwtHelperService();
const TOKEN_KEY = 'my-token';


@Component({
  selector: 'app-location-settings',
  templateUrl: './location-settings.page.html',
  styleUrls: ['./location-settings.page.scss'],
})
export class LocationSettingsPage implements OnInit {
  location
  id
  lat
  lng
  credentials: FormGroup
  isLocationServiceOn = false
  isFixedLocationChoosed =  false
  isLoading = true
  userLocation: { lat: number, lng: number } = { lat: null, lng: null }
  locationAccess = true
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private userSer: IconsService, 
    private modalController: ModalController,
    private socket: Socket,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private trans: TranslateService

    ) { 
      Preferences.get({key: TOKEN_KEY}).then(token=>{
        if(token && token.value){
          //this.socket.ioSocket.io.opts.query = { token: token.value } 
        }
      })
    this.credentials = new FormGroup({
      locationSetting: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      })
    })

  }

  get locationSetting(){return this.credentials.get('locationSetting')}

  ngOnInit() {
    this.userSer.getUser().subscribe((user: any)=>{
      if(user && user.location){
        this.location = user.location
        console.log(user.location);
        
        this.id = user.id
        this.credentials.controls.locationSetting.setValue(user.location);
        
        this.isLoading = false
      }
      
    })
  }

  async onOpenModel() {



      Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(data => {
        console.log(data.coords);
        this.userLocation.lat = data.coords.latitude
        this.userLocation.lng = data.coords.longitude
        //this.presentToast(this.userLocation.lat + '-----' + this.userLocation.lng)
        this.locationAccess = true

        this.presentModal(this.userLocation.lat, this.userLocation.lng)
        //this.display='flex'
      }).catch(err => {
        console.log(err)
        this.locationAccess = false
        //this.display = 'none'
        this.presentToast(err)
      })
    

  }

  async presentModal(lat, lng) {
    const modal = await this.modalController.create({
    component: LocationSetPage,
    componentProps: { vallat : lat, vallng : lng }
    });
  
    await modal.present();
  
    const data = await modal.onDidDismiss();
    
    if(data.data.canceled){
      
      this.lat=null
      this.lng=null
    }else{
      this.lat = data.data.lat;
      this.lng = data.data.lng;
    }

   
    
    
  }
  



  async changeLocationSettings(){
    const loading = await this.loadingController.create({
      message: 'Saving Data',
    });
    await loading.present();

    if( this.credentials.value.locationSetting == 'off'){ 
      
      this.socket.emit('removeMarker',{id: this.id})
      //this.socket.emit('onLocationChange',{id: this.id, location:{lat:null, lng:null}})
      this.saveDataToServer(loading)
    }

    if( this.credentials.value.locationSetting == 'fixedLocation'){
      
       if(this.lat && this.lng ){
        this.socket.emit('onLocationChange',{id: this.id, location:{lat:this.lat, lng:this.lng}})
        this.saveDataToServer(loading)
        
       }
       else{await loading.dismiss();this.presentToast(this.trans.instant('ADS.NEW_AD.pleasePick'));}
      }

    if( this.credentials.value.locationSetting == 'liveLocation'){ 
      this.saveDataToServer(loading)

    }
  

  }

  saveDataToServer(loading){
    this.http.post(`${environment.url}/changeLocationSetting`,{location: this.credentials.value.locationSetting}).subscribe(
      async(res)=>{
        await loading.dismiss();
        this.router.navigateByUrl('/tabs/tab5')
      },
      async(err)=>{await loading.dismiss(); this.presentToast(this.trans.instant('ALERT.fail'));},
    )
  }

  async presentToast(m:string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }

  async presentLoading() {
    
  }

}
