import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  sub: Subscription
  id: string
  oldName:string
  oldType: string
  constructor( 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController,
    
    ) { 

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
      

    this.sub = this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.oldType = params['type']; 
      this.oldName = params['name']; 
      this.credentials.controls.type.setValue(this.oldType);
      this.credentials.controls.name.setValue(this.oldName);
      console.log(params);
      
 });
  }

  credentials: FormGroup


  get name(){return this.credentials.get('name')}
  get type(){return this.credentials.get('type')}

  ngOnInit() {
  }

  async onEditLink(){
  
    const loading = await this.loadingController.create();
    await loading.present();

    this.http.post(`${environment.url}/edit-social-accont`,{
      id: this.id,
      name: this.credentials.value.name,
      type: this.credentials.value.type
    }).subscribe(
      async(res)=>{
        await loading.dismiss()
        await this.presentToast("Başarılı bir şekilde yapıldı...")
        this.router.navigateByUrl('/social-accounts')
      },
      async(err)=>{
        await loading.dismiss()
        await this.presentToast("Hata oluştu lütfen tekrar deneyin")
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
