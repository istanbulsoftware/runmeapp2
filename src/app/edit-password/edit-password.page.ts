import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../alert.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
})
export class EditPasswordPage implements OnInit {
  isCodeSent=false
  credentials
  
  constructor(private authSer:AuthenticationService, 
    private alertController: AlertController, 
    private router: Router,
    private loadingController: LoadingController,
    private alertSer: AlertService,
    private trans: TranslateService,
    private toastController: ToastController
    ) { }

  ngOnInit() {
    this.credentials = new FormGroup({

      oldPassword: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      }),
      newPassword: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      }),

    });

  }
  get oldPassword(){return this.credentials.get('oldPassword')}
  get newPassword(){return this.credentials.get('newPassword');}


  async changePassword()
  {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authSer.changePassword(this.credentials.value.oldPassword, this.credentials.value.newPassword)
    .subscribe(
      async (res) => {
        await loading.dismiss();
        this.presentToast(this.trans.instant('ALERT.success'));
        this.router.navigateByUrl('/edit-account', { replaceUrl: true }); 

      },
      async (res) => {
        await loading.dismiss();
        this.presentToast(this.trans.instant('ALERT.fail'));
      }
    );
  }

  

  passwordToggleIcon: string = 'eye';
  showPassword: boolean = false;
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

  newPasswordToggleIcon: string = 'eye';
  showNewPassword: boolean = false;
  toggleNewPassword(){
    if(this.showNewPassword === false) 
    { 
      this.newPasswordToggleIcon = "eye-off";
      this.showNewPassword = true; 
    }
    
    else if(this.showNewPassword === true) 
    {  
      this.newPasswordToggleIcon = "eye";
      this.showNewPassword = false;
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
