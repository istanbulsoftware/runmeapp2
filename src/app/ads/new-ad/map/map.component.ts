import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

declare var google
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map3
  constructor(private toastController: ToastController, private modalController: ModalController,) { }

  markers=[]
  ngOnInit() {}

  onClick(){
    if(this.markers.length < 1){ this.presentToast(this.trans.instant('ADS.NEW_AD.pleasePick'))}
    else{this.modalController.dismiss({lat: this.markers[0].center.lat(), lng: this.markers[0].center.lng(), radius:this.markers[0].radius})}
  }

  onCancel(){
    this.modalController.dismiss({canceled: true})
  }

  ionViewDidEnter(){
    this.showMap().then(()=>{
      this.map3.addListener("click", (e) => {
        if(this.markers.length < 1){
          this.placeMarkerAndPanTo(e.latLng, this.map3);
        }
      });
    })

  }


  radius = 500000
  placeMarkerAndPanTo(latLng, map){
    const c = new google.maps.Circle({
      strokeColor: "#3bc2ca",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#3bc2ca",
      fillOpacity: 0.35,
      map: map,
      center: latLng,
      radius: this.radius,
      draggable: true,
      editable: true
    });

    map.panTo(latLng);
    this.markers.push(c);
    
  }


  showMap() {
    return new Promise((resolve,reject)=>{
      this.map3 = new google.maps.Map(document.querySelector('#myMap3'), {
        center: new google.maps.LatLng(23.4852424, 35.7394385),
        zoom: 2.5,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
        styles: [
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.attraction",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.government",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.medical",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.park",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.place_of_worship",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.school",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.sports_complex",
            stylers: [{ visibility: "off" }]
          },
          
        ]
      });
      resolve(true)
    })
  }


  async presentToast(m:string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
