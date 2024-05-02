import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapServiceService } from '../map-service.service';
declare var google;
import domtoimage from 'dom-to-image-more';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.page.html',
  styleUrls: ['./map-page.page.scss'],
})
export class MapPagePage implements OnInit {
  @ViewChild('myMap2') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  encodedRoute: string;
  startLatLng: any;
  endLatLng: any;
  startLat: any;
  startLng: any;
  endLat: any;
  endLng: any;
  constructor(public mapService: MapServiceService, private ngZone: NgZone) { }

  ngOnInit() {
  }
  @ViewChild('myMap2', { static: false }) gmap: ElementRef;
  map: any;
  polyline: any;
  drawingEnabled: boolean = false;
  moveListener: any;
  touchStartListener: any;
  touchMoveListener: any;
  touchEndListener: any;
  ngAfterViewInit(): void {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 }
    });
    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute();
    // setTimeout(() => {
    //   this.encodedRoute='gqs_EogudMVAEZKXhBHh@a@IoDo@iAS@D?TEVM@IPOLg@JOAIEELc@zAmAdEKECHY|@qDrLyAzEuAfF{@dD]bAQj@Ot@Mm@GUAC'
    //   this.showSavedRoute()
    // }, 1000);
  }
  calculateAndDisplayRoute() {

    const that = this;
    this.directionsService.route({
      origin: new google.maps.LatLng(this.mapService.startAddress.lat, this.mapService.startAddress.long),
      destination: new google.maps.LatLng(this.mapService.endAddress.lat, this.mapService.endAddress.long),
      travelMode: 'WALKING',
      provideRouteAlternatives: true,
      optimizeWaypoints: true
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
        const route = response.routes[0];
        console.log(route);
        route.legs.forEach((leg, legIndex) => {
          console.log(`Leg ${legIndex + 1}`);
          leg.steps.forEach((step, stepIndex) => {
            const distance = step.distance.text;
            const duration = step.duration.text;
            console.log(`Step ${stepIndex + 1}: ${step.instructions} (${distance}, ${duration})`);
          });

        });
        that.encodedRoute = google.maps.geometry.encoding.encodePath(route.overview_path);
        console.log(that.encodedRoute, 'encodedRoute')

      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


  // Show the saved route
  showSavedRoute() {
    if (this.encodedRoute) {
      // Decode the encoded route and display it
      const decodedPath = google.maps.geometry.encoding.decodePath(this.encodedRoute);
      const route = new google.maps.Polyline({
        path: decodedPath,
        geodesic: false,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      route.setMap(this.directionsDisplay.getMap());

      // Adjust map bounds to fit the route
      const bounds = new google.maps.LatLngBounds();
      decodedPath.forEach((point) => {
        bounds.extend(point);
      });
      this.directionsDisplay.getMap().fitBounds(bounds);
    } else {
      window.alert('No saved route available.');
    }
  }

}

