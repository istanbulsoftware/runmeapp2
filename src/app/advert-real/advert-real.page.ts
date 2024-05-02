import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController, ToastController, IonSlides, IonContent, NavController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { cities } from 'src/environments/cities';
import { InternetService } from '../internet.service';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { IconsService } from '../icons.service';
import * as moment from 'moment';
moment.locale('tr');
import { NotificationService } from '../notification.service';
import { FilterPage } from '../filter/filter.page';
import { IntroPage } from '../intro/intro.page';
import { Preferences } from '@capacitor/preferences';
import { LanguageService } from '../language.service';
import { take } from 'rxjs';
const TOKEN_KEY = 'my-token';
declare var google: any;
import { Location } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-advert-real',
  templateUrl: './advert-real.page.html',
  styleUrls: ['./advert-real.page.scss'],
})
export class AdvertRealPage {
  hobbies: any
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('mySlider', { static: true }) Slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;
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
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 1.8,
    loop: false,
    centeredSlides: false
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 1,
    loop: false,
    centeredSlides: false
  };
  slideOptsFour = {
    initialSlide: 0,
    slidesPerView: 1,
    loop: false,
    centeredSlides: false
  };
  item: boolean = false;

  myId
  conversations: any = []
  internetAccess: boolean;
  chats = {}
  vipusers: any
  newusers: any
  randomusers: any
  user: any = { name: '', profilePicture: { publicPath: null } }

  //select cats
  selectedCat: string
  mainCats: any
  breadCumb: any = []

  inputs: any
  isInputs: boolean
  vals = []
  list: any[] = new Array(5);
  listTitle: string
  desc: string
  allList: any
  price: string
  isNew: string
  iller: any
  ilceler: any
  ilceOfOlce: any
  selectedIl: string
  selectedIlce: string
  token
  listId
  boosts: any

  ishand: string
  listNo: string
  il: string
  ilce: string
  saleRent: string
  selectedLang: string
  startPrice: number
  endPrice: number
  selectedhobbie: any = []
  myhobies: any = []
  totalDis: number


  selectedgender: string
  minage: number
  maxage: number
  selectedcat: string
  selectedCity: string
  selectedArea: string
  ages: any = []


  firstLat: number
  firstLong: number
  secondLat: number
  secondLong: number

  userLat: number
  userLong: number
  banners : any
  items : any
  constructor(
    private camera: Camera,

    private internet: InternetService,
    private http: HttpClient,
    private router: Router,
    private fileTrans: FileTransfer,
    private filePath: FilePath,
    private toastController: ToastController,
    private socket: Socket,
    private modalController: ModalController,
    private userSer: IconsService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private languaageservice: LanguageService


  ) {
    this.listBanners()
    this.ages = ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37'
      , '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '60+']
    this.selectedgender = ""
    this.minage = 16
    this.maxage = 60
    this.selectedcat = ""
    this.selectedCity = ""
    this.selectedArea = ""

    this.hobbies = [
      { "id": "1", "name": "spor" },
      { "id": "2", "name": "burçlar" },
      { "id": "3", "name": "teknoloji" },
      { "id": "4", "name": "piercing" },
      { "id": "5", "name": "bisiklet" },
      { "id": "6", "name": "koşu" },
      { "id": "7", "name": "tenis" },
      { "id": "8", "name": "dans" },
      { "id": "9", "name": "cizim" },
      { "id": "10", "name": "dans" },
      { "id": "11", "name": "resim" },
      { "id": "12", "name": "kitap" },
      { "id": "13", "name": "yemek" },
      { "id": "14", "name": "seyahat" },
      { "id": "15", "name": "fotogram" },
      { "id": "16", "name": "boyama" },
      { "id": "17", "name": "apps" },
      { "id": "18", "name": "netflix" },
      { "id": "19", "name": "giyim" },
      { "id": "20", "name": "moda" },
      { "id": "21", "name": "tasarım" },
      { "id": "22", "name": "web" },
      { "id": "23", "name": "yazılım" },
      { "id": "24", "name": "puzzle" },
      { "id": "25", "name": "hayvanlar" },
      { "id": "26", "name": "kediler" },
      { "id": "26", "name": "köpkeler" },
      { "id": "26", "name": "mobilya" },
    ]
    this.iller = cities.iller
    this.ishand = ''
    this.saleRent = ''
    this.listNo = ''
    this.il = ''
    this.ilce = ''

    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        this.token = token.value
        const de = helper.decodeToken(token.value);
        this.myId = de.id;

      }
    })



  }

  routeMap(){
    this.router.navigate(['/map2']);
  }
  searchText: string = ''
  search(value: string) {
    this.searchText = value
  }
  watch
  myPosition() {
    this.watch = Geolocation.watchPosition({ enableHighAccuracy: true }, (data: any, err) => {
      if (err) { this.presentToast(err.message); }
      if (data && data.coords) {

        const latLng = { lat: data.coords.latitude, lng: data.coords.longitude }
      }
    });


  }
  calcdistance(mylat, mylong, addressLat, addressLong) {
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
      return response.routes[0].legs[0].distance.value
    }).then((res) => {
      console.log(res);
      this.totalDis = this.totalDis + res

    })
  }
  trimmer(v) {
    v.trim()
  }
  listAll() {
    this.http.get(`${environment.url}/list-all-lists`).subscribe(
      (res: any) => {
        this.allList = res.list

        console.log(this.allList);

      }
    )
  }
  userLists() {
    
    this.http.get(`${environment.url}/list-all-lists`).subscribe(
      (res: any) => {
        console.log(res);
        
        this.items = res.list


      },
      (err) => { this.presentToast("Tekrar deneyiniz") }
    )
  }
  watchPosition


  calcWithme(addressLat, addressLong) {
    this.watchPosition = Geolocation.watchPosition({ enableHighAccuracy: true }, (data: any, err) => {
      if (err) { this.presentToast(err.message); }
      if (data && data.coords) {
        //console.log(data);
        //const latLng = { lat: data.coords.latitude, lng: data.coords.longitude }
        let secondLat = addressLat
        let secondLong = addressLong
        var origin = new google.maps.LatLng(data.coords.latitude, data.coords.longitude); // using google.maps.LatLng class
        var destination = secondLat + ',' + secondLong // using string
        //  console.log(origin);

        var directionsService = new google.maps.DirectionsService();
        var request = {
          origin: origin, // LatLng|string
          destination: destination, // LatLng|string
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request).then((response) => {
          // console.log(response);
          return (response.routes[0].legs[0].distance.value)
        })
      }
    });
  }

  calcdistancesme(addressLat, addressLong) {

    //console.log(data);
    //const latLng = { lat: data.coords.latitude, lng: data.coords.longitude }
    let secondLat = addressLat
    let secondLong = addressLong
    var origin = new google.maps.LatLng(this.userLat, this.userLong); // using google.maps.LatLng class
    var destination = secondLat + ',' + secondLong // using string
    //  console.log(origin);

    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin: origin, // LatLng|string
      destination: destination, // LatLng|string
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request).then((response) => {
      // console.log(response);
      return (response.routes[0].legs[0].distance.value)
    })
  }


  calcdistances(addressLat, addressLong) {
    this.watchPosition = Geolocation.watchPosition({ enableHighAccuracy: true }, (data: any, err) => {
      if (err) { this.presentToast(err.message); }
      if (data && data.coords) {
        //console.log(data);
        //const latLng = { lat: data.coords.latitude, lng: data.coords.longitude }
        let secondLat = addressLat
        let secondLong = addressLong
        var origin = new google.maps.LatLng(data.coords.latitude, data.coords.longitude); // using google.maps.LatLng class
        var destination = secondLat + ',' + secondLong // using string
        //  console.log(origin);

        var directionsService = new google.maps.DirectionsService();
        var request = {
          origin: origin, // LatLng|string
          destination: destination, // LatLng|string
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request).then((response) => {
          // console.log(response);
          return (response.routes[0].legs[0].distance.value)
        })
      }
    });
  }


  ionViewDidLeave() {
    if (this.watchPosition) {
      Geolocation.clearWatch({ id: this.watchPosition })
    }
  }


  ionViewWillEnter() {
    this.selectedLang = this.languaageservice.getLanguage()

    this.listMain()
    this.listAll()
    this.userLists()
    // this.listByCat('645c23a656cf8b4cb5a6b58d')
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const de = helper.decodeToken(token.value);
        this.myId = de.id;
        this.socket.emit('joinChat', { roomId: de.id });
        this.myhobiesfunc()
      }
    })
  }
  newConversation() {
    this.router.navigateByUrl('/search');
  }

  myhobiesfunc() {
    this.http.get(`${environment.url}/profile/${this.myId}`).pipe(take(1)).subscribe((user: any) => {
      this.selectedhobbie = user.hobbies
      console.log(this.selectedhobbie);

    })
  }
  selectHobbie(id, h) {
    console.log(h);
    let obj1 = { label: id, value: h };
    if (this.selectedhobbie.filter(item => item.label === obj1.label).length == 0) {
      console.log('22');

      this.selectedhobbie.push(obj1);
      document.getElementById(id).classList.remove("hobbies");
      document.getElementById(id).classList.add("selhobbies");
    } else {
      console.log('AA');

      // this.selectedhobbie.filter(item => item.label === obj1.label)[0].value = obj1.value;
      const objWithIdIndex = this.selectedhobbie.findIndex((obj) => obj.label === id);

      console.log(objWithIdIndex);
      this.selectedhobbie.splice(objWithIdIndex, 1);
      document.getElementById(id).classList.remove("selhobbies");
      document.getElementById(id).classList.add("hobbies");
    }
    console.log(this.selectedhobbie);

  }

  strSplice(str){
   return str.slice(0, 80);
  }

  getVal(a, b) {


    let obj1 = { label: a, value: b };
    if (this.vals.filter(item => item.label === obj1.label).length == 0) {
      this.vals.push(obj1);
    } else {
      this.vals.filter(item => item.label === obj1.label)[0].value = obj1.value;
    }


    console.log(this.vals);



    // let arr1 = [{name: 'example1', quantity: 2},{name: 'example2', quantity: 3},{name: 'example3', quantity: 5}];
    // let obj1 = {name: 'example4', quantity: 7};
    // if(arr1.filter(item=> item.name === obj1.name).length==0){
    //   arr1.push(obj1);
    // }
    // else{
    //   arr1.filter(item=> item.name === obj1.name)[0].quantity = obj1.quantity;
    // }
    // console.log(arr1);


  }



  ngOnInit() {
    this.userSer.getUser().subscribe((user: any) => {
      if (user && user.email) {
        console.log(user);

        this.user = user
        this.userLat = user.lat
        this.userLong = user.lng
        console.log(this.user.profilePicture.fileName);
        if (this.user.profilePicture.fileName === null) {
        } else {
        }
        this.isLoading = false
      }
    })
  }
  filterNow() {
    var a = {
      gender: this.selectedgender,
      catId: this.selectedcat,
      minage: this.minage,
      maxage: this.maxage,
      il: this.selectedCity,
      ilce: this.selectedArea,
    }
    console.log(a);

    this.http.post(`${environment.url}/list-filter-now`, a).subscribe(
      (res: any) => {
        console.log(res);

        this.allList = res
        console.log(this.allList);
        this.dismiss()

      },
      async (err) => {
        this.dismiss()

        this.presentToast('sonuç bulunamadı')
      }
    )
  }

  filterCat(catId) {
    var a = {
      catId: catId
    }
    console.log(a);

    this.http.post(`${environment.url}/filter-cat`, a).subscribe(
      (res: any) => {
        console.log(res);

        this.allList = res
        console.log(this.allList);
        this.dismiss()

      },
      async (err) => {
        this.presentToast(err.message)
      }
    )
  }


  listBanners() {
    this.http.get(`${environment.url}/get-all-banners`).subscribe(
      (res: any) => {
        this.banners = res.message

        console.log(this.banners);

      }
    )
  }


  listBoosts(id) {
    this.http.get(`${environment.url}/list-boosts/${id}`).subscribe(
      (res: any) => {
        this.boosts = res.list
        console.log(this.allList);

      }
    )
  }

  listBoostssalerent(id, salrent) {
    this.http.get(`${environment.url}/list-boosts-salerent/${id}/${salrent}`).subscribe(
      (res: any) => {
        this.boosts = res.list
        console.log(this.allList);

      }
    )
  }


  listByCat(id) {
    this.http.get(`${environment.url}/list-lists/${id}/createdAt/-`).subscribe(
      (res: any) => {
        this.allList = res.list
        console.log(this.allList);
        this.listBoosts(id)

      }
    )
  }

  listByforsale(salrent) {
    this.http.get(`${environment.url}/list-by-salerent/645c23a656cf8b4cb5a6b58d/${salrent}`).subscribe(
      (res: any) => {
        this.allList = res.list
        console.log(this.allList);
        this.listBoostssalerent('645c23a656cf8b4cb5a6b58d', salrent)

      }
    )
  }

  tabHeight = '75px'
  error = false
  isLoading = false


  listMain() {
    this.http.get(`${environment.url}/list-main`).subscribe(
      (res: any) => {
        this.mainCats = res.category
        console.log(this.mainCats);

      }
    )


  }





  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      this.listAll()
    }, 2000);
  }


  listInput() {
    console.log(this.breadCumb[0].id);

    this.http.get(`${environment.url}/list-inputs/${this.breadCumb[0].id}`).subscribe(
      (res: any) => {
        console.log(res.inputs[0].input);
        this.inputs = res.inputs[0].input
      }
    )
  }
  openInputs() {
    this.isInputs = true
    this.iller = cities.iller
  }

  getIlceler(e) {
    var ilId = parseInt(e.detail.value) - 1
    this.il = cities.iller[ilId].name

    this.ilceler = cities.ilce
    this.ilceOfOlce = []

    for (let i = 0; i < this.ilceler.length; i++) {

      if (this.ilceler[i].il_id == e.detail.value) {
        this.ilceOfOlce.push({ id: this.ilceler[i].id, name: this.ilceler[i].name })
        this.selectedIlce = this.ilceler[i].name
      }
    }
  }
  getIlce(e) {
    this.ilce = e.detail.value
  }








  async presentToast(m) {
    const toast = await this.toastController.create({
      color: "danger",
      message: m,
      duration: 2000
    });
    toast.present();
  }







  goP(val) {
    this.router.navigateByUrl(`/profile/${val}`);

  }
  gotorpfie(user1, user2) {

    if (user1 != this.myId) {
      this.router.navigateByUrl(`/profile/${user1}`);
    } else {
      this.router.navigateByUrl(`/profile/${user2}`);

    }

  }

  async goSetopt() {
    console.log("ff");

    this.navCtrl.navigateRoot('/setopt')
  }

  async goBoost() {
    this.router.navigateByUrl('/boost')
  }
  async goFilter() {
    const modal = await this.modalController.create({
      component: FilterPage,
      cssClass: 'filter-page-css',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    return await modal.present();
  }
  async goIntro() {
    const modal = await this.modalController.create({
      component: IntroPage,
      // cssClass: 'filter-page-css',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    return await modal.present();
  }


  async onAddLink(h) {



    this.http.post(`${environment.url}/hobbies/add`, {
      hobbyname: h
    }).subscribe(
      async (res) => {
        this.presentToast("Başarılı bir şekilde yapıldı...")
      },
      async (err) => {
        this.presentToast("Hata oluştu lütfen tekrar deneyin")
      }
    )
  }
  getAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }
  dismiss() {
    this.modalController.dismiss()
  }


  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }


}
