import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social-accounts',
  templateUrl: './social-accounts.page.html',
  styleUrls: ['./social-accounts.page.scss'],
})
export class SocialAccountsPage implements OnInit {
  accounts = []
  spin = true
  constructor(
    private http: HttpClient,
    private router: Router,
    private alertCtl: AlertController,
    private loadingController: LoadingController,
    private toastCtl: ToastController,
    private actionSheetController: ActionSheetController,
    
    ) { }

  ngOnInit() {
    this.syncAccounts();
  }

  ionViewWillEnter(){
    this.syncAccounts();
  }

  syncAccounts(){
    this.spin = true
    this.http.get(`${environment.url}/get-social-accounts`).subscribe(

      async(res:any)=>{
        console.log(res);
        this.accounts = res.data;
        this.spin = false
      },
      async(err)=>{
        console.log(err);
      }

    )
  }

  onAdd(){
    this.router.navigateByUrl('social-accounts/add');
  }

  onEdit(id:string){
    let data:{id:string, name:string, type:string}
    let navigationExtras: NavigationExtras
    for(let i in this.accounts){
      if (this.accounts[i]._id == id){
        navigationExtras= {
          queryParams: {id: id, name: this.accounts[i].name, type: this.accounts[i].type}
        }
      }
    }
    this.router.navigate(['social-accounts/edit'] , navigationExtras);
  }

  async onDelete(id:string){
    const loading = await this.loadingController.create();
    await loading.present();
    this.http.post(`${environment.url}/delete-social-accont`,{id: id}).subscribe(
      async(res)=>{
        await loading.dismiss()
        this.presentToast("Başarılı bir şekilde silindi")
        this.syncAccounts()
      },
      async(res)=>{
        await loading.dismiss()
        this.presentToast("Hata oşluştu lütfen tekrar deneyiniz")
      }
      )
  }

  async presentActionSheet(id:string) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
      {
        text: "Düzenle",
        icon: 'create',
        handler: () => {
          this.onEdit(id);
        }
      }, 
      {
        text: "Sil",
        icon: 'trash',
        handler: () => {
          this.onDelete(id);
        }
      }, 
   
    ]
    });
  
    await actionSheet.present();
  }

  async presentToast(m: string) {
    const toast = await this.toastCtl.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
