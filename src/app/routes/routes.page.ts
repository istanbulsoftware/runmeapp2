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

import { NotificationService } from '../notification.service';
import { FilterPage } from '../filter/filter.page';
import { IntroPage } from '../intro/intro.page';
import { Preferences } from '@capacitor/preferences';
import { LanguageService } from '../language.service';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage   {

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

  ishand : string
  listNo: string
  il: string
  ilce : string
  saleRent : string
  selectedLang : string
  startPrice : number
  endPrice : number


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
    private languaageservice : LanguageService


  ) {
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

    this.internet.getNetworkState().subscribe(s => {
      this.internetAccess = s;
    });

  }
  searchText: string = ''
  search(value: string) {
    this.searchText = value
  }

  newConversation() {
    this.router.navigateByUrl('/search');
  }



  ngOnInit() {
    this.userSer.getUser().subscribe((user: any) => {
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
  filterNow() {
    var a ={
      catId : '645c237e56cf8b4cb5a6b58c',
      listTitle : this.listTitle,
      saleRent  : this.saleRent,
      ishand: this.ishand,
      listNo: this.listNo,
      il: this.il,
      ilce: this.ilce,
      startPrice : this.startPrice,
      endPrice: this.endPrice
    }
    console.log(a);
    
    this.http.post(`${environment.url}/list-filter-now`, a).subscribe(
      (res: any) => {
        console.log(res);
        
        this.allList = res
        console.log(this.allList);
        this.dismiss()

      }
    )
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




  ionViewWillEnter() {
    this.selectedLang = this.languaageservice.getLanguage()

    this.listMain()
    this.listByCat('645c237e56cf8b4cb5a6b58c')
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const de = helper.decodeToken(token.value);
        this.myId = de.id;
        this.socket.emit('joinChat', { roomId: de.id });
      }
    })
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
    this.http.get(`${environment.url}/list-by-salerent/645c237e56cf8b4cb5a6b58c/${salrent}`).subscribe(
      (res: any) => {
        this.allList = res.list
        console.log(this.allList);
        this.listBoostssalerent('645c237e56cf8b4cb5a6b58c', salrent)

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

  listAll() {
    this.http.get(`${environment.url}/list-all-lists`).subscribe(
      (res: any) => {
        this.allList = res.list
        console.log(this.allList);

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
      var ilId  =  parseInt(e.detail.value) - 1
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
getIlce(e){
this.ilce = e.detail.value
}
  restartCat() {
    this.breadCumb = []
    this.listMain()
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
