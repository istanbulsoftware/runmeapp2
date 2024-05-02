import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  credentials: FormGroup
  constructor(
  private router: Router,
  private http: HttpClient,
  private loadingController: LoadingController,

  private toastController: ToastController) 
  {

    this.credentials = new FormGroup({

      type: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      name: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),


    })

  }

  get name(){return this.credentials.get('name')}
  get type(){return this.credentials.get('type')}

  ngOnInit() {
  }

  async onAddLink(){
  
    const loading = await this.loadingController.create();
    await loading.present();

    this.http.post(`${environment.url}/add-social-accont`,{
      name: this.credentials.value.name,
      type: this.credentials.value.type
    }).subscribe(
      async(res)=>{
        await loading.dismiss()
        this.presentToast("Başarılı bir şekilde yapıldı...")
        this.router.navigateByUrl('/social-accounts')
      },
      async(err)=>{
        await loading.dismiss()
        this.presentToast("Hata oluştu lütfen tekrar deneyin")
      }
    )
  }


  async presentToast(m:string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }

}
