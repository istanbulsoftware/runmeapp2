import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../alert.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.page.html',
  styleUrls: ['./edit-email.page.scss'],
})
export class EditEmailPage implements OnInit {
  
  isCodeSent=false
  credentials

  emailForm
  userEmail:string
  
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

      code: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
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


  async changeEmail()
  {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authSer.changeEmail({email: this.userEmail, code: this.credentials.value.code})
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

  async sendResetCode()
  {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authSer.changeEmailCode(this.emailForm.value.email)
    .subscribe(
      async (res) => {
        this.userEmail = this.emailForm.value.email
        this.isCodeSent = true
        await loading.dismiss();
        this.presentToast(this.trans.instant('ALERT.success'));

      },
      async (res) => {
        await loading.dismiss();
        this.presentToast(this.trans.instant('ALERT.fail'));
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

}
