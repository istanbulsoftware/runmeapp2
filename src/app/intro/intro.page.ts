import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
theSeconds: number
intervalId
  constructor(
    private modalController : ModalController,
    private activatedRoute : ActivatedRoute
  ) { 

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
  ionViewWillEnter(){
    this.theSeconds = 10

    this.intervalId = setInterval(() => {
      
      this.theSeconds = this.theSeconds - 1;
      console.log();
      
      if(this.theSeconds === 0) { 
        this.dismiss()
      }
    }, 1000);
  }
  ionViewDidLeave(){
    console.log("sdfasdf");
    this.theSeconds = 10
    clearInterval(this.intervalId);
  }
}
