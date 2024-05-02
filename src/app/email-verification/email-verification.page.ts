import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { AlertService } from '../alert.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit {
  @ViewChild("ngOtpInput", { static: false })
  ngOtpInput: any; config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "*",
    inputStyles: {
      width: "60px",
      height: "60px",
      borderRadius: '10px',
    },
  };

  showOtpComponent = true;
  otp: string | any;
  value:any=[]
  credentials
  constructor(private authSer:AuthenticationService, 
    private alertController: AlertController, 
    private router: Router,
    private loadingController: LoadingController,
    private alertSer: AlertService,
    private toastController: ToastController
    ) { }
goLogin(){
  this.router.navigateByUrl("/signup")
}
  ngOnInit() {
    this.credentials = new FormGroup({

      code: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),

    });
  }

  get code(){return this.credentials.get('code');}

  async verifyEmail(a)
  {
    var b = a.replace(/\D/g, "");
    const loading = await this.loadingController.create();
    await loading.present();
    console.log(b);

    this.authSer.verifyEmail(b)
    .subscribe(
      async (res) => {
        await loading.dismiss();
        this.presentToast("Başarılı bir şekilde yapıldı...");
        this.router.navigateByUrl('/tabs/advert-real', { replaceUrl: true });

      },
      async (res) => {
        await loading.dismiss();
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    );
  }

  async resendCode()
  {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authSer.resendCode()
    .subscribe(
      async (result) => {
        await loading.dismiss();
        this.presentToast("Başarılı bir şekilde yapıldı...");
              
      },
      async (res) => {
        await loading.dismiss();
        this.presentToast("Hata oluştu lütfen tekrar deneyin");
      }
    );
  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }
  onOtpChange(otp: any) {
    console.log(JSON.stringify(otp));
    
    this.otp = otp; // When all 4 digits are filled, trigger OTP validation method 
    if (otp.length == 4) { this.validateOtp(JSON.stringify(otp)); }
  }
  setVal(val: any) {
    if(this.value.length<4){
      this.value.push(val);
      this.ngOtpInput.setValue(this.value.join(''));
    }
  }
  dellVal(){
    if(this.value.length>=1){
      this.value.splice(this.value.length-1,1);
      this.ngOtpInput.setValue(this.value.join(''));
    }
  }
  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }
  validateOtp(a) {
    // write your logic here to validate it, you can integrate sms API here if you want 
    this.verifyEmail(a)
  }
}
