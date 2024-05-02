import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapServiceService } from '../map-service.service';
declare var google;
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-map2',
  templateUrl: './map2.page.html',
  styleUrls: ['./map2.page.scss'],
})
export class Map2Page implements OnInit {
  @ViewChild('myMap2') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  encodedRoute: string;
  startLat: any;
  startLng: any;
  endLat: any;
  endLng: any;
  openMap:boolean=false;
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
    this.initMap();
  }
  calculateAndDisplayRoute() {

    this.directionsDisplay.setMap(this.map);
    const that = this;
    this.directionsService.route({
      origin: new google.maps.LatLng(this.startLat, this.startLng),
      destination: new google.maps.LatLng(this.endLat, this.endLng),
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
        this.polyline.setMap(null);

        this.openMap=true;
        const node = document.getElementById('myMap2');
        // domtoimage
        //   .toPng(node)
        //   .then(function (dataUrl) {
        //     var img = new Image();
        //     console.log(dataUrl);
        //     img.src = dataUrl;
        //     document.body.appendChild(img);
        //   })
        //   .catch(function (error) {
        //     console.error('oops, something went wrong!', error);
        //   });




      //   html2canvas(document.getElementById('myMaps'),{ useCORS: true}).then( canvas => {
      //     console.log('canvas', canvas);
     
      //     let image64 = canvas.toDataURL('image/jpeg');
      //     console.log('image64', image64 );
     
      //  });

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
  
  openInMap(){
    const start = `${this.startLat},${this.startLng}`;
        const end = `${this.endLat},${this.endLng}`;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}&travelmode=walking`;
        window.open(url, '_blank');
  }

  initMap() {
    const mapOptions: any = {
      center: { lat: 0, lng: 0 },
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
    // this.startDrawing();
  }
  toggleDrawing() {
    this.drawingEnabled = !this.drawingEnabled;
    if (this.drawingEnabled) {
      this.startDrawing();
    } else {
      this.stopDrawing();
    }
    console.log(this.drawingEnabled);
  }

  startDrawing() {
    this.polyline = new google.maps.Polyline({
      map: this.map,
      clickable: false,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    let isDrawing = false;

    const startDrawingHandler = (event) => {
      if (this.drawingEnabled) {
        isDrawing = true;
        const touch = event.touches[0];
        const latLng = this.getLatLngFromTouch(touch);
        this.polyline.getPath().push(latLng);
        event.preventDefault();
      }
    };

    const continueDrawingHandler = (event) => {
      if (this.drawingEnabled) {
        if (isDrawing) {
          const touch = event.touches[0];
          const latLng = this.getLatLngFromTouch(touch);
          this.polyline.getPath().push(latLng);
          event.preventDefault();
        }
      }
    };

    const stopDrawingHandler = () => {
      if (this.drawingEnabled) {
        isDrawing = false;
        if (this.polyline && this.polyline.getPath().getLength() > 0) {
          const path = this.polyline.getPath();
          const startLatLng = path.getAt(0);
          const endLatLng = path.getAt(path.getLength() - 1);

          this.startLat = startLatLng.lat().toString();
          this.startLng = startLatLng.lng().toString();

          this.endLat = endLatLng.lat().toString();
          this.endLng = endLatLng.lng().toString();
        }
      }
    };

    this.touchStartListener = this.gmap.nativeElement.addEventListener('touchstart', startDrawingHandler);
    this.touchMoveListener = this.gmap.nativeElement.addEventListener('touchmove', continueDrawingHandler);
    this.touchEndListener = this.gmap.nativeElement.addEventListener('touchend', stopDrawingHandler);
    if (this.drawingEnabled) {
      this.map.setOptions({ draggable: false });
    }
  }

  stopDrawing() {
    this.map.setOptions({ draggable: true });
    this.gmap.nativeElement.removeEventListener('touchstart', this.touchStartListener);
    this.gmap.nativeElement.removeEventListener('touchmove', this.touchMoveListener);
    this.gmap.nativeElement.removeEventListener('touchend', this.touchEndListener);
  }

  getLatLngFromTouch(touch) {
    const rect = this.gmap.nativeElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return this.pixelToLatLng(x, y);
  }

  pixelToLatLng(x, y) {
    const bounds = this.map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const scale = Math.pow(2, this.map.getZoom());
    const latLng = new google.maps.LatLng(
      (1 - y / this.gmap.nativeElement.offsetHeight) * ne.lat() + (y / this.gmap.nativeElement.offsetHeight) * sw.lat(),
      x / this.gmap.nativeElement.offsetWidth * (ne.lng() - sw.lng()) + sw.lng()
    );
    return latLng;
  }
}

