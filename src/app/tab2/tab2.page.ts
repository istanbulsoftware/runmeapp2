import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, IonSlides, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild(IonSlides) slides
  segment: string = "received";

  received = [];
  sent = [];
  received2 = [];

  isLoading = false
  activeslide: number
  items : any
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router,
    private actionSheetController: ActionSheetController,
    
    private notifi: NotificationService
  ) {
    this.activeslide = 0
    this.syncRequests()
    this.syncSent()
    this.userLists()
  }

  onDetail(id) {
    const a = document.getElementById(id);
    a.classList.toggle('open');
    a.classList.toggle('close');
  }

  ionViewWillEnter() {
    this.syncRequests();
    this.notifi.resetReq()
  }

  segmentChanged(e) {
    console.log(e.target.value)
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
  syncRequests() {
    this.isLoading = true
    this.http.get(`${environment.url}/my-requests`).subscribe(
      (res: any) => {
        console.log(res);
        this.received = res;
        this.isLoading = false;
      },
      (err) => {

        this.presentToast("Hata oluştu lütfen tekrar deneyin")
        this.isLoading = false;
      }
    )
  }

  syncSent() {
    this.isLoading = true
    this.http.get(`${environment.url}/my-sent-requests`).subscribe(
      (res: any) => {
        this.sent = res;
        console.log(this.sent)
        this.isLoading = false;
      },
      (err) => {

        this.presentToast("Hata oluştu lütfen tekrar deneyin")
        this.isLoading = false;
      }
    )
  }

  openProfile(id) {
    this.router.navigateByUrl(`/profile/${id}`);
  }
  openListdetail(id) {
    this.router.navigateByUrl(`/advert-detail/${id}`);
  }


  onAccept(reqId, itemId, e, i, j) {
    console.log(this.received[i].requests[j])
    e.target.innerHTML = `<ion-spinner style="color: var(--ion-color-primary-shade); height:80%;"></ion-spinner>`;
    this.http.post(`${environment.url}/change-request`, { id: reqId, requestId: itemId, requestStatus: 'accepted' }).subscribe(
      (res: any) => {

        this.received[i].requests[j].status = 'accepted'
      },
      (err) => { this.presentToast("Hata oluştu lütfen tekrar deneyin") }
    )
  }


  onReject(reqId, itemId, e, i, j) {

    e.target.innerHTML = `<ion-spinner style="color: var(--ion-color-danger-shade); height:80%;"></ion-spinner>`;
    this.http.post(`${environment.url}/change-request`, { id: reqId, requestId: itemId, requestStatus: 'rejected' }).subscribe(
      (res: any) => {

        this.received[i].requests[j].status = 'rejected'
      },
      (err) => { this.presentToast("Hata oluştu lütfen tekrar deneyin") }
    )
  }

  async acceptAction(reqId, itemId, e, i, j) {
    const actionSheet = await this.actionSheetController.create({
      header: "Bu alanı girmeniz zorunludur",
      buttons: [{
        text: "Kapat",
        icon: 'close-outline',
        handler: () => {
          this.onReject(reqId, itemId, e, i, j);
        }
      }]
    });

    await actionSheet.present();
  }

  async rejectAction(reqId, itemId, e, i, j) {
    const actionSheet = await this.actionSheetController.create({
      header: "Bu alanı girmeniz zorunludur",
      buttons: [{
        text: "Kapat",
        icon: 'checkmark-outline',
        handler: () => {
          this.onAccept(reqId, itemId, e, i, j);
        }
      }]
    });

    await actionSheet.present();
  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }
  nextSlide(a) {
    this.activeslide = a
    this.slides.getActiveIndex().then(index => {

      this.slides.slideTo(a)
      // OR this.slides.slideTo(index + 1);
    });
  }
  nextSlidea(a) {
    console.log(a.target.swiper);

    if(a.target.swiper.activeIndex == 0) {
      this.activeslide = 0
      
    }else {
      this.activeslide = 1
    }
    


  }
}
