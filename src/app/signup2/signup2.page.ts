import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { AlertService } from '../alert.service';
import { AuthenticationService } from '../authentication.service';
import { InternetService } from '../internet.service';


@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page implements OnInit {
  internetAccess
  credentials: FormGroup
  
  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private internet: InternetService,
    ,
    private toastController: ToastController
  ) {
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

      email: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      }),

      birthday: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),

      businessCategory1: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      businessCategory2: new FormControl(null,{
        updateOn: 'change',
        validators: []
      }),

    });
  }

  passwordToggleIcon: string = 'eye';
  showPassword: boolean = false;

  async signup() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    if (this.credentials.value.businessCategory1 == 'other'){
      this.authService.signup({
        accountType: 'business',
        name: this.credentials.value.name,
        email: this.credentials.value.email,
        password: this.credentials.value.password,
        birthday: this.credentials.value.birthday,
        gender: null,
        city: null,
        businessCategory: this.credentials.value.businessCategory2,
      }).subscribe(
        async (res) => {
          await loading.dismiss();
          this.presentToast("Başarılı bir şekilde yapıldı...")
          this.router.navigateByUrl('/login', { replaceUrl: true });
          
        },
        async (res) => {
          if(res.status && res.status == 403){
            //email already registered
            await loading.dismiss();
            this.presentToast(this.trans.instant('SIGNUP.emailRegistered'))
          }else{
            await loading.dismiss();
            this.presentToast("Hata oluştu lütfen tekrar deneyin")
          }
        }
      );
    }

    if (this.credentials.value.businessCategory1 != 'other') {
      this.authService.signup({
        accountType: 'business',
        name: this.credentials.value.name,
        email: this.credentials.value.email,
        password: this.credentials.value.password,
        birthday: this.credentials.value.birthday,
        gender: null,
        city: null,
        businessCategory: this.credentials.value.businessCategory1,
      }).subscribe(
        async (res) => {
          await loading.dismiss();
          this.presentToast("Başarılı bir şekilde yapıldı...")
          this.router.navigateByUrl('/login', { replaceUrl: true });
          
        },
        async (res) => {
          if(res.status && res.status == 403){
            //email already registered
            await loading.dismiss();
            this.presentToast(this.trans.instant('SIGNUP.emailRegistered'))
          }else{
            await loading.dismiss();
            this.presentToast("Hata oluştu lütfen tekrar deneyin")
          }
        }
      );
    } 
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

  get birthday() {
    return this.credentials.get('birthday');
  }
  
  get businessCategory1() {
    return this.credentials.get('businessCategory1');
  }

  get businessCategory2() {
    return this.credentials.get('businessCategory2');
  }


  togglePassword(){
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
