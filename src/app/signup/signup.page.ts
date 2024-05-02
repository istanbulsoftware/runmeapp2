import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../authentication.service';
import { InternetService } from '../internet.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  internetAccess
  credentials: FormGroup
  iller = ['','Adana', 'Adıyaman', 'Afyon', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 
  'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 
  'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya',
  'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
  'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak',
  'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce']
  ages = ['15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37'
  ,'38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','60+']
  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private internet: InternetService,
    private trans : TranslateService,
    private toastController: ToastController
  ) {
    console.log(this.iller);
    
    this.internet.getNetworkState().subscribe(s=>{
    this.internetAccess = s;
  })
  }

  ngOnInit() {
    this.credentials = new FormGroup({

      name: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      surname: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      mobile: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      email: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      }),



    });
  }

  passwordToggleIcon: string = 'eye';
  showPassword: boolean = false;

 
  async signup() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.signup({
      accountType: 'personal',
      name: this.credentials.value.name,
      email: this.credentials.value.email,
      password: this.credentials.value.password,
      mobile: this.credentials.value.mobile,
      surname: this.credentials.value.surname,
      birthday: "",
      gender: "",
      city: "",
      businessCategory: null
    }).subscribe(
      async (res) => {
        await loading.dismiss();
        this.presentToast(this.trans.instant('ALERT.success'))
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      async (res) => {
        if(res.status && res.status == 403){
          //email already registered
          await loading.dismiss();
          this.presentToast(this.trans.instant('SIGNUP.emailRegistered'))
        }else{
          await loading.dismiss();
          this.presentToast(this.trans.instant('ALERT.fail'))
        }
      }
    );
  }
 
  // Easy access for form fields
  get name() {
    return this.credentials.get('name');
  }

  get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('password');
  }

  get mobile() {
    return this.credentials.get('mobile');
  }
  get surname() {
    return this.credentials.get('surname');
  }
  get gender() {
    return this.credentials.get('gender');
  }
  get city() {
    return this.credentials.get('city');
  }

  togglePassword(){
    console.log('aa');
    
    if(this.showPassword === false) 
    { 
      this.passwordToggleIcon = "eye-off";
      this.showPassword = true; 

    }
    
    else if(this.showPassword === true) 
    {  
      this.passwordToggleIcon = "eye";
      this.showPassword = false;

    }
  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
