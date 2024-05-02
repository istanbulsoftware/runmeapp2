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
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { IconsService } from '../icons.service';

import { NotificationService } from '../notification.service';
import { FilterPage } from '../filter/filter.page';
import { IntroPage } from '../intro/intro.page';
import { Preferences } from '@capacitor/preferences';
import { LanguageService } from '../language.service';
import { PicklocationPage } from '../picklocation/picklocation.page';
const TOKEN_KEY = 'my-token';
declare var google: any;
import * as moment from 'moment';
import { MapServiceService } from '../map-service.service';
import { location } from '../map-service.service';
@Component({
  selector: 'app-advert-create',
  templateUrl: './advert-create.page.html',
  styleUrls: ['./advert-create.page.scss'],
})
export class AdvertCreatePage {
  MinDate: any;

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
    slidesPerView: 4,
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
    slidesPerView: 5,
    loop: false,
    centeredSlides: false
  };
  myId;
  title:string;
  conversations: any = []
  internetAccess: boolean;
  chats = {}
  vipusers: any
  newusers: any;
  startAddress: { text: string; lat: number; long: number; } = { text: "", lat: 0, long: 0 };
  endAddress: { text: string; lat: number; long: number; } = { text: "", lat: 0, long: 0 };
  randomusers: any
  user: any = { name: '', profilePicture: { publicPath: null } }

  //select cats
  selectedCat: string
  mainCats: any
  breadCumb: any = []

  inputs: any
  isInputs: boolean
  vals = []
  getdate: string
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
  selectedLang: string
  saveIl: string
  saveIlce: string
  saleRent: string
  breadCumbarr: any = []
  placeLatitude: string
  placeLongitude: string
  placeName: string
  listlat: number
  listlong: number
  listIl: string
  listIlce: string
  birthday: string
  gender: string
  myCoins: number
  years: number[] = [];

  listYear: number
  listGear: string
  listEnergy: string
  gear: any
  energy: any
  colors: any
  selectedMarka: string
  modelyear: string
  color: string
  driver: string
  selenergy: string
  selgear: string
  constructor(
    private camera: Camera,
    private languaageservice: LanguageService,
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
    private activatedRoute: ActivatedRoute,
    private map: MapServiceService


  ) {
    this.colors = ["Siyah", "Beyaz", "Kırmızı", "Mavi", "Gri", "Turuncu", "Sarı", "Yeşil"]
    this.gear = ['Manuel', 'Otomatik', 'Triptonik']
    this.energy = ['Benzin', 'Dizel', 'Elektrik', 'Hybrid', 'LPG', 'LPG + Benzin']
    let currentDate: Date = new Date();

    // Get the current year from the date
    let currentYear: number = currentDate.getFullYear();
    for (let year = 1950; year <= currentYear; year++) {
      console.log(year);
      this.years.push(year)
    }
    this.selectedCat = this.activatedRoute.snapshot.params['id']
    this.selectedMarka = this.activatedRoute.snapshot.params['marka']
    this.getSubCat(this.selectedMarka)

    var e = new Date()
    this.listSub(this.selectedCat, '')
    //2023-09-22T13:47
    //this.MinDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
    this.MinDate = e.toJSON();
    console.log(this.MinDate);


    this.iller = cities.iller
    console.log(this.languaageservice.getLanguage());

    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        this.token = token.value
        const de = helper.decodeToken(token.value);
        this.myId = de.id;

      }
    })

    this.internet.getNetworkState().subscribe(s => {
      this.internetAccess = s;
    });

  }
  async gotoOfferm(type: string) {


    const modal = await this.modalController.create({
      component: PicklocationPage,
      mode: "md",
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    modal.onDidDismiss().then((data: any) => {
      this.geoCode(data.data.place_id)
      console.log(data.data.place_id);
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId: data.data.place_id }, (results, status) => {
        this.listlat = results[0].geometry.location.lat();
        this.listlong = results[0].geometry.location.lng();
        // alert("lat: " + this.listlat + ", long: " + this.listlong);
        // this.gotolocation(this.listlat, this.listlong)
        // this.placeName = data.data.structured_formatting.main_text
        if (type == 'start') {
          this.startAddress.text = data.data.structured_formatting.main_text;
          this.startAddress.lat = results[0].geometry.location.lat();
          this.startAddress.long = results[0].geometry.location.lng();
          this.map.startAddress = this.startAddress;
        } else {
          this.endAddress.text = data.data.structured_formatting.main_text;
          this.endAddress.lat = results[0].geometry.location.lat();
          this.endAddress.long = results[0].geometry.location.lng();
          this.map.endAddress = this.endAddress;
        }

      });
      // this.saveIl = data.data.structured_formatting.secondary_text
      if (data) {
        //console.log(data.structured_formatting.main_text);
        // this.saveIl = data.structured_formatting.main_text

      } else {
        this.presentToast('Adres seçmediniz')
      }
    });
    return await modal.present();

  }



  geoCode(placeId: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: placeId }, (results, status) => {
      this.placeLatitude = results[0].geometry.location.lat();
      this.placeLongitude = results[0].geometry.location.lng();
      // alert("lat: " + this.placeLatitude + ", long: " + this.placeLongitude);

    });
  }

  getSubCat(id) {
    this.http.get(`${environment.url}/get-sub-cat/${id}`).subscribe((res: any) => {
      console.log(res);
      this.getVal('marka', res.c.name)
    })
  }
  listType
  saveList() {

    const arr3 = [...this.breadCumbarr, ...this.vals];
    // var splitted = this.saveIl.split(",", 1); 

    var a = {
      desc: this.desc,
      catId: "65c5f84b89363631d9abf2fa",
      inputvals: arr3,
      isNew: this.isNew,
      title: this.listTitle,
      placeName: this.placeName,
      listlat: this.listlat,
      listlong: this.listlong,
      saleRent: this.saleRent,
      price: this.price,
      listType: this.listType,
      bostEndDate: this.getdate,
      birthday: this.birthday,
      gender: this.gender,

      modelyear: this.modelyear,
      color: this.color,
      driver: this.driver,
      energy: this.selenergy,
      gear: this.selgear,


    }
    console.log(a);

    this.http.post(`${environment.url}/create-new-list`, a).subscribe((res: any) => {
      console.log(res);
      this.listId = res.a._id
      console.log(this.listId);
      this.desc = ""
      this.selectedCat = ""
      this.vals = []
      this.isNew = ""
      this.saveIl = ""
      this.saveIlce = ""
      this.price = ""
      this.breadCumb = []
      this.breadCumbarr = []
      this.decCoins(5)
      // this.router.navigate(['/car-registeration3']);
      this.router.navigate([`/uploads/${this.listId}`]);


    })

  }
  nextPage() {
    this.navCtrl.navigateForward(['map-page']);
  }

  searchText: string = ''
  search(value: string) {
    this.searchText = value
  }

  newConversation() {
    this.router.navigateByUrl('/search');
  }

  ionViewDidEnter() {
    //  this.getCoins()

  }

  async decCoins(quantity) {
    this.http.post(`${environment.url}/dec-coin`, { quantity: quantity }).subscribe(
      (res: any) => {
        this.myCoins = res.trueCoins
        if (this.myCoins < 331) {
          this.router.navigateByUrl("/walletcoin")
        }

      },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }
  async getCoins() {
    this.http.get(`${environment.url}/get-my-coins`).subscribe(
      (res: any) => {
        this.myCoins = res.trueCoins
        if (this.myCoins < 5) {
          this.router.navigateByUrl("/walletcoin")
        }

      },
      // err=>{this.presentToast("Hata oluştu lütfen tekrar deneyin"); loading.dismiss()}
    )
  }
  ngOnInit() {

    this.userSer.getUser().subscribe((user: any) => {
      console.log(user);

      this.gender = user.gender
      this.birthday = user.birthday

      if (user && user.email) {

        this.user = user
        console.log(this.user.profilePicture.fileName);
        if (this.user.profilePicture.fileName === null) {

        } else {
        }

        this.isLoading = false
      }

    })

  }

  getVal(a, b) {


    let obj1 = { label: a, value: b };
    console.log(obj1);

    if (this.vals.filter(item => item.label === obj1.label).length == 0) {
      this.vals.push(obj1);
      console.log('1');

    } else {

      if (b === 'on') {
        const index = this.vals.findIndex(el => el.label === a)
        if (index > -1) {
          this.vals.splice(index, 1);
        }
      } else {
        this.vals.filter(item => item.label === obj1.label)[0].value = obj1.value;
        console.log('2');
        console.log(obj1);
      }
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



  ionViewWillEnter() {
    this.selectedLang = this.languaageservice.getLanguage()

    this.listMain()
    this.listAll()
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const de = helper.decodeToken(token.value);
        this.myId = de.id;
        this.socket.emit('joinChat', { roomId: de.id });
      }
    })
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

  listAll() {
    this.http.get(`${environment.url}/list-all-lists`).subscribe(
      (res: any) => {
        this.allList = res.list
        console.log(this.allList);

      }
    )
  }

  listSub(id, name) {
    this.breadCumbarr.push({ label: 'valType', value: name })


    this.breadCumb.push({ id: id, name: name })
    console.log(this.breadCumb);
    this.selectedCat = id

    this.http.get(`${environment.url}/list-sub/${id}`).subscribe(
      (res: any) => {
        console.log(res);
        this.mainCats = res.category
        this.listInput()
      }
    )
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
    console.log(e.detail.value + 1);

    this.ilceler = cities.ilce
    this.ilceOfOlce = []


    var m = parseInt(e.detail.value) - 1
    console.log(cities.iller[m].name);
    this.saveIl = cities.iller[m].name
    var n = cities.iller[m].name
    console.log(n);
    this.listIl = n


    for (let i = 0; i < this.ilceler.length; i++) {

      if (this.ilceler[i].il_id == e.detail.value) {
        this.ilceOfOlce.push({ id: this.ilceler[i].id, name: this.ilceler[i].name })
        this.selectedIlce = this.ilceler[i].name
      }
    }
    console.log(this.ilceOfOlce);
  }
  getToIlce(e) {
    console.log(e.detail.value);
    this.listIlce = e.detail.value
    this.selectedIlce = e.detail.value
    this.saveIlce = e.detail.value
  }
  restartCat() {
    this.breadCumb = []
    this.listMain()
    this.isInputs = false
    this.listTitle = ""
    this.desc = ""
    this.selectedCat = ""
    this.vals = []
    this.isNew = ""
    this.saveIl = ""
    this.saveIlce = ""
    this.price = ""
    this.breadCumbarr = []
  }






  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }





  shufleRondom() {
    this.http.post(`${environment.url}/listrandom`, { name: "" }).subscribe(
      (res: any) => {
        console.log(res.foundedUsers);
        this.randomusers = this.randomArrayShuffle(res.foundedUsers)
        this.content.scrollToTop(400);
      }
    )
  }
  randomArrayShuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
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

  dateToSgin(a) {

    let c = new Date(a); // yyyy-mm-dd
    let m = Number(c.toLocaleString('default', { month: 'numeric' }));
    let d = Number(c.toLocaleString('default', { day: 'numeric' }));

    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
    const signs = ["Kova", "Balık", "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay", "Oğlak"];


    if (m == 0 && d <= 20) {

      m = 11;
    } else if (d < days[m]) {

      m--;
    };

    return signs[m];
  }

  getAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }
  dismiss() {
    this.modalController.dismiss()
  }

  onImageSelect(): Promise<any> {
    return this.camera.getPicture(this.options)
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
  fileTransObj: FileTransferObject;
  async uploadImage(path) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.filePath.resolveNativePath(path).then(nativePath => {
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

      this.fileTransObj.upload(nativePath, `${environment.url}/list-add-photo`, options)
        .then(
          async (res) => {

            this.presentToast('Photo Added Successfully')
            await loading.dismiss()

          },
          async (err) => {
            await loading.dismiss().then(() => { this.presentToast(err.message) })
          }
        )

    }).catch(err => this.presentToast(err.message));
  }
}
