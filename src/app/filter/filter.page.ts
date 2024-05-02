import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { cities } from 'src/environments/cities';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  selectedGender : string
  selectedCity : string
  genderf : string
  genderm : string
  iller : any
  
  lowerAge : number
  upperAge : number

  constructor(
    private modalController : ModalController,
    private router : Router,
    private navCtrl : NavController
  ) {
    this.iller = cities.iller
    console.log(this.iller);
    
    this.genderf = "unchecked"
    this.genderm = "unchecked"
   }
  ngOnInit() {
  }
  selectFr(){
    this.selectedGender = "female"
    this.genderf = "checked"
    this.genderm = "unchecked"
  }
  selectM(){
    this.selectedGender = "male"
    this.genderm = "checked"
    this.genderf = "unchecked"

  }
  goBack(){
    this.navCtrl.back()

  }
  selectCity(val){
   
    this.selectedCity = val.detail.value
  }
  goFilterResult(){
    this.dismiss()
     // this.router.navigateByUrl(`/profile/${user1}`);
    // this.router.navigateByUrl(`/filter-result`);
     this.router.navigate([`/filter-result`], { queryParams: { gender: this.selectedGender, city: this.selectedCity, minage : this.lowerAge, maxage : this.upperAge} });
  }
  ageRange(event){
    console.log(event);
    this.lowerAge = event.detail.value.lower
    this.upperAge = event.detail.value.upper
    
  }
  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
