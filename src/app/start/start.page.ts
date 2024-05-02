import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InternetService } from '../internet.service';



const {SplashScreen} = Plugins;

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  credentials: FormGroup;
  passwordToggleIcon: string = 'eye';
  showPassword: boolean = false;
  internetAccess:boolean;

  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private internet: InternetService,
    
  ) {
    this.internet.getNetworkState().subscribe(s=>{
    this.internetAccess = s;
  })
  }
 
  ngOnInit() {
    
    this.credentials = new FormGroup({

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

  ionViewDidEnter(){
    SplashScreen.hide()
  }

 
  async login() {
    
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();        
        this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        if(res && res.error && res.error.code && res.error.code == 1){
          const alert = await this.alertController.create({
            header: this.trans.instant('ALERTS.LOGIN.loginFailed'),
            message: this.trans.instant('ALERTS.LOGIN.wrongData'),
            buttons: ['OK'],
          });
          await alert.present();
        }
        else{
          const alert = await this.alertController.create({
            header: this.trans.instant('ALERTS.LOGIN.loginFailed'),
            message: res.message,
            buttons: ['OK'],
          });
          await alert.present();
        }
        
      }
    );
  }
 
  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('password');
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

}
