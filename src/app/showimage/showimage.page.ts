import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-showimage',
  templateUrl: './showimage.page.html',
  styleUrls: ['./showimage.page.scss'],
})
export class ShowimagePage implements OnInit {
imagename : string
  constructor(
    private modalController : ModalController,
    private navparams : NavParams
  ) {
    this.imagename = this.navparams.get('imagename')
   }

  ngOnInit() {

  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
