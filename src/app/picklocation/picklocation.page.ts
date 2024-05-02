import { Component, NgZone } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
declare var google: any;
import { Location } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-picklocation',
  templateUrl: './picklocation.page.html',
  styleUrls: ['./picklocation.page.scss'],
})
export class PicklocationPage {
  autocompleteItems;
  autocomplete;

  latitude: number = 0;
  longitude: number = 0;
  geo: any
  getloc: string
  getltd: number
  getlng: number
  service = new google.maps.places.AutocompleteService();
  datalocaiton: any
  totalDis : number
  constructor(
    private zone: NgZone,
    private modalController: ModalController,
    private toastController: ToastController,
    private location : Location
  ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

  }
  goBack(){
    this.location.back()
  }

  map2: any
  markers = []
  watch
  ionViewDidEnter() {
    this.myPosition()
    console.log(this.calcdistance(41.009152, 29.065216, 41.009152, 29.025216));
    
  }

  myPosition() {
    this.showMap(this.getltd, this.getlng).then(() => {
      this.watch = Geolocation.watchPosition({ enableHighAccuracy: true }, (data: any, err) => {
        if (err) { this.presentToast(err.message); }
        if (data && data.coords) {

          const latLng = { lat: data.coords.latitude, lng: data.coords.longitude }
          this.placeMarkerAndPanTo(latLng, this.map2);
        }
      });

    })
  }




  placeMarkerAndPanTo(latLng, map) {
    const marker = new google.maps.Marker({
     // position: latLng,
      zoom: 2.5,
      map: map,
    //  draggable: true,
    //  animation: google.maps.Animation.BOUNCE,
    });
    map.panTo(latLng);
    //this.markers.push(marker);
  }
  showMap(latval, lngval) {
    return new Promise((resolve, reject) => {
      this.map2 = new google.maps.Map(document.querySelector('#myMap2'), {
        center: new google.maps.LatLng(latval, lngval),
        zoom: 12.5,
        zoomControl: false,
        mapTypeControl: true,
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

  gotolocation(latitude, longitude) {
    const latLng = { lat: latitude, lng: longitude }
    this.placeMarkerAndPanTo(latLng, this.map2);

  }

  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

  chooseItem(item: any) {
    console.log(item);
    
    this.dismiss(item)
    console.log(item.structured_formatting.main_text)
    console.log(item.place_id)
    this.geoCode(item.place_id);//convert Address to lat and long
    
  }
  calcdistance (mylat, mylong, addressLat, addressLong){
    let secondLat = addressLat
    let secondLong = addressLong
    var origin = new google.maps.LatLng(mylat, mylong); // using google.maps.LatLng class
    var destination = secondLat + ',' + secondLong // using string

    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin: origin, // LatLng|string
      destination: destination, // LatLng|string
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };


    directionsService.route(request).then((response) => {
      console.log(response);
      console.log(response.routes[0].legs[0].distance.value);
      
    }).then((res) => {
      console.log(res);
      this.totalDis = this.totalDis + res
      
    })
  }


  updateSearch() {
    var name = []
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.query,
      componentRestrictions: {
      }
    }, (predictions, status) => {
      me.autocompleteItems = [];
      me.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.autocompleteItems.push(prediction);
            name.push(prediction);
            console.log(name)
          });
        }
      });
    });
  }

  //convert Address string to lat and long
  geoCode(placeId: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: placeId }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
     // alert("lat: " + this.latitude + ", long: " + this.longitude);
      this.gotolocation(this.latitude, this.longitude)

    });
  }

  async dismiss(value) {
    const datalocaiton: string = value
    await this.modalController.dismiss(datalocaiton);
    if(datalocaiton == undefined) {
      this.presentToast('Konum Seçmediniz')
    }
  }
}