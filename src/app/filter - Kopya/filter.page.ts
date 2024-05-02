import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

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
    private router : Router
  ) {
    this.iller = ['','Adana', 'Adıyaman', 'Afyon', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
    'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
    'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 
    'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 
    'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya',
    'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
    'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak',
    'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce']
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
