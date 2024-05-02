import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController, ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { environment } from './../../environments/environment'
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();


import { IconsService } from '../icons.service';
import { AuthenticationService } from '../authentication.service';
import { Location } from "@angular/common";
import { RelationTestPage } from '../relation-test/relation-test.page';

import { Preferences } from '@capacitor/preferences';
import { Browser } from '@capacitor/browser';
import { TranslateService } from '@ngx-translate/core';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage   {
  userInfo: any = { name: '', rating: '', ratecount: '', email: '', gender: '', accountType: '', businessCategory: '', birthday: '', bio: '', messagecount: '', city: '' }
  myId
  id: string
  isLoading = true
  other = false
  convId
  condition: number = 0;
  inner: Number
  showData = false;
  isRejected = false;
  isPending = false;
  isNormal = false;
  list: any[] = new Array(5);
  //requests
  requests = {

    messaging: 'notSent',
    callvideo: 'notSent',
    callvoice: 'notSent',
    gender: 'notSent',
    birthday: 'notSent',
    email: 'notSent',
    mobile: 'notSent',

    instagram: 'notSent',
    youtube: 'notSent',
    facebook: 'notSent',
    messenger: 'notSent',
    twitter: 'notSent',
    tiktok: 'notSent',
    pinterest: 'notSent',
    snapchat: 'notSent',
    whatsapp: 'notSent',
    qq: 'notSent',
    line: 'notSent',
    wechat: 'notSent',
    kik: 'notSent',
    kakaoTalk: 'notSent',
    reddit: 'notSent',
    telegram: 'notSent',
    vk: 'notSent',
    skype: 'notSent',
    linkedin: 'notSent',
    discord: 'notSent',
    tumblr: 'notSent',
    twitch: 'notSent',
    steam: 'notSent',
    github: 'notSent',
    ok: 'notSent',
  }
  userlist
  allList
  hobbies : any
  selectedTab : string
  constructor(
    private acticeRoute: ActivatedRoute,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private router: Router,
    private trans: TranslateService,
    private modalController: ModalController,
    private userSer: IconsService,
    private authSer: AuthenticationService,
    private location: Location,
    private navCtrl: NavController


  ) {
    this.selectedTab = 'etkinlik'
    this.hobbies = [
      {"id":"1","name":"spor"},
      {"id":"2","name":"burçlar"},
      {"id":"3","name":"teknoloji"},
      {"id":"4","name":"piercing"},
      {"id":"5","name":"bisiklet"},

      {"id":"23","name":"yazılım"},
      {"id":"24","name":"puzzle"},
      {"id":"25","name":"hayvanlar"},
      {"id":"26","name":"kediler"},
      {"id":"26","name":"köpkeler"},
      {"id":"26","name":"mobilya"},
    ]
    this.listByCat('645c237e56cf8b4cb5a6b58c')
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const m = helper.decodeToken(token.value);
        this.myId = m.id
        this.id = m.id
        this.profileDetails(this.myId)
        this.userLists(this.id)
        console.log(this.myId);
        
      }
    })

  }


  userLists(id) {
    
    this.http.get(`${environment.url}/list-user-lists/${id}`).subscribe(
      (res: any) => {
        console.log(res);
        
        this.userlist = res.list


      },
      (err) => { this.presentToast("Tekrar deneyiniz") }
    )
  }

  myBackButton() {
    this.location.back();
  }
  onAsk(t, e) {
    this.askAll = false
    console.log(t, e.innerText, this.requests[t]);
    e.innerHTML = `<ion-spinner style="color: var(--ion-color-medium-shade); height:80%;"></ion-spinner>`;

    return new Promise((resolve, reject) => {
      this.http.post(`${environment.url}/send-request`, { otherId: this.id, type: t }).subscribe(
        (res: any) => {
          this.requests[t] = 'pending'
          resolve(true)
        },
        (err) => {
          this.presentToast("Hata oluştu lütfen tekrar deneyin");
          resolve(false)
        }
      )
    })
  }


  askAll = true;
  async onAskAll() {

    const a: any = document.querySelectorAll('.ask-button');

    for (const element of a) {
      if (element.id != 'all') {
        await this.onAsk(element.id, element);
      }
    }

  }

  onMore() { }
  showPhoto(url) {
    const extra =
      this.router.navigate(['/photo-viewer'], { queryParams: { img: url } })
  }

  selectTab(id){
    this.selectedTab = id
  }


  profileDetails(myId) {
      console.log(myId);
      
    this.http.get(`${environment.url}/profile/${myId}`).pipe(take(1)).subscribe((user: any) => {
      console.log(this.userInfo);
      this.condition=     this.inner = Number(user.rating / (user.ratecount))

      this.userInfo.name = user.name
      this.userInfo.rating = user.rating
      this.userInfo.ratecount = user.ratecount
      this.userInfo.email = user.email
      this.userInfo.gender = user.gender
      this.userInfo.accountType = user.accountType
      this.userInfo.businessCategory = user.businessCategory
      this.userInfo.birthday = user.birthday
      this.userInfo.bio = user.bio
      this.userInfo.mobile = user.mobile
      this.userInfo.profilePicture = user.profilePicture
      this.userInfo.photos = user.photos
      this.userInfo.socialAccounts = user.socialAccounts
      this.userInfo.votedBy = user.votedBy
      this.userInfo.messagecount = user.messagecount
      this.userInfo.city = user.city
      this.userInfo.horoscop = user.horoscop
      this.userInfo.hobbies = user.hobbies
      this.userInfo.avatarimg = user.avatarimg
      if (
        user.businessCategory
        && user.businessCategory != 'restaurant'
        && user.businessCategory != 'fastFood'
        && user.businessCategory != 'cafe'
        && user.businessCategory != 'bakery'
        && user.businessCategory != 'pastry'
        && user.businessCategory != 'store'
        && user.businessCategory != 'hotel'
        && user.businessCategory != 'bar'
        && user.businessCategory != 'carService'
        && user.businessCategory != 'carRepair'
        && user.businessCategory != 'carStore'
        && user.businessCategory != 'gym'
        && user.businessCategory != 'barber'
        && user.businessCategory != 'pharmacy'
        && user.businessCategory != 'taxi'
      ) { this.other = true }


      if (user.accountType == 'business') {
        this.trunLoadingOff()
      }
      else if (user.accountType == 'personal') {
        if (this.id == this.myId) {
          this.trunLoadingOff()
        }
        else {
          this.trunLoadingOff()

          this.http.post(`${environment.url}/check-request`, { otherId: this.id }).subscribe(
            (res: any) => {
              console.log(res)
              if (res && res.requests && res.requests.length > 0) {
                const reqs: any[] = res.requests;
                reqs.forEach((element: any) => {
                  this.requests[element.type] = element.status;
                });
                this.trunLoadingOff()
              }
              else {
                this.trunLoadingOff()
              }


            },
            (err) => { this.presentToast("Hata oluştu lütfen tekrar deneyin") }
          )

        }
      }
      this.trunLoadingOff()

    },
      (err) => {
        this.presentToast(err.message);
      }
    );


  }


  trunLoadingOff() {
    setTimeout(() => {
      this.isLoading = false
    }, 500);
  }

  onMail() {
    if (
      (this.userInfo.accountType == 'business' || this.id == this.myId) ||
      (this.userInfo.accountType == 'personal' && this.id != this.myId && this.requests['email'] == 'accepted')
    ) {

      window.open(`mailto:${this.userInfo.email}`, '_system');
    }

  }
  listByCat(id) {
    this.http.get(`${environment.url}/list-lists/${id}/createdAt/-`).subscribe(
      (res: any) => {
        this.allList = res.list
        console.log(this.allList);

      }
    )
  }
  async onMob() {
    if (
      (this.userInfo.accountType == 'business' || this.id == this.myId) ||
      (this.userInfo.accountType == 'personal' && this.id != this.myId && this.requests['mobile'] == 'accepted')
    ) {

      const actionSheet = await this.actionSheetController.create({

        buttons: [{
          text: this.trans.instant('PROFILE.call'),
          icon: 'call',
          handler: () => {
            this.onTel()
          }
        }, {
          text: this.trans.instant('PROFILE.sendMessage'),
          icon: 'chatbubble',
          handler: () => {
            this.onMessage()
          }
        },
        ]
      });

      await actionSheet.present();
    }

  }

  onTel() {
    window.open(`tel:${this.userInfo.mobile}`, '_system');
  }
  onMessage() {
    window.open(`sms:${this.userInfo.mobile}`, '_system');
  }

  async onSocial(link: string, type: string) {
    const actionSheet = await this.actionSheetController.create({

      buttons: [
        {
          text: this.trans.instant('PROFILE.openInBrowser'),
          icon: 'globe',
          handler: () => {
            this.openInBrowser(link, type);
          }
        },
        {
          text: this.trans.instant('PROFILE.openInApp'),
          icon: 'apps',
          handler: () => {
            this.openInApp(link, type);
          }
        },
      ]
    });

    await actionSheet.present();

  }

  async openInBrowser(link: string, type: string) {
    if (type == 'whatsapp') { window.open(`https://wa.me/${link}`, '_system'); }
    else {
      await Browser.open({ url: link })
      //window.open(link, '_system');
    }
  }
  openInApp(link: string, type: string) {
    console.log(link, type);
    

    if (type == 'discord') { window.open(`${link}`, '_system'); }
    if (type == 'facebook') { window.open(`fb://facewebmodal/f?href=${link}`, '_system'); }
    if (type == 'messenger') { window.open(`${link}`, '_system'); }
    if (type == 'github') { window.open(`${link}`, '_system'); }
    if (type == 'instagram') { window.open(`instagram://user?username=${link.split('instagram.com/')[1]}`, '_system'); }
    if (type == 'kakaotalk') { window.open(`${link}`, '_system'); }
    if (type == 'kik') { window.open(`${link}`, '_system'); }
    if (type == 'line') { window.open(`${link}`, '_system'); }
    if (type == 'linkedin') { window.open(`linkedin://profile?id=${link.split('linkedin.com/in/')[1]}`, '_system'); }
    if (type == 'ok') { window.open(`${link}`, '_system'); }
    if (type == 'other') { window.open(link, '_system'); }
    if (type == 'pinterest') { window.open(`pinterest://user/${link.split('pinterest.com/')[1]}`, '_system'); }
    if (type == 'qq') { window.open(`${link}`, '_system'); }
    if (type == 'reddit') { window.open(`${link}`, '_system'); }
    if (type == 'skype') { window.open(`${link}`, '_system'); }
    if (type == 'snapchat') { window.open(`snapchat://add/${link.split('snapchat.com/add/')[1]}`, '_system'); }
    if (type == 'steam') { window.open(`${link}`, '_system'); }
    if (type == 'tiktok') { window.open(`${link}`, '_system'); }
    if (type == 'tumblr') { window.open(`${link}`, '_system'); }
    if (type == 'twitch') { window.open(`${link}`, '_system'); }
    if (type == 'twitter') { window.open(`twitter://user?user_name=${link.split('twitter.com/')[1]}`, '_system'); }
    if (type == 'vk') { window.open(`vk://${link.split('//')[1]}`, '_system'); }
    if (type == 'wechat') { window.open(`${link}`, '_system'); }
    if (type == 'whatsapp') { window.open(`https://wa.me/${link}`, '_system'); }
    if (type == 'youtube') { window.open(`vnd.youtube://${link.split('//')[1]}`, '_system'); }
  }

  onSendMessage() {
    if (this.myId == this.id) {
      return this.presentToast(this.trans.instant('PROFILE.noMyProfileSend'))
    }
    this.http.post(`${environment.url}/get-conv-id`, { otherId: this.id }).subscribe(
      (res: any) => {
        if (res && res.convId) {
          this.convId = res.convId;
          this.router.navigate([`/chat/${this.id}`], { queryParams: { convId: this.convId, name: this.userInfo.name , profileimg: this.userInfo.profilePicture.fileName

          } });
        }
      },
      (err) => {
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    )


  }

  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

  openConv(user1, user2, convId, user1Name, user2Name) {
    console.log(this.userInfo.profilePicture.publicPath);

    if (user1 == this.myId) {
      this.router.navigate([`/chat/${user2}`], {
        queryParams: {
          convId: convId, name: user2Name, profileimg: this.userInfo.profilePicture.publicPath
        }
      });
    }
    if (user2 == this.myId) {
      this.router.navigate([`/chat/${user1}`], {
        queryParams: {
          convId: convId, name: user1Name, profileimg: this.userInfo.profilePicture.publicPath
        }
      });
    }
  }





  async startRelationtest(user1, user2, convId, user1Name, user2Name) {
    const modal = await this.modalController.create({
      component: RelationTestPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'roomid': convId,
        'user1': user1,
        'user2': user2,
        'user1Name': user1Name,
        'user2Name': user2Name
      }
    });
    return await modal.present();
  }




  callPersonWithIds(id) {
    this.router.navigateByUrl(`/callvideo/${id}`);
  }

  review(userrate, ratecount, i) {
    this.condition = i + 1;
    i = i + 1;
    let totalrate = +userrate + +i
    console.log(this.id, i, totalrate)
    var writebyid = 0
    this.inner = Number(totalrate / (+ratecount + +1))

    var usernewrate =  (userrate + i) / (ratecount + +1)
    this.http.post(`${environment.url}/user-rating`, {
      rating: totalrate,
      userId: this.id,
      ratecount: +ratecount + +1,
      retes: usernewrate
    }).subscribe(
      (res: any) => {
        console.log(res)
      },
      (err) => { console.log(err) }
    );

  }
  gotoRelationtest() {
    this.router.navigateByUrl('/relation-test')
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

  isBlocked = false

  blockedBefore = false
  checkBlock() {
    this.http.post(`${environment.url}/check-blocked-user`, { user1: this.myId, user2: this.id }).subscribe(
      (res: any) => {
        console.log(res.extraData)
        if (res && res.checked) {
          this.isBlocked = res.checked;
          if (res.extraData.length < 0) { this.blockedBefore = false }
          else if (res.extraData.length == 1) {
            if (res.extraData[0].user1 == this.myId && res.extraData[0].user2 == this.id) { this.blockedBefore = true }
          }
          else if (res.extraData.length == 2) { this.blockedBefore = true }
        }
      },
      (err) => { this.isBlocked = false }
    )
  }
goTo(){
  this.router.navigate(['/tab5'])
}
  async presentActionSheet() {
    const actionSheet2 = await this.actionSheetController.create({
      buttons: [
        {
          text: "Ayarlar",
          icon: 'alert-circle-outline',
          handler: () => {
            this.goTo()
          }
        }
      ]
    });

    await actionSheet2.present();

  }
}
