import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { AlertService } from '../alert.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  isCodeSent=false
  credentials
  passwordToggleIcon: string = 'eye';
  showPassword: boolean = false;
  emailForm
  userEmail:string
  constructor(private authSer:AuthenticationService, 
    private alertController: AlertController, 
    private router: Router,
    private loadingController: LoadingController,
    private alertSer: AlertService,
    private toastController: ToastController,
    
    ) { }

  ngOnInit() {
    this.credentials = new FormGroup({

      code: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      }),

    });

    this.emailForm = new FormGroup({

      email: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.email]
      }),

    });
  }
  get email(){return this.emailForm.get('email')}
  get code(){return this.credentials.get('code');}
  get password(){return this.credentials.get('password');}


  async sendCode(){

  }


  async resetPassword()
  {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authSer.resetPassword({email: this.userEmail, code: this.credentials.value.code, password: this.credentials.value.password})
    .subscribe(
      async (res) => {
        await loading.dismiss();
        this.presentToast("Başarılı bir şekilde yapıldı...");
        this.router.navigateByUrl('/login', { replaceUrl: true });

      },
      async (res) => {
        await loading.dismiss();
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    );
  }

  async sendResetCode()
  {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authSer.passwordResetCode(this.emailForm.value.email)
    .subscribe(
      async (res) => {
        this.userEmail = this.emailForm.value.email
        this.isCodeSent = true
        await loading.dismiss();
        this.presentToast("Başarılı bir şekilde yapıldı...");

      },
      async (res) => {
        await loading.dismiss();
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    );
  }

  togglePassword(){
    if(this.showPassword === false) 
    { 
      this.passwordToggleIcon = "eye-off";
      this.showPassword = true; 
      console.log("show password is true");
    }
    
    else if(this.showPassword === true) 
    {  
      this.passwordToggleIcon = "eye";
      this.showPassword = false;
      console.log("show password is false");
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
