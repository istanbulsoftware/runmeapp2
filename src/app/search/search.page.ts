import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  conversations = []
  isLoading = false
  constructor(private http: HttpClient, private toastController: ToastController, private trans  : TranslateService
    ) { }

  ngOnInit() {
  }

  search(value:string){
    if(value.length < 1){return this.conversations = []}
    this.isLoading = true
    this.http.post(`${environment.url}/search`,{name: value}).subscribe(
      (res:any)=>{
        console.log(res);
        
        if(res && res.foundedUsers){
          this.conversations = res.foundedUsers;
          this.isLoading = false
        }
      },
      (err)=>{ this.presentToast(this.trans.instant("ALERT.fail"));this.isLoading = false},
    )
  }

  async presentToast(m:string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

}
